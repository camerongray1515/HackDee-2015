import json
from flask import Blueprint
from redis import StrictRedis

sockets = Blueprint("sockets", __name__, url_prefix="/sockets")

redis = StrictRedis(host="localhost",
                    port=6379,
                    db=1)

@sockets.route("/")
def sockets_route(ws):
    data = json.loads(ws.receive())
    playlist_id = data["playlist_id"]

    pubsub = redis.pubsub()
    pubsub.subscribe(playlist_id)
    for message in pubsub.listen():
        if type(message["data"]) is str:
            ws.send(message["data"])
