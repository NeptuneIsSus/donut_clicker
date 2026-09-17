from flask import Flask, render_template
import webview
import threading

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("title.html")

def run_flask():
    app.run(port=5000)

threading.Thread(target=run_flask, daemon=True).start()

webview.create_window("My Game", "http://127.0.0.1:5000")
webview.start()