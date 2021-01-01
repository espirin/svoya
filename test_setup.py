from datetime import datetime

from werkzeug.security import generate_password_hash

from app import db
from model import Question, Topic, Board, Pack, User

user = User(username="nt", name="Egorix", created=datetime.now(), password_hash=generate_password_hash("12345678"))
db.session.add(user)
db.session.commit()

question1 = Question(text="Назовите фильм", answer="Волк с Уолл-стрит", price=100, video_id="NY3dOouhe9Y", video_start=0, video_end=10)

question2 = Question(text="Назовите фильм", answer="Криминальное чтиво", price=200, video_id="RGiAckpJWe4", video_start=0, video_end=16)

question3 = Question(text="Назовите фильм", answer="Адреналин", price=300, video_id="IJHNZ2EYXeE", video_start=0, video_end=15)

question4 = Question(text="Назовите фильм", answer="Властелин колец: две крепости", price=400, video_id="-N2luFjtgw8", video_start=0, video_end=15)

question5 = Question(text="Назовите фильм", answer="Троя", price=500, video_id="SA9ynx9fIOY", video_start=0, video_end=15)

question6 = Question(text="Назовите фильм", answer="Я - легенда", price=600, video_id="PW91GGHf9iI", video_start=0, video_end=25)

question7 = Question(text="Назовите оба фильма", answer="Джентельмены удачи - Властелин колец: братство кольца", price=700, video_id="JWckG7FW3C4", video_start=0, video_end=20)

topic1 = Topic(name="Под битом")
topic1.questions.append(question1)
topic1.questions.append(question2)
topic1.questions.append(question3)
topic1.questions.append(question4)
topic1.questions.append(question5)
topic1.questions.append(question6)
topic1.questions.append(question7)

question8 = Question(text="Назовите обоих исполнителей", answer="Eminem - Руки Вверх - Он Тебя Целует", price=100, video_id="EKw9CgLzkJI", video_start=0, video_end=15)

question9 = Question(text="Назовите обоих исполнителей", answer="Игорь Николаев - Crazy Town - Butterfly", price=200, video_id="mlMdZqj4m9o", video_start=0, video_end=15)

question10 = Question(text="Назовите обоих исполнителей", answer="Snoop Dogg - Непара - Другая Причина", price=300, video_id="fQXey4hc_yY", video_start=0, video_end=20)

question11 = Question(text="Назовите обоих исполнителей", answer="Шуфутинский - Desiigner - Panda", price=400, video_id="wgpFZE28Qvc", video_start=0, video_end=15)

question12 = Question(text="Назовите обоих исполнителей", answer="Скала - Руслан Набиев - По Ресторанам", price=500, video_id="TtY3Ef3dm7w", video_start=0, video_end=15)

question13 = Question(text="Назовите обоих исполнителей", answer="Игорь Николаев - Грибы - Копы", price=600, video_id="UF_wxQqxLt8", video_start=0, video_end=15)

question14 = Question(text="Назовите обоих исполнителей", answer="DJ Solomun - Олег Кензов - По Кайфу", price=700, video_id="nKh_hWmkl5U", video_start=0, video_end=15)

topic2 = Topic(name="Музыка")
topic2.questions.append(question8)
topic2.questions.append(question9)
topic2.questions.append(question10)
topic2.questions.append(question11)
topic2.questions.append(question12)
topic2.questions.append(question13)
topic2.questions.append(question14)

board1 = Board()
board1.topics.append(topic1)
board1.topics.append(topic2)


pack = Pack(name="Мой пак 1", public=False)
pack.boards.append(board1)
user = User.query.filter(User.username == "nt").first()
user.packs.append(pack)
db.session.add(pack)
db.session.commit()
