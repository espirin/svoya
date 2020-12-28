from enum import Enum
from typing import List, Dict

from flask_login import login_required

from app import socketio
from model import Game


class GameState(Enum):
    LOBBY = 0
    BOARD = 1
    QUESTION = 2
    COUNTDOWN = 3
    ANSWERING = 4
    CORRECT_ANSWER = 5


@socketio.on('get_game_state', namespace='/')
@login_required
def get_game_state(game_id):
    game = Game.query.filter(Game.id == game_id).first()

    if game.state == GameState.LOBBY.value:
        players = [{"name": player.name, "username": player.username} for player in game.players]
        for player in players:
            player['score'] = 0
            player['next_turn'] = False

        host = {"name": game.host.name if game.host is not None else None,
                "username": game.host.username if game.host is not None else None}

        return {
            "players": players,
            "host": host,
        }

    if game.state == GameState.BOARD.value:
        players = [{"name": player.name, "username": player.username} for player in game.players]
        scores = game.scores
        for player in players:
            player['score'] = scores[player['username']]
            player['next_turn'] = game.next_turn == player

        host = {"name": game.host.name if game.host is not None else None,
                "username": game.host.username if game.host is not None else None}

        board = game.current_board
        answered_questions = game.current_board_progress.answered_questions
        json_board: List[List[Dict]] = []
        for topic in board.topics:
            json_board.append([])
            for question in topic.questions:
                json_board[-1].append({
                    "price": question.price,
                    "answered": question in answered_questions
                })

        return {
            "players": players,
            "host": host,
            "board": json_board
        }
