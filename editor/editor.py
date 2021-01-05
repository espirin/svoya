from typing import Dict

from flask import Blueprint, render_template, request, jsonify, flash, redirect
from flask_login import login_required, current_user

from app import db, socketio
from config import config
from editor.videoprocessor.video_processor import check_video_embeddable
from model import Pack, Question, Board
from model.shared.shared import create_new_pack_id, create_new_image_id, get_file_extension

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
        extension = get_file_extension(file.filename)
        path = f"{config.IMAGES_DIR}/{image_id}.{extension}"
        with open(path, "w") as f:
            f.write(file.read())

        question = Question.query.filter(Question.id == request.form['question_id']).first()
        question.image_url = path

        return jsonify(path)


@socketio.on('update_question_text')
@login_required
def update_question_text(question_id: int, text: str):
    question = Question.query.filter(Question.id == question_id).first()
    question.text = text
    db.session.commit()


@socketio.on('update_question_answer')
@login_required
def update_question_answer(question_id: int, answer: str):
    question = Question.query.filter(Question.id == question_id).first()
    question.answer = answer
    db.session.commit()


@socketio.on('check_video')
@login_required
def check_video_handler(video_id: str) -> str:
    if len(video_id) > 15:
        return "video_id_too_long"
    if check_video_embeddable(video_id):
        return "ok"
    return "not_embeddable"


@socketio.on('update_video')
@login_required
def update_video(question_id: int, data: Dict):
    question = Question.query.filter(Question.id == question_id).first()
    question.video_id = data['video_id']
    question.video_start = data['video_start']
    question.video_end = data['video_end']
    db.session.commit()


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
                "image_url": question.image_url,
                "video_id": question.video_id,
                "video_start": question.video_start,
                "video_end": question.video_end
            } for question in topic.questions]
        } for topic in board.topics],
    } for board in pack.boards]
    return boards
