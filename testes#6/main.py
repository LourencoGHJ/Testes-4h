from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///studyassistant.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Database Models
class StudySession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    start_time = db.Column(db.DateTime, default=datetime.utcnow)
    end_time = db.Column(db.DateTime)
    session_type = db.Column(db.String(50))
    duration = db.Column(db.Integer)  # in minutes

class Flashcard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String(500))
    answer = db.Column(db.String(500))
    category = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    content = db.Column(db.Text)
    category = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    priority = db.Column(db.Integer)  # 1: High, 2: Medium, 3: Low
    due_date = db.Column(db.DateTime)
    completed = db.Column(db.Boolean, default=False)

@app.route('/')
def home():
    return send_from_directory('.', 'study-index.html')

@app.route('/study-style.css')
def serve_css():
    return send_from_directory('.', 'study-style.css')

@app.route('/study-app.js')
def serve_js():
    return send_from_directory('.', 'study-app.js')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)