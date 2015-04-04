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

    if (search_term.strip() == ""):
        return json.dumps({"error": "You must specify a search term"})

    videos = youtube.search_for_videos(search_term)

    return json.dumps(videos)
