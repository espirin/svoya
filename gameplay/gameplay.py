from datetime import datetime

from flask_login import login_required, current_user

from app import socketio, db
from config import config
from gameplay.state_handler import GameState, update_clients_state
from model import Game, BoardProgress, Question


@socketio.on('start_game', namespace='/host')
@login_required
def start_game(game_id):
    # Change game state to BOARD
    game = Game.query.filter(Game.id == game_id).first()
    game.state = GameState.BOARD.value
    game.current_board = game.pack.boards[0]
    game.current_board_progress = BoardProgress(board=game.current_board)
    db.session.commit()

    update_clients_state(game_id)


@socketio.on('open_question', namespace='/player')
@login_required
def open_question(data):
    question_id = data['question_id']
    game_id = data['game_id']

    # Change game state to QUESTION
    game = Game.query.filter(Game.id == game_id).first()
    game.state = GameState.QUESTION.value

    # Save temporary state
    game.temporary_state['question_id'] = question_id
    db.session.commit()

    update_clients_state(game_id)


@socketio.on('start_countdown', namespace='/host')
@login_required
def start_countdown(game_id):
    # Update clients
    socketio.emit('start_countdown', room=game_id, namespace="/player")

    # Change game state to COUNTDOWN
    game = Game.query.filter(Game.id == game_id).first()
    game.state = GameState.COUNTDOWN.value

    # Save temporary state
    game.temporary_state['countdown_winner'] = None
    game.temporary_state['countdown_start_time'] = datetime.now().isoformat()
    game.temporary_state['countdown_time_remaining'] = config.COUNTDOWN_DURATION
    db.session.commit()
    update_clients_state(game_id)


@socketio.on('end_countdown', namespace='/player')
@login_required
def end_countdown(game_id):
    # Change game state to CORRECT_ANSWER
    game = Game.query.filter(Game.id == game_id).first()
    question = Question.query.filter(Question.id == game.temporary_state['question_id']).first()
    if game.state == GameState.COUNTDOWN.value:
        game.state = GameState.CORRECT_ANSWER.value
        game.current_board_progress.answered_questions.append(question)
        game.temporary_state['countdown_winner'] = None
        db.session.commit()
        update_clients_state(game_id)


@socketio.on('answer_question', namespace='/player')
@login_required
def answer_question(game_id):
    # Check if first to answer
    game = Game.query.filter(Game.id == game_id).first()
    if game.state != GameState.COUNTDOWN.value:
        return "nope"

    # Change game state to ANSWERING
    game.state = GameState.ANSWERING.value
    db.session.commit()

    # Save winner
    game.temporary_state['countdown_winner'] = current_user.username
    game.temporary_state['countdown_start_time'] = datetime.now().isoformat()
    game.temporary_state['countdown_time_remaining'] -= \
        (datetime.now() - datetime.fromisoformat(game.temporary_state['countdown_start_time'])).microseconds

    db.session.commit()

    # Update clients
    update_clients_state(game_id)


@socketio.on('correct_answer', namespace='/host')
@login_required
def correct_answer(game_id):
    game = Game.query.filter(Game.id == game_id).first()
    question = Question.query.filter(Question.id == game.temporary_state['question_id']).first()

    # Add points
    game.scores[game.temporary_state['countdown_winner']] += question.price

    # Mark question as answered
    game.current_board_progress.answered_questions.append(question)

    # Change game state to CORRECT_ANSWER
    game.state = GameState.CORRECT_ANSWER.value
    db.session.commit()

    # Update clients
    update_clients_state(game_id)


@socketio.on('wrong_answer', namespace='/host')
@login_required
def wrong_answer(game_id):
    game = Game.query.filter(Game.id == game_id).first()
    question = Question.query.filter(Question.id == game.temporary_state['question_id']).first()

    # Subtract points
    game.scores[game.temporary_state['countdown_winner']] -= question.price

    if game.temporary_state['countdown_time_remaining'] <= 0:
        # Mark question as answered
        game.current_board_progress.answered_questions.append(question)

        # Change game state to CORRECT_ANSWER
        game.state = GameState.CORRECT_ANSWER.value
    else:
        # Change game state to COUNTDOWN
        game.state = GameState.COUNTDOWN.value

        # Update start time
        game.temporary_state['countdown_start_time'] = datetime.now().isoformat()

    db.session.commit()

    # Update clients
    update_clients_state(game_id)


@socketio.on('open_board', namespace='/host')
@login_required
def open_board(game_id):
    game = Game.query.filter(Game.id == game_id).first()
    game.state = GameState.BOARD.value
    db.session.commit()
    game.temporary_state.clear()

    # Update clients
    update_clients_state(game_id)
