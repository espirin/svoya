from app import db


class BoardProgress(db.Model):
    __tablename__ = 'board_progress'

    id = db.Column(db.Integer, primary_key=True)
    board_id = db.Column(db.Integer, db.ForeignKey('boards.id'))

    board = db.relationship('Board', uselist=False, lazy=True)
    answered_questions = db.relationship('Question', lazy=True)

    def __str__(self):
        return f"BoardProgress: {self.id}"

    def __repr__(self):
        return self.__str__()
