from flask import Blueprint, render_template

gameplay = Blueprint('play', __name__, template_folder='templates')


@gameplay.route('/', methods=['GET'])
def login():

    return render_template('auth/login.html')
