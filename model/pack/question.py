from app import db


class Question(db.Model):
    __tablename__ = 'questions'

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text)
    answer = db.Column(db.Text,)
    price = db.Column(db.Integer)

    image_url = db.Column(db.String(128))
    image_thumbnail_url = db.Column(db.String(128))
    video_id = db.Column(db.String(11))
    video_start = db.Column(db.Integer)
    video_end = db.Column(db.Integer)

    topic_id = db.Column(db.Integer, db.ForeignKey('topics.id'), nullable=False)
    board_progress_id = db.Column(db.Integer, db.ForeignKey('board_progress.id'))

    def __str__(self):
        return f"Question: {self.id}"

    def __repr__(self):
        return self.__str__()
