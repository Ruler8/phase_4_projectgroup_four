from flask import jsonify, request
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Event, Ticket, Booking


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
        required_fields = ["name", "email", "phone", "password"]
        if not data:
            return jsonify({"error": "Invalid input. JSON data required."}), 400
        missing = [field for field in required_fields if not data.get(field)]
        if missing:
             return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400
        email = data["email"].strip().lower()
        if User.query.filter_by(email=email).first():
            return jsonify({"error": "User already exists with this email"}), 400
        role = data.get("role", "attendee")
        if role not in ["admin", "attendee"]:
            return jsonify({"error": "Invalid role."}), 400
        user = User(
        name=data["name"].strip(),
        email=email,
        phone=data["phone"].strip(),
        password_hash=generate_password_hash(data["password"]),
        role=role
    )
        
        try:
            db.session.add(user)
            db.session.commit()
            return jsonify({
                "message": "User registered successfully",
                "user": user.to_dict()
                }), 201
        
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": "Database error", "details": str(e)}), 500
             
    # Users Login: Attendees and Administrators
    @app.route("/login", methods=["POST"])
    def login():
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid input. JSON data required."}), 400
        email = data.get("email")
        password = data.get("password")
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
        user = User.query.filter_by(email=email).first()
        if not user or not check_password_hash(user.password_hash, password):
            return jsonify({"error": "Invalid credentials"}), 401
        return jsonify({
        "message": "Login successful",
        "user_id": user.id,
        "user": user.to_dict()
    }), 200
        
             
    
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

    # Update User Info (Self Only)
    @app.route("/users/<int:user_id>", methods=["PUT", "PATCH"])
    def update_user(user_id):
        requester_id = request.args.get("requester_id", type=int)
        if not requester_id:
            return jsonify({"error": "Requester ID required"}), 400
        requester = User.query.get(requester_id)
        if not requester:
            return jsonify({"error": "Invalid requester"}), 403

        if requester.id != user_id:
            return jsonify({"error": "Unauthorized. You can only update your own information."}), 403

        data = request.get_json()
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

    # Optional fields to update
        name = data.get("name")
        email = data.get("email")
        phone = data.get("phone")
        password = data.get("password")

    # Update fields if provided
        if name:
            user.name = name
        if email:
            # Prevent email duplication
            if User.query.filter(User.email == email, User.id != user.id).first():
                return jsonify({"error": "Email is already in use"}), 400
            user.email = email
        if phone:
            user.phone = phone
        if password:
            user.password_hash = generate_password_hash(password)

        db.session.commit()
        return jsonify({"message": "User updated successfully", "user": user.to_dict()}), 200

    # Delete User (Admin Only)

    @app.route("/users/<int:user_id>", methods=["DELETE"])
    def delete_user(user_id):
        requester_id = request.args.get("requester_id", type=int)
        if not is_admin(requester_id):
            return jsonify({"error": "Unauthorized. Admin access required."}), 403

        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Delete related bookings
        Booking.query.filter_by(user_id=user_id).delete()
        db.session.delete(user)
        db.session.commit()

        return jsonify({"message": "User deleted successfully"}), 200

    # Returns a list of all event records in the database
    @app.route("/events", methods=["GET"])
    def get_events():
        events = Event.query.all()
        return jsonify([event.to_dict() for event in events]), 200

    # Returns all events where the name matches case-insensitively.
    @app.route("/events/search", methods=["GET"])
    def search_events():
        name = request.args.get("name", "")
        events = Event.query.filter(Event.name.ilike(f"%{name}%")).all()
        return jsonify([event.to_dict() for event in events]), 200

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
            start_time = datetime.strptime(
                data["start_time"], "%Y-%m-%d %H:%M:%S")
            end_time = datetime.strptime(data["end_time"], "%Y-%m-%d %H:%M:%S")
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD HH:MM:SS"}), 400

        if end_time <= start_time:
            return jsonify({"error": "End time must be after start time"}), 400

        event = Event(
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

    # Delete Event (Admin Only)
    @app.route("/events/<int:event_id>", methods=["DELETE"])
    def delete_event(event_id):
        requester_id = request.args.get("requester_id", type=int)
        if not is_admin(requester_id):
            return jsonify({"error": "Unauthorized. Admin access required."}), 403
        event = Event.query.get(event_id)
        if not event:
             return jsonify({"error": "Event not found"}), 404
        
        # Delete related bookings and tickets
        Booking.query.filter_by(event_id=event_id).delete()
        Ticket.query.filter_by(event_id=event_id).delete()
        db.session.delete(event)
        db.session.commit()
        return jsonify({"message": "Event deleted successfully"}), 200
    

    @app.route("/events/<int:event_id>", methods=["PUT"])
    def update_event(event_id):
        data = request.get_json()
        requester_id = request.args.get("requester_id", type=int)
        if not is_admin(requester_id):
            return jsonify({"error": "Unauthorized"}), 403
        event = Event.query.get(event_id)
        if not event:
            return jsonify({"error": "Event not found"}), 404
        for field in ["name", "description", "location", "category", "start_time", "end_time", "is_free"]:
            if field in data:
                setattr(event, field, data[field])
                db.session.commit()
                return jsonify(event.to_dict()), 200

    
    
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

        event = Event.query.get(data["event_id"])
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

    # Delete Ticket (Admin Only)
    @app.route("/tickets/<int:ticket_id>", methods=["DELETE"])
    def delete_ticket(ticket_id):
        requester_id = request.args.get("requester_id", type=int)
        if not is_admin(requester_id):
            return jsonify({"error": "Unauthorized. Admin access required."}), 403

        ticket = Ticket.query.get(ticket_id)
        if not ticket:
            return jsonify({"error": "Ticket not found"}), 404

        if ticket.sold > 0:
            return jsonify({"error": "Cannot delete ticket with sales"}), 400

        db.session.delete(ticket)
        db.session.commit()

        return jsonify({"message": "Ticket deleted successfully"}), 200

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

        event = Event.query.get(event_id)
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

    # get bookings by id
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

    @app.route("/bookings/event/<int:event_id>", methods=["GET"])
    def get_bookings_by_event(event_id):
        requester_id = request.args.get("requester_id", type=int)
        if not is_admin(requester_id):
            return jsonify({"error": "Unauthorized. Admin access required."}), 403

        event = Event.query.get(event_id)
        if not event:
            return jsonify({"error": "Event not found"}), 404

        bookings = Booking.query.filter_by(event_id=event_id).all()
        return jsonify([booking.to_dict() for booking in bookings]), 200
    
    #get all bookings
    @app.route("/bookings/all", methods=["GET"])
    def get_all_bookings():
        requester_id = request.args.get("requester_id", type=int)
        if not is_admin(requester_id):
            return jsonify({"error": "Unauthorized. Admin access required."}), 403
        bookings = Booking.query.all()
        return jsonify([b.to_dict() for b in bookings]), 200

    # Delete Booking (Admin or Owner)
    @app.route("/bookings/<int:booking_id>", methods=["DELETE"])
    def delete_booking(booking_id):
        requester_id = request.args.get("requester_id", type=int)
        if not requester_id:
            return jsonify({"error": "Requester ID required"}), 400

        requester = User.query.get(requester_id)
        if not requester:
            return jsonify({"error": "Invalid requester"}), 403

        booking = Booking.query.get(booking_id)
        if not booking:
            return jsonify({"error": "Booking not found"}), 404

        if requester.role != "admin" and requester.id != booking.user_id:
            return jsonify({"error": "Unauthorized"}), 403

        # Reduce ticket count
        ticket = Ticket.query.get(booking.ticket_id)
        if ticket and ticket.sold > 0:
            ticket.sold -= 1

        db.session.delete(booking)
        db.session.commit()

        return jsonify({"message": "Booking deleted successfully"}), 200
    
    @app.route("/tickets", methods=["GET"])
    def get_all_tickets():
         tickets = Ticket.query.all()
         return jsonify([ticket.to_dict() for ticket in tickets])

   
    

