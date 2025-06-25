from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)

# Configure the database
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///event.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

# ---------------------- MODELS ----------------------

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
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "role": self.role,
            "created_at": self.created_at
        }

    def __repr__(self):
        return f"<User {self.name}>"


class Events(db.Model):
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
            "start_time": self.start_time,
            "end_time": self.end_time,
            "is_free": self.is_free,
            "created_at": self.created_at
        }

    def __repr__(self):
        return f"<Event {self.name}>"


class Ticket(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    type = db.Column(db.String(50), nullable=False)  # e.g. VIP, Regular
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

    def __repr__(self):
        return f"<Ticket {self.type} - Event {self.event_id}>"


class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    ticket_id = db.Column(db.Integer, db.ForeignKey('ticket.id'), nullable=False)
    attendee_name = db.Column(db.String(50), nullable=False)
    attendee_email = db.Column(db.String(100), unique=True)
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

    def __repr__(self):
        return f"<Booking by {self.attendee_name} for Event {self.event_id}>"

# ---------------------- ROUTES ----------------------

@app.route("/")
def home():
    return "Event Booking API is running"

# ---------------------- CREATE TABLES ----------------------

with app.app_context():
    db.create_all()

# ---------------------- RUN APP ----------------------

if __name__ == "__main__":
    app.run(debug=True)
