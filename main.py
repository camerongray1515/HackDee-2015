from flask import Flask, render_template, request, Response
from api import api
from sockets import sockets

app = Flask(__name__)
app.secret_key = 'Rxst46YTt6cs38EE'
app.register_blueprint(api)
app.register_blueprint(sockets)

@app.route("/")
def index():
    return render_template("base.html")

@app.route("/main")
def main():
    return render_template("main.html")

@app.route("/welcome")
def welcome():
    return render_template("welcome.html")

if __name__ == "__main__":
    app.run(debug=True)
