from app import db
from datetime import datetime

class Event(db.Model):
    __tablename__ = 'events'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    location = db.Column(db.String, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    is_paid = db.Column(db.Boolean, default=False)
    capacity = db.Column(db.Integer, nullable=False)
    image_url = db.Column(db.String)

    tickets = db.relationship('Ticket', backref='event', cascade='all, delete')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'location': self.location,
            'date': self.date.isoformat(),
            'is_paid': self.is_paid,
            'capacity': self.capacity,
            'image_url': self.image_url,
            'tickets': [ticket.to_dict() for ticket in self.tickets]
        }

class Ticket(db.Model):
    __tablename__ = 'tickets'

    id = db.Column(db.Integer, primary_key=True)
    ticket_type = db.Column(db.String, nullable=False)
    price = db.Column(db.Float)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'ticket_type': self.ticket_type,
            'price': self.price,
            'event_id': self.event_id
        }
