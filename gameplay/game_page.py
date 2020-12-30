from datetime import datetime

from flask import Blueprint, render_template, request, jsonify
from flask_login import login_required, current_user

from app import db
from gameplay.state_handler import GameState
from model import Game, User
from model.shared.shared import create_new_game_id

game_page = Blueprint('gameplay', __name__, template_folder='templates')


@game_page.route('/create_game', methods=['POST'])
@login_required
def create_game():
    pack_id = request.get_json()
    game_id = create_new_game_id()

    game = Game(id=game_id, created=datetime.now(), pack_id=pack_id, state=GameState.LOBBY.value)
    db.session.add(game)
    db.session.commit()

    game_url = f"{request.url_root}{game_id}"

    return jsonify(game_url)


@game_page.route('/<game_id>', methods=['GET'])
@login_required
def get_game_page(game_id):
    previous_game = Game.query.filter(Game.players.any(User.username == current_user.username)).first()
    previous_game_host = Game.query.filter(Game.host == current_user).first()
    if (previous_game is not None and previous_game.id != game_id) \
            or (previous_game_host is not None and previous_game_host.id != game_id):
        return "Невозможно участвовать в нескольких играх одновременно"

    game_url = f"{request.url_root}{game_id}"
    game = Game.query.filter(Game.id == game_id).first()
    return render_template('gameplay/player.html', game_id=game_id, game_url=game_url, username=current_user.username,
                           pack_name=game.pack.name)


@game_page.route('/host/<game_id>', methods=['GET'])
@login_required
def host_page(game_id):
    previous_game = Game.query.filter(Game.players.any(User.username == current_user.username)).first()
    previous_game_host = Game.query.filter(Game.host == current_user).first()
    if (previous_game is not None and previous_game.id != game_id) \
            or (previous_game_host is not None and previous_game_host.id != game_id):
        return "Невозможно участвовать в нескольких играх одновременно"

    game_url = f"{request.url_root}{game_id}"
    return render_template('gameplay/host.html', game_id=game_id, game_url=game_url, username=current_user.username)
