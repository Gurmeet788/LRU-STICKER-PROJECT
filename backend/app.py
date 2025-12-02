from flask import Flask, send_from_directory, jsonify, request
from dotenv import load_dotenv
import os
from backend.stickers.lru_cache import LRUcache
load_dotenv()
app = Flask(__name__)
STICKER_FOLDER = os.getenv("STICKER_FOLDER", "stickers")
cache = LRUcache(capacity=10)

@app.route("/all-stickers")
def all_stickers():
    stickers = os.listdir(STICKER_FOLDER)
    return jsonify(stickers)

@app.route("/get-sticker/<name>")
def get_sticker(name):
    return send_from_directory(STICKER_FOLDER, name)

@app.route("/add", methods=["POST"])
def add_stickers():
    data = request.get_json()
    key = data.get("key")
    value = data.get("value")

    cache.put(key,value)
    return jsonify({"message:" : "Stickers_Add", "key" : key , "value": value})

@app.route("/get/<key>", method=["GET"])
def get_sticker(key):
    sticker = cache.get(key=key)
    return jsonify({"key:": key, "Sticker:": sticker})

@app.route("get_cache", method=["GET"])
def all_cache():
    return jsonify(cache.get_all_cache())

if __name__ == "__main__":
    app.run(debug=True)