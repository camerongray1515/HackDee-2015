import json
from flask import Flask, render_template, request, Response, abort
from api import api
from models import Playlist

app = Flask(__name__)
app.secret_key = 'Rxst46YTt6cs38EE'
app.register_blueprint(api)

@app.route("/")
def index():
    return render_template("welcome.html")

@app.route("/main")
def main():
    return render_template("main.html")

@app.route("/<playlist_id>/")
def playlist(playlist_id):
    playlist = Playlist.query.get(playlist_id)
    if playlist == None:
        abort(404)

    return render_template("main.html", playlist=playlist)

@app.route("/welcome")
def welcome():
    return render_template("welcome.html")

if __name__ == "__main__":
    app.run(debug=True)
