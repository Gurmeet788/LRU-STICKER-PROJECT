from flask import Flask, send_from_directory, jsonify
from dotenv import load_dotenv
import os
load_dotenv()
app = Flask(__name__)
STICKER_FOLDER = os.getenv("STICKER_FOLDER", "stickers")

@app.route("/all-stickers")
def all_stickers():
    stickers = os.listdir(STICKER_FOLDER)
    return jsonify(stickers)

@app.route("/get-sticker/<name>")
def get_sticker(name):
    return send_from_directory(STICKER_FOLDER, name)

if __name__ == "__main__":
    app.run(debug=True)