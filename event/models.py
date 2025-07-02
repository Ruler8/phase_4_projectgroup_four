# models.py
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    password_hash = db.Column(db.String, nullable=True)
    role = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    bookings = db.relationship('Booking', backref='user', cascade="all, delete-orphan")

    def to_dict(self):
        return{
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "role": self.role,
            "created_at": self.created_at
        }
      
class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    start_time = db.Column(db.DateTime)
    end_time = db.Column(db.DateTime)
    is_free = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    tickets = db.relationship('Ticket', backref='event', cascade="all, delete-orphan")
    bookings = db.relationship('Booking', backref='event', cascade="all, delete-orphan")

    def to_dict(self):
        return {
        "id": self.id,
        "name": self.name,
        "description": self.description,
        "location": self.location,
        "category": self.category,
        "start_time": self.start_time.isoformat() if self.start_time else None,
        "end_time": self.end_time.isoformat() if self.end_time else None,
        "is_free": self.is_free,
        "created_at": self.created_at.isoformat() if self.created_at else None
    }
    



class Ticket(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    sold = db.Column(db.Integer, default=0)

    bookings = db.relationship('Booking', backref='ticket', cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "event_id": self.event_id,
            "type": self.type,
            "price": self.price,
            "quantity": self.quantity,
            "sold": self.sold
        }


class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)
    ticket_id = db.Column(db.Integer, db.ForeignKey('ticket.id'), nullable=False)
    attendee_name = db.Column(db.String(50), nullable=False)
    attendee_email = db.Column(db.String(100), nullable=True)
    status = db.Column(db.String(20), nullable=False, default="confirmed")
    booking_time = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "event_id": self.event_id,
            "ticket_id": self.ticket_id,
            "attendee_name": self.attendee_name,
            "attendee_email": self.attendee_email,
            "status": self.status,
            "booking_time": self.booking_time
        }
