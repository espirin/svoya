from app import db


class Pack(db.Model):
    __tablename__ = 'packs'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128))
    public = db.Column(db.Boolean)

    boards = db.relationship("Board", backref="pack", lazy=True)

    owner_username = db.Column(db.String(64), db.ForeignKey('users.username'), nullable=False)

    def __str__(self):
        return f"Pack: {self.name}"

    def __repr__(self):
        return self.__str__()
