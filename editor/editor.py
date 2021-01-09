import os
from typing import Dict

from flask import Blueprint, render_template, request, jsonify, flash, redirect
from flask_login import login_required, current_user

from app import db, socketio
from config import config
from editor.videoprocessor.video_processor import check_video_embeddable
from model import Pack, Question
from model.shared.shared import create_new_pack_id, create_new_image_id, create_thumbnail

editor = Blueprint('editor', __name__, template_folder='templates')


@editor.route('/create_pack', methods=['POST'])
@login_required
def create_pack():
    pack_id = create_new_pack_id()
    pack = Pack(id=pack_id, public=False)
    current_user.packs.append(pack)
    db.session.commit()

    editor_url = f"{request.url_root}editor/{pack_id}"

    return jsonify(editor_url)


@editor.route('/<pack_id>', methods=['GET'])
@login_required
def editor_page(pack_id):
    pack = Pack.query.filter(Pack.id == pack_id).first()
    if pack is None:
        return "Пак не найден"
    return render_template('editor/editor.html', pack_id=pack_id, pack_name=pack.name)


@editor.route('/upload_image', methods=['POST'])
@login_required
def upload_image():
    if 'file' not in request.files or "question_id" not in request.form or request.form['question_id'] is None:
        flash('No file part or question_id')
        return redirect(request.url)

    file = request.files['file']
    if file.filename == '':
        flash('No selected file')
        return redirect(request.url)

    if file:
        image_id = create_new_image_id()
        path = f"{config.IMAGES_DIR}/{image_id}.jpeg"
        with open(path, "wb") as f:
            f.write(file.read())

        thumbnail = create_thumbnail(file)
        thumbnail_path = f"{config.IMAGES_DIR}/{image_id}_thumbnail.jpeg"
        thumbnail.save(thumbnail_path, optimize=True, quality=config.THUMBNAIL_WIDTH)

        question = Question.query.filter(Question.id == request.form['question_id']).first()
        question.image_url = path
        question.image_thumbnail_url = thumbnail_path
        db.session.commit()

        return jsonify(f"/{thumbnail_path}")


@socketio.on('update_question_text')
@login_required
def update_question_text(data: Dict):
    question_id = data['question_id']
    text = data['text']
    question = Question.query.filter(Question.id == question_id).first()
    question.text = text
    db.session.commit()


@socketio.on('update_question_answer')
@login_required
def update_question_answer(data: Dict):
    question_id = data['question_id']
    answer = data['answer']
    question = Question.query.filter(Question.id == question_id).first()
    question.answer = answer
    db.session.commit()


@socketio.on('update_question_price')
@login_required
def update_question_price(data: Dict):
    question_id = data['question_id']
    price = data['price']
    question = Question.query.filter(Question.id == question_id).first()
    question.price = price
    db.session.commit()


@socketio.on('check_video')
@login_required
def check_video_handler(video_id: str) -> str:
    if len(video_id) != 11:
        return "video_id_incorrect"
    return check_video_embeddable(video_id)


@socketio.on('update_video')
@login_required
def update_video(data: Dict):
    question = Question.query.filter(Question.id == data['question_id']).first()
    old_video_id = question.video_id
    question.video_id = data['video_id']
    question.video_start = data['video_start']
    question.video_end = data['video_end']
    db.session.commit()

    return old_video_id


@socketio.on('get_boards')
@login_required
def get_boards(pack_id: int):
    pack = Pack.query.filter(Pack.id == pack_id).first()
    boards = [{
        "id": board.id,
        "name": board.name,
        "topics": [{
            "name": topic.name,
            "id": topic.id,
            "questions": [{
                "id": question.id,
                "text": question.text,
                "answer": question.answer,
                "price": question.price,
                "image_url": f"/{question.image_thumbnail_url}" if question.image_url is not None else None,
                "video_id": question.video_id,
                "video_start": question.video_start,
                "video_end": question.video_end
            } for question in topic.questions]
        } for topic in board.topics],
    } for board in pack.boards]

    boards.sort(key=lambda board: board['id'])
    for board in boards:
        board['topics'].sort(key=lambda topic: topic['id'])
        for topic in board['topics']:
            topic['questions'].sort(key=lambda question: question['id'])
    return boards


@socketio.on('remove_image')
@login_required
def remove_image(question_id):
    question = Question.query.filter(Question.id == question_id).first()
    os.remove(question.image_url)
    os.remove(question.image_thumbnail_url)
    question.image_url = None
    question.image_thumbnail_url = None
    db.session.commit()

    return "success"


@socketio.on('remove_video')
@login_required
def remove_video(question_id):
    question = Question.query.filter(Question.id == question_id).first()
    question.video_id = None
    question.video_start = None
    question.video_end = None
    db.session.commit()

    return "success"


@socketio.on('get_video_data')
@login_required
def get_video_data(question_id):
    question = Question.query.filter(Question.id == question_id).first()

    return {
        "video_id": question.video_id,
        "video_start": question.video_start,
        "video_end": question.video_end
    }
