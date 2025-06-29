from flask import jsonify, request
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Events, Ticket, Booking


def register_routes(app):

    def is_admin(user_id):
        user = User.query.get(user_id)
        return user and user.role == "admin"

    @app.route("/")
    def home():
        return jsonify({"Welcome": "Get your tickets now!"})

    # Register Users: Attendees and Administrators
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

        if not all([name, email, phone, password, role]):
            return jsonify({"error": "Missing required fields"}), 400

        if User.query.filter_by(email=email).first():
            return jsonify({"error": "User already exists"}), 400

        password_hash = generate_password_hash(password)

        user = User(name=name, email=email, phone=phone,
                    password_hash=password_hash, role=role)
        db.session.add(user)
        db.session.commit()

        return jsonify(user.to_dict()), 201

    # Users Login: Attendees and Administrators
    @app.route("/login", methods=["POST"])
    def login():
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        user = User.query.filter_by(email=email).first()
        if not user or not check_password_hash(user.password_hash, password):
            return jsonify({"error": "Invalid credentials"}), 401

        return jsonify({"message": "Login successful", "user_id": user.id, "user": user.to_dict()}), 200

    # Retrieve All Users (Admin Only)
    @app.route("/users", methods=["GET"])
    def get_all_users():
        requester_id = request.args.get("requester_id", type=int)
        if not is_admin(requester_id):
            return jsonify({"error": "Unauthorized. Admin access required."}), 403

        users = User.query.all()
        return jsonify([user.to_dict() for user in users]), 200

    # Retrieve User by ID (Admin or Self Only)
    @app.route("/users/<int:user_id>", methods=["GET"])
    def get_user_by_id(user_id):
        requester_id = request.args.get("requester_id", type=int)
        if not requester_id:
            return jsonify({"error": "Requester ID required"}), 400

        requester = User.query.get(requester_id)
        if not requester:
            return jsonify({"error": "Invalid requester"}), 403

        if requester.role != "admin" and requester.id != user_id:
            return jsonify({"error": "Unauthorized access"}), 403

        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify(user.to_dict()), 200

    # Returns a list of all event records in the database
    @app.route("/events", methods=["GET"])
    def get_events():
        events = Events.query.all()
        return jsonify([event.to_dict() for event in events]), 200

    # Returns all events where the name matches case-insensitively.
    @app.route("/events/search", methods=["GET"])
    def search_events():
        name = request.args.get("name", "")
        events = Events.query.filter(Events.name.ilike(f"%{name}%")).all()
        return jsonify([event.to_dict() for event in events]), 200

    # Book Tickets
    @app.route("/book", methods=["POST"])
    def book_ticket():
        data = request.get_json()

        user_id = data.get("user_id")
        event_id = data.get("event_id")
        ticket_id = data.get("ticket_id")
        attendee_name = data.get("attendee_name")
        attendee_email = data.get("attendee_email")

        if not all([user_id, event_id, ticket_id, attendee_name, attendee_email]):
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

        existing_booking = Booking.query.filter_by(
            user_id=user_id, event_id=event_id, ticket_id=ticket_id).first()
        if existing_booking:
            return jsonify({"error": "You have already booked this ticket."}), 400

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

    # List Bookings by User (Admin or Self Only)

    @app.route("/bookings/user/<int:user_id>", methods=["GET"])
    def get_bookings_by_user(user_id):
        requester_id = request.args.get("requester_id", type=int)
        if not requester_id:
            return jsonify({"error": "Requester ID required"}), 400
        requester = User.query.get(requester_id)
        if not requester:
             return jsonify({"error": "Invalid requester"}), 403
        if requester.role != "admin" and requester.id != user_id:
            return jsonify({"error": "Unauthorized access"}), 403
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        bookings = Booking.query.filter_by(user_id=user_id).all()
        return jsonify([booking.to_dict() for booking in bookings]), 200


   # List Bookings by Event (Admin Only)
    @app.route("/bookings/event/<int:event_id>", methods=["GET"])
    def get_bookings_by_event(event_id):
        requester_id = request.args.get("requester_id", type=int)
        if not requester_id:
           return jsonify({"error": "Requester ID required"}), 400

        if not is_admin(requester_id):
           return jsonify({"error": "Unauthorized. Admin access required."}), 403

        event = Events.query.get(event_id)
        if not event:
           return jsonify({"error": "Event not found"}), 404

        bookings = Booking.query.filter_by(event_id=event_id).all()
        return jsonify([booking.to_dict() for booking in bookings]), 200

    # Admin-only Event Creation
    @app.route("/events", methods=["POST"])
    def create_event():
        data = request.get_json()
        user_id = data.get("user_id")

        if not is_admin(user_id):
            return jsonify({"error": "Unauthorized. Admin access required."}), 403

        required_fields = ["name", "description", "location",
                           "category", "start_time", "end_time", "is_free"]
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing event data"}), 400

        try:
            start_time = datetime.strptime(data["start_time"], "%Y-%m-%d %H:%M:%S")
            end_time = datetime.strptime(data["end_time"], "%Y-%m-%d %H:%M:%S")
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD HH:MM:SS"}), 400

        if end_time <= start_time:
            return jsonify({"error": "End time must be after start time"}), 400

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

    # Create Ticket (Admin Only)
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
