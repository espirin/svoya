import requests

from config import secrets


def check_video_embeddable(video_id: str) -> bool:
    response = requests.get(f"https://youtube.googleapis.com/youtube/v3/videos?"
                            f"part=snippet%2CcontentDetails%2Cstatistics&"
                            f"part=status&id={video_id}&key={secrets.GOOGLE_API_KEY}")

    return response.status == 200 and response.json()['']
