from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import json

db = SQLAlchemy()

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(200), nullable=False)  # Nom complet
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship
    progress = db.relationship('Progress', backref='user', lazy=True, uselist=False)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def __repr__(self):
        return f'<User {self.email}>'


class Progress(db.Model):
    __tablename__ = 'progress'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    current_section = db.Column(db.String(20), default='reading')  # 'reading' or 'listening'
    current_question = db.Column(db.Integer, default=0)
    answers = db.Column(db.Text, default='{}')  # JSON string
    reading_completed = db.Column(db.Boolean, default=False)
    listening_completed = db.Column(db.Boolean, default=False)
    test_completed = db.Column(db.Boolean, default=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def get_answers(self):
        """Parse JSON answers"""
        try:
            return json.loads(self.answers)
        except:
            return {}
    
    def set_answers(self, answers_dict):
        """Convert dict to JSON string"""
        self.answers = json.dumps(answers_dict)
    
    def __repr__(self):
        return f'<Progress user_id={self.user_id} section={self.current_section} question={self.current_question}>'
