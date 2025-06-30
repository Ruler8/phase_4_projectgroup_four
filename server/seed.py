from app import app
from models import db, Event, Ticket
from datetime import datetime

with app.app_context():
    print("🌱 Seeding database...")

    # Delete old records
    Ticket.query.delete()
    Event.query.delete()

    # Create events
    event1 = Event(
        name="Tech Expo Nairobi",
        description="Explore latest tech innovations.",
        location="KICC",
        date=datetime(2025, 7, 20, 10, 0),
        is_paid=True,
        capacity=150
    )

    event2 = Event(
        name="Startup Pitch Night",
        description="Local startups pitch ideas to investors.",
        location="iHub",
        date=datetime(2025, 8, 5, 18, 30),
        is_paid=False,
        capacity=100
    )

    db.session.add_all([event1, event2])
    db.session.commit()

    # Create tickets
    ticket1 = Ticket(ticket_type="Standard", price=500.0, event_id=event1.id)
    ticket2 = Ticket(ticket_type="VIP", price=1500.0, event_id=event1.id)
    ticket3 = Ticket(ticket_type="General", price=0.0, event_id=event2.id)

    db.session.add_all([ticket1, ticket2, ticket3])
    db.session.commit()

    print("Done seeding!")
