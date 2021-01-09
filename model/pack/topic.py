from app import db


class Topic(db.Model):
    __tablename__ = 'topics'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128))
    questions = db.relationship("Question", backref="topic", lazy=True, cascade="all, delete")

    board_id = db.Column(db.Integer, db.ForeignKey('boards.id'), nullable=False)

    def __str__(self):
        return f"Topic: {self.name}"

    def __repr__(self):
        return self.__str__()
