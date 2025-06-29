from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from datetime import datetime

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)
CORS(app)

from models import Event, Ticket  # Import models after db is defined

# Homepage route
@app.route('/')
def index():
    return jsonify({'message': '🎉 Welcome to the Event Booking API!'}), 200

@app.route('/events', methods=['POST'])
def create_event():
    data = request.get_json()
    try:
        name = data['name']
        location = data['location']
        date = datetime.fromisoformat(data['date'])
        capacity = int(data['capacity'])
        is_paid = data.get('is_paid', False)

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
            capacity=capacity
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

if __name__ == '__main__':
    app.run(debug=True)
