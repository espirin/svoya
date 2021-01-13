from enum import Enum
from typing import List, Dict

from app import socketio, db
from auth.auth import authenticated_only
from model import Game, Question


class GameState(Enum):
    LOBBY = 0
    BOARD = 1
    QUESTION = 2
    COUNTDOWN = 3
    ANSWERING = 4
    CORRECT_ANSWER = 5


@socketio.on('get_game_state', namespace='/')
@authenticated_only
def get_game_state(game_id):
    game = Game.query.filter(Game.id == game_id).first()
    if game is None:
        return "Игра не найдена"

    if game.state == GameState.LOBBY.value:
        # Lobby
        return {
            "state": GameState(game.state).name,
        }

    elif game.state == GameState.BOARD.value:
        # Questions board
        board = game.current_board
        answered_questions = game.current_board_progress.answered_questions

        # Check if board is done
        done = True
        for topic in board.topics:
            for question in topic.questions:
                if question not in answered_questions:
                    done = False

        # Select next board
        if done and len(game.pack.boards) > game.pack.boards.index(game.current_board) + 1:
            game.current_board = game.pack.boards[game.pack.boards.index(game.current_board) + 1]
            db.session.commit()
            board = game.current_board

        json_board = []
        for topic in board.topics:
            json_board.append({'name': topic.name, 'questions': []})
            for question in topic.questions:
                json_board[-1]['questions'].append({
                    "price": question.price,
                    "answered": question in answered_questions,
                    "id": question.id
                })
            json_board[-1]['questions'].sort(key=lambda question_dict: question_dict['price'])

        return {
            "state": GameState(game.state).name,
            "board": json_board
        }

    elif game.state == GameState.QUESTION.value or game.state == GameState.ANSWERING.value or \
            game.state == GameState.CORRECT_ANSWER.value:
        # Question
        question = Question.query.filter(Question.id == game.temporary_state['question_id']).first()

        return {
            "state": GameState(game.state).name,
            "question": create_question_info(question)
        }
    elif game.state == GameState.COUNTDOWN.value:
        # Question
        question = Question.query.filter(Question.id == game.temporary_state['question_id']).first()

        return {
            "time": game.temporary_state['countdown_time'],
            "time_remaining": game.temporary_state['countdown_time_remaining'],
            "state": GameState(game.state).name,
            "question": create_question_info(question)
        }


def create_players_info(game) -> List[Dict]:
    players = [{"name": player.name, "username": player.username} for player in game.players]
    scores = game.scores
    for player in players:
        player['score'] = scores[player['username']]
        player['next_turn'] = game.next_turn == player
        player['countdown_winner'] = 'countdown_winner' in game.temporary_state \
                                     and game.temporary_state['countdown_winner'] == player['username']

    return players


def create_host_info(game) -> Dict:
    return {
        "name": game.host.name if game.host is not None else None,
        "username": game.host.username if game.host is not None else None
    }


def create_question_info(question) -> Dict:
    return {
        "id": question.id,
        "text": question.text,
        "answer": question.answer,
        "price": question.price,
        "image_url": question.image_url,
        "video_id": question.video_id,
        "video_start": question.video_start,
        "video_end": question.video_end,
    }


def update_clients_state(game_id):
    state = get_game_state(game_id)
    socketio.emit('state_update', state, room=game_id, namespace="/host")
    socketio.emit('state_update', state, room=game_id, namespace="/player")
    update_clients(game_id)


def update_clients(game_id):
    game = Game.query.filter(Game.id == game_id).first()
    if game is None:
        return "Игра не найдена"
    players = create_players_info(game)
    host = create_host_info(game)
    message = {"players": players, "host": host}

    socketio.emit('update_clients', message, room=game_id, namespace="/host")
    socketio.emit('update_clients', message, room=game_id, namespace="/player")
