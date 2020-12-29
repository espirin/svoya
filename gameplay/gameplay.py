from flask_login import login_required, current_user

from app import socketio, db
from gameplay.state_handler import GameState, update_clients
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

    update_clients(game_id)


@socketio.on('open_question', namespace='/')
@login_required
def open_question(question_id, game_id):
    # Change game state to QUESTION
    game = Game.query.filter(Game.id == game_id).first()
    game.state = GameState.QUESTION.value

    # Save temporary state
    game.temporary_state['question_id'] = question_id
    db.session.commit()

    update_clients(game_id)


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
    db.session.commit()


@socketio.on('end_countdown', namespace='/player')
@login_required
def end_countdown(game_id):
    # Change game state to CORRECT_ANSWER
    game = Game.query.filter(Game.id == game_id).first()
    if game.state == GameState.COUNTDOWN.value:
        game.state = GameState.CORRECT_ANSWER.value
        db.session.commit()


@socketio.on('answer_question', namespace='/player')
@login_required
def answer_question(game_id):
    # Check if first to answer
    game = Game.query.filter(Game.id == game_id).first()
    if not(game.state == GameState.COUNTDOWN.value and game.temporary_state['countdown_winner'] is None):
        return

    # Save winner
    game.temporary_state['countdown_winner'] = current_user.username

    # Change game state to ANSWERING
    game.state = GameState.ANSWERING.value
    db.session.commit()

    # Update clients
    socketio.emit('answering', current_user.username, room=game_id, namespace="/player")
    socketio.emit('answering', current_user.username, room=game_id, namespace="/host")


@socketio.on('correct_answer', namespace='/host')
@login_required
def correct_answer(question_id, game_id):
    game = Game.query.filter(Game.id == game_id).first()
    question = Question.filter(Question.id == question_id).first()

    # Add points
    game.scores[game.temporary_state['countdown_winner']] += question.price

    # Mark question as answered
    game.current_board_progress.answered_questions.append(question)

    # Change game state to CORRECT_ANSWER
    game.state = GameState.CORRECT_ANSWER.value
    db.session.commit()

    # Update clients
    update_clients(game_id)


@socketio.on('open_board', namespace='/host')
@login_required
def open_board(game_id):
    game = Game.query.filter(Game.id == game_id).first()
    game.state = GameState.BOARD
    db.session.commit()

    # Update clients
    update_clients(game_id)
