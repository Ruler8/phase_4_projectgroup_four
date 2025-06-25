# 🎟️ Event Booking System API

A Flask-based backend application that allows users to register, login, browse events, and book tickets. Admins can create events and tickets. Built using Flask, SQLAlchemy, and SQLite.

---

## 🚀 Features

- User registration and login (with hashed passwords)
- View all events and search events by name
- Book tickets (with availability check)
- Admin-only:
  - Create events
  - Create tickets

---

## 🛠 Tech Stack

- Python 3.x
- Flask
- Flask SQLAlchemy
- SQLite (for development)
- Werkzeug (for password hashing)

---

## 📦 Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/event-booking-system.git
   cd event-booking-system
Create and activate a virtual environment

bash
Copy
Edit
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
Install dependencies

bash
Copy
Edit
pip install -r requirements.txt
Run the application

bash
Copy
Edit
python app.py
🌐 API Endpoints
🔐 Authentication
POST /register
Register a new user.

Request JSON:

json
Copy
Edit
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "0712345678",
  "password": "secure123",
  "role": "admin"   // Optional, default is "attendee"
}
POST /login
Login as existing user.

Request JSON:

json
Copy
Edit
{
  "email": "jane@example.com",
  "password": "secure123"
}
📅 Events
GET /events
Get a list of all events.

GET /events/search?name=Tech
Search for events by name (case-insensitive).

POST /events (Admin only)
Create a new event.

Request JSON:

json
Copy
Edit
{
  "user_id": 1,
  "name": "Tech Summit",
  "description": "Annual technology conference",
  "location": "Nairobi",
  "category": "Technology",
  "start_time": "2025-08-10 10:00:00",
  "end_time": "2025-08-10 17:00:00",
  "is_free": false
}
🎟 Tickets
POST /tickets (Admin only)
Create a ticket type for an event.

Request JSON:

json
Copy
Edit
{
  "user_id": 1,
  "event_id": 2,
  "type": "VIP",
  "price": 100.0,
  "quantity": 50
}
📌 Bookings
POST /book
Book a ticket for an event.

Request JSON:

json
Copy
Edit
{
  "user_id": 3,
  "event_id": 2,
  "ticket_id": 1,
  "attendee_name": "John Doe",
  "attendee_email": "john@example.com"
}
🧪 Sample Admin User Creation
You can register an admin by including "role": "admin" in the registration payload.

📁 Project Structure
csharp
Copy
Edit
event-booking-system/
│
├── app.py              # Main Flask application
├── event.db            # SQLite database (created after first run)
├── requirements.txt    # Python dependencies
└── README.md           # This file