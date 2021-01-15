from flask import Blueprint, render_template
from flask_login import login_required

media = Blueprint('media', __name__, template_folder='templates')


@media.route('/<video_id>/<start>/<end>', methods=['GET'])
@login_required
def show_video(video_id, start, end):
    return render_template("gameplay/media.html", video_id=video_id, start=start, end=end)
