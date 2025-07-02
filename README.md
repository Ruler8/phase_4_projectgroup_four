# 🎟️ Event Booking System API

Download: https://sqlitebrowser.org
sudo apt update
sudo apt install sqlitebrowser
sqlitebrowser &


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
Backend:
├── event/app.py
├── event/models.py
├── event/routes.py

Frontend:
├── FrontEnd/Front_end/src/api/auth.js
├── FrontEnd/Front_end/src/components/AdminNavbar.css
├── FrontEnd/Front_end/src/components/AdminNavbar.jsx

Pages:
├── FrontEnd/Front_end/src/pages/AdminBookingManagement.jsx
├── FrontEnd/Front_end/src/pages/AdminDashboard.jsx
├── FrontEnd/Front_end/src/pages/AdminEventManagement.jsx
├── FrontEnd/Front_end/src/pages/AdminTicketManagement.jsx
├── FrontEnd/Front_end/src/pages/AdminUserManagement.jsx
├── FrontEnd/Front_end/src/pages/BookingForm.jsx
├── FrontEnd/Front_end/src/pages/LandingPage.jsx
├── FrontEnd/Front_end/src/pages/Login.jsx
├── FrontEnd/Front_end/src/pages/Register.jsx
├── FrontEnd/Front_end/src/pages/UserBookingManagement.jsx
├── FrontEnd/Front_end/src/pages/UserHome.jsx
├── FrontEnd/Front_end/src/pages/UserProfile.jsx
├── FrontEnd/Front_end/src/pages/ViewEditUser.jsx
├── FrontEnd/Front_end/src/App.jsx
