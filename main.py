from flask import Flask, render_template, request, Response

app = Flask(__name__)
app.secret_key = 'Rxst46YTt6cs38EE'

@app.route("/")
def index():
    return render_template("base.html")

if __name__ == "__main__":
    app.run(debug=True)
