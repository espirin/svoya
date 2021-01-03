from flask import Blueprint, render_template, request, jsonify, flash, redirect
from flask_login import login_required, current_user

from app import db, queue_manager
from model import Pack
from model.shared.shared import create_new_pack_id, allowed_image, create_new_image_id, get_file_extension

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
    return render_template('editor/editor.html', pack_id=pack_id)


@editor.route('/upload_image', methods=['POST'])
@login_required
def upload_image():
    if 'file' not in request.files:
        flash('No file part')
        return redirect(request.url)

    file = request.files['file']
    if file.filename == '':
        flash('No selected file')
        return redirect(request.url)

    if file and allowed_image(file.filename):
        image_id = create_new_image_id()
        extension = get_file_extension(file.filename)
        path_to_image = f"static/images/tmp/{image_id}.{extension}"
        path_to_optimized_image = f"static/images/user_content/{image_id}.{extension}"
        with open(path_to_image, "wb") as f:
            f.write(file.read())

        queue_manager.image_queue.enqueue("editor.imageprocessor.image_processor.process_and_save_image",
                                          path_to_image, path_to_optimized_image, job_timeout="1m", job_id=image_id)

        return jsonify(image_id)
