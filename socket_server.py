import json
from flask import Flask
from flask_sockets import Sockets
from redis import StrictRedis

app = Flask(__name__)
app.secret_key = 'Rxst46YTt6cs38EE'

socket = Sockets(app)

redis = StrictRedis(host="localhost",
                    port=6379,
                    db=1)

@socket.route("/socket/")
def sockets_route(ws):
    data = json.loads(ws.receive())
    playlist_id = data["playlist_id"]

    pubsub = redis.pubsub()
    pubsub.subscribe(playlist_id)
    for message in pubsub.listen():
        if type(message["data"]) is str:
            ws.send(message["data"])

if __name__ == "__main__":
    app.run(debug=True)
