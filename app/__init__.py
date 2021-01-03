from flask_socketio import SocketIO

from flask import Flask
from flask_login import LoginManager, current_user
from flask_sqlalchemy import SQLAlchemy

from config import secrets
from logger.logger import setup_logging

app = Flask(__name__, static_folder="../static")
app.config['SECRET_KEY'] = secrets.SECRET_KEY
app.config['SQLALCHEMY_DATABASE_URI'] = secrets.DB_URI
app.config['SQLALCHEMY_ECHO'] = False
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

logger = setup_logging()
login_manager = LoginManager()
db = SQLAlchemy(app)
socketio = SocketIO(app)


@app.context_processor
def inject_user():
    return dict(user=current_user)
