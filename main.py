from app import db, login_manager, app, socketio
from app.index import index
from auth.auth import auth
from gameplay.lobby import lobby
from browser.users_packs import user_packs

app.register_blueprint(auth)
app.register_blueprint(index)
app.register_blueprint(lobby, url_prefix='/lobby')
app.register_blueprint(user_packs, url_prefix='/user_packs')

login_manager.init_app(app)

from model import *  # To create databases
db.create_all()

if __name__ == '__main__':
    socketio.run(app, host="127.0.0.1", port=5000, debug=True)
