from datetime import datetime

from flask import Blueprint, render_template, request, jsonify
from flask_login import login_required, current_user
from flask_socketio import join_room, leave_room

from app import socketio, db
from model import Game, Pack, User
from model.shared.shared import create_new_game_id

gameplay = Blueprint('gameplay', __name__, template_folder='templates')


