from app import db


class Board(db.Model):
    __tablename__ = 'boards'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128))
    topics = db.relationship("Topic", backref="board", lazy=True, cascade="all, delete")

    pack_id = db.Column(db.Integer, db.ForeignKey('packs.id'), nullable=False)

    def __str__(self):
        return f"Board: {self.name}"

    def __repr__(self):
        return self.__str__()
