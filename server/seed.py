from app import app, db
from models import Event, Ticket
from datetime import datetime

with app.app_context():
    db.drop_all()
    db.create_all()

    event1 = Event(
        name="FlaskConf 2025",
        location="Nairobi",
        description="Annual Python + Flask Conference",
        date=datetime(2025, 9, 1, 10),
        is_paid=True,
        capacity=100
    )
    db.session.add(event1)
    db.session.commit()

    ticket1 = Ticket(ticket_type="Regular", price=500.0, event_id=event1.id)
    ticket2 = Ticket(ticket_type="VIP", price=1500.0, event_id=event1.id)
    db.session.add_all([ticket1, ticket2])
    db.session.commit()
    print("Seeded successfully!")   