from app import db


class Game(db.Model):
    __tablename__ = 'games'

    id = db.Column(db.Integer, primary_key=True)
    created = db.Column(db.DateTime, nullable=False)
    host_id = db.Column(db.String(64), db.ForeignKey('users.username'))
    pack_id = db.Column(db.Integer, db.ForeignKey('packs.id'))
    current_board_id = db.Column(db.Integer, db.ForeignKey('boards.id'))
    current_board_progress_id = db.Column(db.Integer, db.ForeignKey('board_progress.id'))

    players = db.relationship('User', lazy=True, foreign_keys="[User.game_id]")
    host = db.relationship('User', uselist=False, lazy=True, foreign_keys=[host_id])
    pack = db.relationship("Pack", uselist=False, lazy=True)
    current_board = db.relationship('Board', uselist=False, lazy=True)
    current_board_progress = db.relationship('BoardProgress', uselist=False, lazy=True)

    def __str__(self):
        return f"Game: {self.created}"

    def __repr__(self):
        return self.__str__()
