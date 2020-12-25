from pprint import pformat

from werkzeug.security import generate_password_hash, check_password_hash

from app import db


class User(db.Model):
    __tablename__ = 'users'

    username = db.Column(db.String(64), primary_key=True)
    name = db.Column(db.String(64))
    created = db.Column(db.DateTime)
    password_hash = db.Column(db.String(128))

    packs = db.relationship('Pack', lazy=True, foreign_keys="[Pack.owner_username]")

    game_id = db.Column(db.Integer, db.ForeignKey('games.id'))
    lobby_id = db.Column(db.Integer, db.ForeignKey('lobbies.id'))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return self.username

    def __str__(self):
        return "User: " + pformat(self.username)

    def __repr__(self):
        return self.__str__()
