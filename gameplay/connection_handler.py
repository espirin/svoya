from flask_login import current_user
from flask_socketio import join_room, leave_room

from app import socketio, db
from auth.auth import authenticated_only
from gameplay.state_handler import update_clients
from model import Game, User


@socketio.on('connect_player', namespace='/player')
@authenticated_only
def connect_player(game_id):
    game = Game.query.filter(Game.id == game_id).first()

    if game is None:
        return "Игра не существует"

    # Add player to the players list
    game.players.append(current_user)
    db.session.commit()

    # Create score entry for the player
    if current_user.username not in game.scores:
        game.scores[current_user.username] = 0
        db.session.commit()

    # Add player to the current room
    join_room(game_id)
    update_clients(game_id)
    print(f"Player {current_user.username} connected to game {game_id}")


@socketio.on('disconnect', namespace='/player')
@authenticated_only
def disconnect_player():
    game = Game.query.filter(Game.players.any(User.username == current_user.username)).first()
    if game is not None:  # Check if the game was exited from another browser tab
        game.players.remove(current_user)
        db.session.commit()
        leave_room(game.id)
        update_clients(game.id)
        print(f"Player {current_user.username} disconnected from game {game.id}")


@socketio.on('connect_host', namespace='/host')
@authenticated_only
def connect_host(game_id):
    game = Game.query.filter(Game.id == game_id).first()

    if game is None:
        return "Игра не существует"

    if game.host is not None:
        return "Место ведущего уже занято"

    game.host = current_user
    db.session.commit()

    join_room(game_id)
    update_clients(game_id)
    print(f"Host {current_user.username} connected to game {game_id}")


@socketio.on('disconnect', namespace='/host')
@authenticated_only
def disconnect_host():
    game = Game.query.filter(Game.host == current_user).first()
    if game is not None:  # Check if the game was exited from another browser tab
        game.host = None
        db.session.commit()
        leave_room(game.id)
        update_clients(game.id)
        print(f"Host {current_user.username} disconnected from game {game.id}")


@socketio.on('ping', namespace='/')
@authenticated_only
def ping():
    return "pong"
