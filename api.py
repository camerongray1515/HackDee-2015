import json
import youtube
from flask import Blueprint, request
from models import Playlist, Video
from database import db_session

api = Blueprint("api", __name__, url_prefix="/api")


@api.route("/create_playlist/", methods=["POST"])
def create_playlist():
    name = request.form.get("name")

    if (name.strip() == ""):
        return json.dumps({"error": "You must specify a name for this playlist"})

    p = Playlist(name)
    db_session.add(p)
    db_session.commit()

    return json.dumps({"playlist_id": p.id})


@api.route("/search_videos/")
def search_videos():
    search_term = request.args.get("search_term")
    page = request.args.get("page")

    if (search_term.strip() == ""):
        return json.dumps({"error": "You must specify a search term"})

    videos = youtube.search_for_videos(search_term, page=page)

    return json.dumps(videos)


@api.route("/add_video/", methods=["POST"])
def add_video():
    playlist_id = request.form.get("playlist_id")
    if playlist_id.strip() == "":
        return json.dumps({'error': "You must specify a playlist ID for this video."})

    slug = request.form.get("slug")
    if slug.strip() == "":
        return json.dumps({'error': "You must specify a slug for this video."})

    thumbnail_url = request.form.get("thumbnail_url")
    if thumbnail_url.strip() == "":
        return json.dumps({'error': "You must specify a thumbnail for this video."})

    title = request.form.get("title")
    if title.strip() == "":
        return json.dumps({'error': "You must specify a title for this video."})

    v = Video(playlist_id, slug, thumbnail_url, title)
    db_session.add(v)
    db_session.commit()

    return json.dumps({"success": True})


@api.route("/<up_down>/")
def vote(video_id, up_down):
    video = Playlist.query.get(video_id)

    if up_down == "up":
        video.rank += 1
    elif up_down == "down":
        video.rank -= 1
    else:
        raise TypeError("Please either upvote or downvote this video.")
	
    db_session.commit()
