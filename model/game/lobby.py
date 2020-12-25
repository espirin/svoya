from app import db


class Lobby(db.Model):
    __tablename__ = 'lobbies'

    id = db.Column(db.Integer, primary_key=True)
    host_id = db.Column(db.String(64), db.ForeignKey('users.username'))
    pack_id = db.Column(db.Integer, db.ForeignKey('packs.id'))

    players = db.relationship('User', lazy=True, foreign_keys="[User.lobby_id]")
    host = db.relationship('User', uselist=False, lazy=True, foreign_keys=[host_id])
    pack = db.relationship("Pack", uselist=False, lazy=True)

    def __str__(self):
        return f"Lobby: {self.id}"

    def __repr__(self):
        return self.__str__()
