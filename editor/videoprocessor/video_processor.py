import requests

from config import secrets


def check_video_embeddable(video_id: str) -> str:
    response = requests.get(f"https://youtube.googleapis.com/youtube/v3/videos?"
                            f"part=snippet%2CcontentDetails%2Cstatistics&"
                            f"part=status&id={video_id}&key={secrets.GOOGLE_API_KEY}").json()

    if len(response['items']) == 0:
        return "not_found"
    elif 'regionRestriction' in response['items'][0]['contentDetails']:
        return "not_embeddable"
    elif response['items'][0]['status']['embeddable']:
        return "ok"
    else:
        return "error"
