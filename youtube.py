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


def search_for_videos(search_term, max_results=10, page=None):
    youtube = build(API_SERVICE_NAME, API_VERSION, developerKey=API_KEY)
    videos = []

    try:
        if page is None:
            result = youtube.search().list(
                q=search_term,
                part="id,snippet",
                maxResults=max_results
            ).execute()
        else:
            result = youtube.search().list(
                q=search_term,
                part="id,snippet",
                pageToken=page,
                maxResults=max_results
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

    next_page = result.get("nextPageToken", [])
    prev_page = result.get("prevPageToken", [])

    return {"results": videos, "next page": next_page, "previous page": prev_page}

if __name__ == '__main__':
    # r = search_for_videos('fedora')
    # print r
    pass