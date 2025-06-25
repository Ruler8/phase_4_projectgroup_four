from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

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

    def __repr__(self):
        return f"<Booking by {self.attendee_name} for Event {self.event_id}>"


# ---------------------- HELPERS ----------------------

def is_admin(user_id):
    user = User.query.get(user_id)
    return user and user.role == "admin"

# ---------------------- ROUTES ----------------------

@app.route("/")
def home():
    return jsonify({"Welcome": "Get your tickets now!"})


@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid input"}), 400

    name = data.get("name")
    email = data.get("email")
    phone = data.get("phone")
    password = data.get("password")
    role = data.get("role", "attendee")

    if not all([name, email, phone, password]):
        return jsonify({"error": "Missing required fields"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "User already exists"}), 400

    password_hash = generate_password_hash(password)

    user = User(
        name=name,
        email=email,
        phone=phone,
        password_hash=password_hash,
        role=role
    )

    db.session.add(user)
    db.session.commit()

    return jsonify(user.to_dict()), 201


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify({"message": "Login successful", "user": user.to_dict()}), 200


@app.route("/events", methods=["GET"])
def get_events():
    events = Events.query.all()
    return jsonify([event.to_dict() for event in events])


@app.route("/events/search", methods=["GET"])
def search_events():
    name = request.args.get("name", "")
    events = Events.query.filter(Events.name.ilike(f"%{name}%")).all()
    return jsonify([event.to_dict() for event in events])


@app.route("/book", methods=["POST"])
def book_ticket():
    data = request.get_json()

    user_id = data.get("user_id")
    event_id = data.get("event_id")
    ticket_id = data.get("ticket_id")
    attendee_name = data.get("attendee_name")
    attendee_email = data.get("attendee_email")

    if not all([user_id, event_id, ticket_id, attendee_name]):
        return jsonify({"error": "Missing booking details"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Invalid user ID"}), 404

    event = Events.query.get(event_id)
    if not event:
        return jsonify({"error": "Invalid event ID"}), 404

    ticket = Ticket.query.get(ticket_id)
    if not ticket:
        return jsonify({"error": "Invalid ticket ID"}), 404

    if ticket.sold >= ticket.quantity:
        return jsonify({"error": "Tickets are sold out for this type"}), 400

    booking = Booking(
        user_id=user_id,
        event_id=event_id,
        ticket_id=ticket_id,
        attendee_name=attendee_name,
        attendee_email=attendee_email,
        status="confirmed"
    )
    db.session.add(booking)
    ticket.sold += 1
    db.session.commit()

    return jsonify(booking.to_dict()), 201


@app.route("/events", methods=["POST"])
def create_event():
    data = request.get_json()
    user_id = data.get("user_id")

    if not is_admin(user_id):
        return jsonify({"error": "Unauthorized. Admin access required."}), 403

    required_fields = ["name", "description", "location", "category", "start_time", "end_time", "is_free"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing event data"}), 400

    try:
        start_time = datetime.strptime(data["start_time"], "%Y-%m-%d %H:%M:%S")
        end_time = datetime.strptime(data["end_time"], "%Y-%m-%d %H:%M:%S")
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD HH:MM:SS"}), 400

    event = Events(
        name=data["name"],
        description=data["description"],
        location=data["location"],
        category=data["category"],
        start_time=start_time,
        end_time=end_time,
        is_free=data["is_free"]
    )

    db.session.add(event)
    db.session.commit()

    return jsonify(event.to_dict()), 201


@app.route("/tickets", methods=["POST"])
def create_ticket():
    data = request.get_json()
    user_id = data.get("user_id")

    if not is_admin(user_id):
        return jsonify({"error": "Unauthorized. Admin access required."}), 403

    required_fields = ["event_id", "type", "price", "quantity"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing ticket data"}), 400

    event = Events.query.get(data["event_id"])
    if not event:
        return jsonify({"error": "Event not found"}), 404

    ticket = Ticket(
        event_id=data["event_id"],
        type=data["type"],
        price=data["price"],
        quantity=data["quantity"]
    )

    db.session.add(ticket)
    db.session.commit()

    return jsonify(ticket.to_dict()), 201


# ---------------------- CREATE TABLES ----------------------

with app.app_context():
    db.create_all()

# ---------------------- RUN APP ----------------------

if __name__ == "__main__":
    app.run(debug=True)
