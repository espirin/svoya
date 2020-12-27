from datetime import datetime

from flask import Blueprint, render_template, request, jsonify
from flask_login import login_required, current_user
from flask_socketio import join_room, leave_room

from app import socketio, db
from model import Game, Pack, User
from model.shared.shared import create_new_game_id

gameplay = Blueprint('gameplay', __name__, template_folder='templates')


@gameplay.route('/create_game', methods=['POST'])
@login_required
def create_game():
    pack_id = request.get_json()
    game_id = create_new_game_id()

    game = Game(id=game_id, created=datetime.now(), pack_id=pack_id)
    db.session.add(game)
    db.session.commit()

    game_url = f"{request.url_root}{game_id}"

    return jsonify(game_url)


@gameplay.route('/<game_id>', methods=['GET'])
@login_required
def game_page(game_id):
    previous_game = Game.query.filter(Game.players.any(User.username == current_user.username)).first()
    if previous_game is not None and previous_game.id != game_id:
        return "Невозможно участвовать в нескольких играх одновременно"

    game_url = f"{request.url_root}{game_id}"
    return render_template('gameplay/gameplay.html', game_id=game_id, game_url=game_url)


@gameplay.route('/host/<game_id>', methods=['GET'])
@login_required
def host_page(game_id):
    return render_template('gameplay/host.html', game_id=game_id)


@socketio.on('connect_player', namespace='/player')
@login_required
def connect_player(game_id):
    game = Game.query.filter(Game.id == game_id).first()

    if game is None:
        return "Игра не существует"

    game.players.append(current_user)
    db.session.commit()
    print(f"Player {current_user.username} connected to game {game_id}")


@socketio.on('disconnect', namespace='/player')
@login_required
def disconnect_player():
    game = Game.query.filter(Game.players.any(User.username == current_user.username)).first()
    if game is not None:  # Check if the game was exited from another browser tab
        game.players.remove(current_user)
        db.session.commit()
        print(f"Player {current_user.username} disconnected from game {game.id}")


@socketio.on('connect_host', namespace='/host')
@login_required
def connect_host(game_id):
    game = Game.query.filter(Game.id == game_id).first()

    if game is None:
        return "Игра не существует"

    if game.host is not None:
        return "Место ведущего уже занято"

    game.host = current_user
    db.session.commit()
    print(f"Host {current_user.username} connected to game {game_id}")


@socketio.on('disconnect', namespace='/host')
@login_required
def disconnect_host():
    game = Game.query.filter(Game.host == current_user).first()
    if game is not None:  # Check if the game was exited from another browser tab
        game.host = None
        db.session.commit()
        print(f"Host {current_user.username} disconnected from game {game.id}")
