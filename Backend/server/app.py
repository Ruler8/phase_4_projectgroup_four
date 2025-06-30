from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

from extensions import db, migrate
from models import Event, Ticket

def create_app():
    app = Flask(__name__)
    
    # ✅ FIXED: Changed DB URI to save in the root dir instead of instance/
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app)

    @app.route('/')
    def index():
        return jsonify({'message': '🎉 Welcome to the Event Booking API!'}), 200

    @app.route('/events', methods=['GET'])
    def get_events():
        events = Event.query.all()
        return jsonify([event.to_dict() for event in events]), 200

    @app.route('/events', methods=['POST'])
    def create_event():
        data = request.get_json()
        try:
            name = data['name']
            location = data['location']
            date = datetime.fromisoformat(data['date'])
            capacity = int(data['capacity'])
            is_paid = data.get('is_paid', False)
            image_url = data.get('image_url', '')

            if capacity <= 0:
                return jsonify({'error': 'Capacity must be greater than 0'}), 400
            if date <= datetime.now():
                return jsonify({'error': 'Event date must be in the future'}), 400

            new_event = Event(
                name=name,
                location=location,
                date=date,
                description=data.get('description', ''),
                is_paid=is_paid,
                capacity=capacity,
                image_url=image_url
            )
            db.session.add(new_event)
            db.session.commit()

            return jsonify(new_event.to_dict()), 201

        except KeyError as e:
            return jsonify({'error': f'Missing field: {e.args[0]}'}), 400

    @app.route('/events/<int:id>', methods=['GET'])
    def get_event(id):
        event = Event.query.get_or_404(id)
        return jsonify(event.to_dict()), 200

    @app.route('/events/<int:id>', methods=['PATCH'])
    def update_event(id):
        event = Event.query.get(id)
        if not event:
            return jsonify({'error': 'Event not found'}), 404

        data = request.get_json()
        if 'name' in data:
            event.name = data['name']
        if 'location' in data:
            event.location = data['location']
        if 'date' in data:
            try:
                new_date = datetime.fromisoformat(data['date'])
                if new_date <= datetime.now():
                    return jsonify({'error': 'Event date must be in the future'}), 400
                event.date = new_date
            except ValueError:
                return jsonify({'error': 'Invalid date format. Use ISO format'}), 400
        if 'capacity' in data:
            try:
                new_capacity = int(data['capacity'])
                if new_capacity <= 0:
                    return jsonify({'error': 'Capacity must be greater than 0'}), 400
                event.capacity = new_capacity
            except ValueError:
                return jsonify({'error': 'Invalid capacity'}), 400
        if 'description' in data:
            event.description = data['description']
        if 'is_paid' in data:
            event.is_paid = data['is_paid']
        if 'image_url' in data:
            event.image_url = data['image_url']

        db.session.commit()
        return jsonify(event.to_dict()), 200

    @app.route('/events/<int:id>', methods=['DELETE'])
    def delete_event(id):
        event = Event.query.get(id)
        if not event:
            return jsonify({'error': 'Event not found'}), 404

        db.session.delete(event)
        db.session.commit()
        return jsonify({'message': f'Event with ID {id} deleted'}), 200

    @app.route('/tickets', methods=['POST'])
    def create_ticket():
        data = request.get_json()
        try:
            ticket_type = data['ticket_type']
            price = float(data.get('price', 0))
            event_id = int(data['event_id'])

            if ticket_type.strip() == "":
                return jsonify({'error': 'Ticket type is required'}), 400

            event = Event.query.get(event_id)
            if not event:
                return jsonify({'error': 'Event not found'}), 404

            ticket = Ticket(ticket_type=ticket_type, price=price, event_id=event_id)
            db.session.add(ticket)
            db.session.commit()
            return jsonify(ticket.to_dict()), 201

        except KeyError as e:
            return jsonify({'error': f'Missing field: {e.args[0]}'}), 400

    @app.route('/admin/bookings', methods=['GET'])
    def get_all_bookings():
        tickets = Ticket.query.all()
        return jsonify([{
            'id': ticket.id,
            'ticket_type': ticket.ticket_type,
            'price': ticket.price,
            'event': {
                'id': ticket.event.id,
                'name': ticket.event.name,
                'location': ticket.event.location,
                'date': ticket.event.date.isoformat()
            }
        } for ticket in tickets]), 200

    @app.route('/bookings/<int:id>', methods=['DELETE'])
    def delete_ticket(id):
        ticket = Ticket.query.get(id)
        if not ticket:
            return jsonify({'error': 'Ticket not found'}), 404

        db.session.delete(ticket)
        db.session.commit()
        return jsonify({'message': f'Ticket with ID {id} deleted'}), 200

    return app

app = create_app()
