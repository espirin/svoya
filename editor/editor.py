from flask import Blueprint, render_template, request, jsonify
from flask_login import login_required, current_user

from app import db
from model import Pack
from model.shared.shared import create_new_pack_id

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
