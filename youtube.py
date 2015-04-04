from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

API_KEY = 'AIzaSyAkbiLjgdmV6iY6-bw3bCJqiNkpJVA4xTI'
API_SERVICE_NAME = 'youtube'
API_VERSION = 'v3'


class ConnectionError(Exception):
    def __init__(self, value):
        self.value = value

    def __str__(self):
        return repr(self.value)


def search_for_videos(search_term, results_length=10):
    youtube = build(API_SERVICE_NAME, API_VERSION, developerKey=API_KEY)
    videos = []

    try:
        result = youtube.search().list(
            q=search_term,
            part="id,snippet",
            maxResults=results_length
        ).execute()
    except HttpError:
        raise ConnectionError("Connection problem.")

    for v in result.get("items", []):
        if v["id"]["kind"] == "youtube#video":
            videos.append({'title': v["snippet"]["title"],
                           'thumbnail': v["snippet"]["thumbnails"]["default"]["url"],
                           'id': v["id"]["videoId"]})
        else:
            pass

    return videos

if __name__ == '__main__':
    # r = search_for_videos('fedora')
    pass