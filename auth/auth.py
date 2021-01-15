import base64
import functools
from datetime import datetime

from flask import Blueprint, render_template, redirect, url_for, request, abort
from flask_login import login_required, logout_user, current_user, login_user
from flask_socketio import disconnect
from werkzeug.security import check_password_hash, generate_password_hash

from app import login_manager, db
from model.user import User

auth = Blueprint('auth', __name__, template_folder='templates')


def authenticated_only(f):
    @functools.wraps(f)
    def wrapped(*args, **kwargs):
        if not current_user.is_authenticated:
            disconnect()
        else:
            return f(*args, **kwargs)
    return wrapped


@login_manager.user_loader
def load_user(username):
    return User.query.filter(User.username == username).first()


@login_manager.request_loader
def load_user_from_request(user_request):
    # Login using Basic Auth
    credentials = user_request.headers.get('Authorization')
    if credentials:
        credentials = credentials.replace('Basic ', '', 1)
        credentials = base64.b64decode(credentials).decode('utf-8')

        username, password = credentials.split(':')
        user = load_user(username)
        if user is None:
            return None
        if check_password_hash(user.password_hash, password):
            return user
    return None


@login_manager.unauthorized_handler
def unauthorized():
    if request.headers.get('Authorization'):
        abort(401)
    return redirect(url_for('auth.login', next=request.url))


@auth.route('/login', methods=['GET'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index.index_page'))
    return render_template('auth/login.html', next=request.args.get('next'))


@auth.route('/login', methods=['POST'])
def login_post():
    username = request.form['username']
    password = request.form['password']
    if len(username) > 64 or len(password) > 64:
        return "Username or name or password is too long."
    user = load_user(username)
    if user is None:
        return "User with this username not found"
    if check_password_hash(user.password_hash, password):
        login_user(user, remember=True)
        next_url = request.args.get('next')
        if next_url != 'auth.login' and next_url is not None:
            return redirect(next_url)
        return redirect(url_for('index.index_page'))
    return "Wrong password"


@auth.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))


@auth.route("/signup")
def signup_page():
    if current_user.is_authenticated:
        return redirect(url_for('index.index_page'))
    return render_template('auth/signup.html')


@auth.route("/signup", methods=['POST'])
def signup_post():
    username = request.form['username']
    name = request.form['name']
    password = request.form['password']
    if len(username) < 2 or len(name) < 2 or len(password) < 8:
        return "Username or name or password is too short."
    if len(username) > 64 or len(name) > 64 or len(password) > 64:
        return "Username or name or password is too long."
    if load_user(username):
        return "This username already exists."

    password_hash = generate_password_hash(request.form['password'])
    user = User(username=username, name=name, created=datetime.now(), password_hash=password_hash)
    db.session.add(user)
    db.session.commit()
    login_user(user, remember=True)
    return redirect(request.args.get('next'))
