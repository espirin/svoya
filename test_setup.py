from datetime import datetime

from werkzeug.security import generate_password_hash

from app import db
from model import Question, Topic, Board, Pack, User

user = User(username="nt", name="Egorix", created=datetime.now(), password_hash=generate_password_hash("12345678"))
db.session.add(user)
db.session.commit()

question1 = Question(text="Назовите фильм", answer="Волк с Уолл-стрит", price=100, video_id="NY3dOouhe9Y",
                     video_start=0, video_end=10)

question2 = Question(text="Назовите фильм", answer="Криминальное чтиво", price=200, video_id="RGiAckpJWe4",
                     video_start=0, video_end=16)

question3 = Question(text="Назовите фильм", answer="Адреналин", price=300, video_id="IJHNZ2EYXeE", video_start=0,
                     video_end=15)

question4 = Question(text="Назовите фильм", answer="Властелин колец: две крепости", price=400, video_id="-N2luFjtgw8",
                     video_start=0, video_end=15)

question5 = Question(text="Назовите фильм", answer="Троя", price=500, video_id="SA9ynx9fIOY", video_start=0,
                     video_end=15)

question6 = Question(text="Назовите фильм", answer="Я - легенда", price=600, video_id="PW91GGHf9iI", video_start=0,
                     video_end=25)

question7 = Question(text="Назовите оба фильма", answer="Джентельмены удачи - Властелин колец: братство кольца",
                     price=700, video_id="JWckG7FW3C4", video_start=0, video_end=20)

topic1 = Topic(name="Под битом")
topic1.questions.append(question1)
topic1.questions.append(question2)
topic1.questions.append(question3)
topic1.questions.append(question4)
topic1.questions.append(question5)
topic1.questions.append(question6)
topic1.questions.append(question7)

question8 = Question(text="Назовите обоих исполнителей", answer="Eminem - Руки Вверх - Он Тебя Целует", price=100,
                     video_id="EKw9CgLzkJI", video_start=0, video_end=15)

question9 = Question(text="Назовите обоих исполнителей", answer="Игорь Николаев - Crazy Town - Butterfly", price=200,
                     video_id="mlMdZqj4m9o", video_start=0, video_end=15)

question12 = Question(text="Назовите обоих исполнителей", answer="Скала - Руслан Набиев - По Ресторанам", price=500,
                      video_id="TtY3Ef3dm7w", video_start=0, video_end=15)

question13 = Question(text="Назовите обоих исполнителей", answer="Игорь Николаев - Грибы - Копы", price=600,
                      video_id="UF_wxQqxLt8", video_start=0, video_end=15)

question14 = Question(text="Назовите обоих исполнителей", answer="DJ Solomun - Олег Кензов - По Кайфу", price=700,
                      video_id="nKh_hWmkl5U", video_start=0, video_end=15)

topic2 = Topic(name="Музыка")
topic2.questions.append(question8)
topic2.questions.append(question9)
topic2.questions.append(question12)
topic2.questions.append(question13)
topic2.questions.append(question14)

question15 = Question(text="Гасит огонь на конце палочки.", answer="Нокс", price=100)

question16 = Question(text="Непростительное заклятие, полностью подчиняет противника.", answer="Империо", price=200)

question17 = Question(text="Заклинание против боггарта.", answer="Ридикулус", price=300)

question18 = Question(text="Отпирающее заклинание. Отпирает замки, но не все.", answer="Алохомора", price=400)

question19 = Question(
    text="Заклинание, которое глубоко, будто мечом, ранит противника. Если сектумсемпрой была отсечена какая-либо часть тела, восстановить её невозможно никакими заклятиями. Изобретено Северусом Снеггом.",
    answer="Сектумсемпра", price=500)

question20 = Question(text="Заклятие, повергающее противника в ступор, дезориентирующее.", answer="Конфундус",
                      price=600)

question21 = Question(text="Подвешивает противника вниз головой.", answer="Левикорпус", price=700)

topic3 = Topic(name="Гарри")
topic3.questions.append(question15)
topic3.questions.append(question16)
topic3.questions.append(question17)
topic3.questions.append(question18)
topic3.questions.append(question19)
topic3.questions.append(question20)
topic3.questions.append(question21)

question22 = Question(text="Назовите страну", answer="Россия", price=100, image_url="/static/app/images/1Россия.jpg")

question23 = Question(text="Назовите страну", answer="Швеция", price=200, image_url="/static/app/images/2Швеция.png")

question24 = Question(text="Назовите страну", answer="Итальяния", price=300,
                      image_url="/static/app/images/3Итальяния.jpg")

question25 = Question(text="Назовите страну", answer="Великобритания", price=400,
                      image_url="/static/app/images/4Великобритания.jpeg")

question26 = Question(text="Назовите страну", answer="Япония", price=500, image_url="/static/app/images/5Япония.png")

question27 = Question(text="Назовите страну", answer="Киргизия", price=600,
                      image_url="/static/app/images/6Киргизия.jpeg")

question28 = Question(text="А это чья урна?", answer="Урна главного урноведа", price=700,
                      image_url="/static/app/images/7Урнаглавногоурноведа.jpeg")

topic4 = Topic(name="Урноведение")
topic4.questions.append(question22)
topic4.questions.append(question23)
topic4.questions.append(question24)
topic4.questions.append(question25)
topic4.questions.append(question26)
topic4.questions.append(question27)
topic4.questions.append(question28)

question29 = Question(text="Кто этот дед?", answer="Элтон Джон", price=100,
                      image_url="/static/app/images/1_Элтон_Джон.jpg")

question30 = Question(text="Кто этот дед?", answer="Ринго Старр", price=200,
                      image_url="/static/app/images/2_Ринго_Старр.jpg")

question31 = Question(text="Кто этот дед?", answer="Принц Филип", price=300,
                      image_url="/static/app/images/3_Принц_Филип.jpg")

question32 = Question(text="Кто этот дед?", answer="Бен Кингсли", price=400,
                      image_url="/static/app/images/4_Бен_Кингсли.jpg")

question33 = Question(text="Кто этот дед?", answer="Джон Траволта", price=500,
                      image_url="/static/app/images/5_Джон_Траволта.jpg")

question34 = Question(text="Кто этот дед?", answer="Майкл Кейн", price=600,
                      image_url="/static/app/images/6_Майкл_Кейн.jpg")

question35 = Question(text="Кто этот дед?", answer="Греша", price=700, image_url="/static/app/images/7_Греша.jpg")

topic5 = Topic(name="Деды")
topic5.questions.append(question29)
topic5.questions.append(question30)
topic5.questions.append(question31)
topic5.questions.append(question32)
topic5.questions.append(question33)
topic5.questions.append(question34)
topic5.questions.append(question35)

board1 = Board(name="Раунд 1")
board2 = Board(name="Раунд 2")
board1.topics.append(topic1)
board1.topics.append(topic3)
board1.topics.append(topic4)
board1.topics.append(topic5)

board2.topics.append(topic2)

pack = Pack(name="Мой пак 1", public=False)
pack.boards.append(board1)
pack.boards.append(board2)
user = User.query.filter(User.username == "nt").first()
user.packs.append(pack)
db.session.add(pack)
db.session.commit()
