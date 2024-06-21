from flask import Flask, request, jsonify
from flask_cors import CORS
from pydantic import BaseModel, ValidationError, Field
from typing import List, Tuple, Optional
from datetime import datetime

app = Flask(__name__)
CORS(app)

class Author(BaseModel):
    _id: str
    name: str
    email: str

class Post(BaseModel):
    _id: str
    title: str
    content: str
    author: Author
    category: str
    createdAt: datetime
    __v: int

@app.route("/")
def root():
    return {"message": "Hello World"}

@app.route('/count', methods=['POST'])
def count():
    data = request.get_json()
    count = data.get('count', 0)
    new_count = count + 1
    return jsonify(new_count=new_count)

@app.route('/posts', methods=['POST'])
def posts():
    try:
        data = request.get_json()
        posts = [Post(**post) for post in data]
        print(posts)
        for post in posts:
            post.title="charan"
        posts_dict = [post.dict() for post in posts]
        return jsonify(posts=posts_dict)
    except ValidationError as e:
        return jsonify(e.errors()), 400

if __name__ == '__main__':
    app.run(debug=True)
