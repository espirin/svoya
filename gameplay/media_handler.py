from flask import render_template, Blueprint
from flask_login import login_required

media_page = Blueprint('media', __name__, template_folder='templates')


@media_page.route('/<video_id>', methods=['GET'])
@login_required
def get_video(video_id):
    return render_template('gameplay/media.html', video_id=video_id)
