from flask_login import login_required

from app import socketio, db
from gameplay.state_handler import get_game_state, GameState
from model import Game, BoardProgress


@socketio.on('start_game', namespace='/host')
@login_required
def start_game(game_id):
    # Change game state to BOARD
    game = Game.query.filter(Game.id == game_id).first()
    game.state = GameState.BOARD.value
    game.current_board = game.pack.boards[0]
    game.current_board_progress = BoardProgress(board=game.current_board)
    db.session.commit()

    # Update clients
    state = get_game_state(game_id)
    socketio.emit('state_update', state, room=game_id, namespace="/host")
    socketio.emit('state_update', state, room=game_id, namespace="/player")
