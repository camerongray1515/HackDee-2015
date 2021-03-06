import json
import youtube
from flask import Blueprint, request, jsonify
from models import Playlist, Video
from database import db_session
from redis import StrictRedis

api = Blueprint("api", __name__, url_prefix="/api")

redis = StrictRedis(host="localhost",
                    port=6379,
                    db=1)

class ExistenceError(Exception):
    def __init__(self, value):
        self.value = value

    def __str__(self):
        return repr(self.value)


@api.route("/create_playlist/", methods=["POST"])
def create_playlist():
    name = request.form.get("name")

    if name.strip() == "":
        return jsonify({"error": "You must specify a name for this playlist"})

    p = Playlist(name)
    db_session.add(p)
    db_session.commit()

    return jsonify({"playlist_id": p.id})


@api.route("/search_videos/")
def search_videos():
    search_term = request.args.get("search_term")
    page = request.args.get("page")

    if search_term.strip() == "":
        return jsonify({"error": "You must specify a search term"})

    videos = youtube.search_for_videos(search_term, page=page)

    return jsonify(videos)


@api.route("/add_video/", methods=["POST"])
def add_video():
    playlist_id = request.form.get("playlist_id")
    if playlist_id.strip() == "":
        return jsonify({'error': "You must specify a playlist ID for this video."})

    playlist = Playlist.query.get(playlist_id)
    if playlist == None:
        return jsonify({'error': "Playlist not found"})

    slug = request.form.get("slug")
    if slug.strip() == "":
        return jsonify({'error': "You must specify a slug for this video."})

    thumbnail_url = request.form.get("thumbnail_url")
    if thumbnail_url.strip() == "":
        return jsonify({'error': "You must specify a thumbnail for this video."})

    title = request.form.get("title")
    if title.strip() == "":
        return jsonify({'error': "You must specify a title for this video."})

    v = Video(playlist_id, slug, thumbnail_url, title)
    db_session.add(v)
    db_session.commit()    

    # Publish to Redis so that all clients update playlist
    data = {
        "action": "update_playlist",
        "playlist": Playlist.get_videos(playlist_id)
    }

    redis.publish(playlist_id, json.dumps(data))

    return jsonify({"success": True})

@api.route("/vote/<up_down>/", methods=["POST"])
def vote(up_down):
    video_id = request.form.get("video_id")
    playlist_id = request.form.get("playlist_id")

    video = Video.query.filter(Video.playlist_id==playlist_id).filter(Video.slug==video_id).first()

    if up_down == "up":
        video.rank += 1
    elif up_down == "down":
        video.rank -= 1
    else:
        raise TypeError("Please either upvote or downvote this video.")

    db_session.commit()

    # Publish to Redis so that all clients update playlist
    data = {
        "action": "update_playlist",
        "playlist": Playlist.get_videos(playlist_id)
    }

    redis.publish(playlist_id, json.dumps(data))

    return jsonify({"success": True})

@api.route("/delete")
def remove_video(video_id):
    video = Playlist.query.get(video_id)

    if video is None:
        raise ExistenceError("Video does not exist.")

    db_session.delete(video)
    db_session.commit()

@api.route("/get_playlist/")
def get_playlist():
    playlist_id = request.args.get("playlist_id")

    # Now get the updated playlist and send it to the client
    videos = Video.query.filter(Video.playlist_id==playlist_id).order_by("rank desc")

    data = {
        "playlist": Playlist.get_videos(playlist_id)
    }

    return jsonify(data)

@api.route("/mark_played/", methods=["POST"])
def mark_played():
    playlist_id = request.form.get("playlist_id")
    video_slug = request.form.get("video_slug")

    video = Video.query.filter(Video.playlist_id==playlist_id).filter(Video.slug==video_slug).first()

    db_session.delete(video)
    db_session.commit()

    # Publish to Redis so that all clients update playlist
    data = {
        "action": "update_playlist",
        "playlist": Playlist.get_videos(playlist_id)
    }

    redis.publish(playlist_id, json.dumps(data))

    return jsonify({"success": True})
