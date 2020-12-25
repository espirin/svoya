from flask import Blueprint, render_template, request
from flask_login import login_required, current_user

from app import socketio

lobby = Blueprint('lobby', __name__, template_folder='templates')


@lobby.route('/host/<lobby_id>', methods=['GET'])
@login_required
def lobby_host_page(lobby_id):
    return render_template('lobby/lobby_host.html')


@lobby.route('/<lobby_id>', methods=['GET'])
@login_required
def lobby_page(lobby_id):
    return render_template('lobby/lobby.html')


@socketio.on('connect', namespace='/lobby')
@login_required
def connect_message():
    print(f"Lobby: {request.sid} connected {current_user.username}")


@socketio.on('disconnect', namespace='/lobby')
@login_required
def disconnect_message():
    print(f"Lobby: {request.sid} disconnected {current_user.username}")


@socketio.on('connect', namespace='/lobby_host')
@login_required
def connect_message_host():
    print(f"Lobby host: {request.sid} connected {current_user.username}")


@socketio.on('disconnect', namespace='/lobby_host')
@login_required
def disconnect_message_host():
    print(f"Lobby host: {request.sid} disconnected")
