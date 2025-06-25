from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///instance/event_booking.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)
CORS(app)

from models import Event, Ticket  # Import models after db is defined
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

