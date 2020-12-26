from time import sleep

import shortuuid as shortuuid
from flask import Blueprint, render_template, request
from flask_login import login_required, current_user
from flask_socketio import join_room, leave_room

from app import socketio, db
from model import Lobby, Pack, User

lobby_blueprint = Blueprint('lobby', __name__, template_folder='templates')


@lobby_blueprint.route('/host/<pack_id>', methods=['GET'])
@login_required
def lobby_host_page(pack_id):
    return render_template('lobby/lobby_host.html', pack_id=pack_id)


@lobby_blueprint.route('/<lobby_id>', methods=['GET'])
@login_required
def lobby_page(lobby_id):
    return render_template('lobby/lobby.html', lobby_id=lobby_id)


@socketio.on('connect_player', namespace='/lobby')
@login_required
def connect_player(lobby_id):
    print(f"Lobby: {current_user.username} connected")
    lobby = Lobby.query.filter(Lobby.id == lobby_id).first()
    if lobby is None:
        return "Лобби не найдено. Возможно, хост отключился."
    lobby.players.append(current_user)
    db.session.commit()
    join_room(lobby.id)
    return f"{request.host}/lobby/{lobby_id}"


@socketio.on('disconnect', namespace='/lobby')
@login_required
def disconnect_player():
    print(f"Lobby: {current_user.username} disconnected")
    lobby = Lobby.query.filter(Lobby.host == current_user).first()
    if lobby is not None:
        try:
            lobby.players.remove(current_user)
        except:
            pass
        db.session.commit()
        leave_room(lobby.id)


@socketio.on('connect_host', namespace='/lobby_host')
@login_required
def connect_host(pack_id):
    print(f"Lobby host: {current_user.username} connected")
    lobby_id = shortuuid.ShortUUID().random(length=8)
    lobby = Lobby(id=lobby_id, host=current_user, pack=Pack.query.filter(Pack.id == pack_id).first())
    db.session.add(lobby)
    db.session.commit()

    return f"{request.host}/lobby/{lobby_id}"


@socketio.on('disconnect', namespace='/lobby_host')
@login_required
def disconnect_host():
    print(f"Lobby host: {current_user.username} disconnected")
    lobby = Lobby.query.filter(Lobby.host == current_user).first()
    if lobby is not None:
        socketio.emit("host_disconnected", room=lobby.id, namespace="/lobby")
        db.session.delete(lobby)
        db.session.commit()
