from flask import Blueprint, render_template, request, jsonify
from flask_login import login_required, current_user

from model import Pack

user_packs = Blueprint('user_packs', __name__, template_folder='templates')


@user_packs.route('/', methods=['GET'])
@login_required
def packs_page():
    packs = [{"name": pack.name, "id": pack.id} for pack in current_user.packs]
    return render_template('user_packs/packs.html', packs=packs)


@user_packs.route('/view_pack', methods=['POST'])
@login_required
def view_pack():
    pack_id = request.get_json()
    pack = Pack.query.filter(Pack.id == pack_id).first()
    topics = [topic.name for board in pack.boards for topic in board.topics]
    return jsonify({
        "name": pack.name,
        "topics": topics
    })
