# 🎟️ Eventify - Event Booking Platform

# 🎟️ Eventify

Eventify is a full-stack event booking platform built with **Flask** (backend) and **React** (frontend). It enables users to browse, book, and manage event tickets, while giving administrators full control over events and bookings.

---

## 🧩 Functionalities

### 👤 User
- Register and login
- View all upcoming events
- Search for events by name
- View event details
- Book tickets (with personal info, price, and date)
- View booking dashboard with stats and booking history
- Contact event organizers via a contact form

### 🔐 Admin
- Login as admin
- Add, edit, and delete events
- View all bookings
- Manage bookings from admin dashboard
- View booking summary by users and ticket types

---

## 🚀 Tech Stack

### Frontend
- React (Vite)
- React Router
- Tailwind CSS
- Framer Motion (animations)
- React Toastify (notifications)

### Backend
- Python + Flask
- SQLAlchemy (ORM)
- SQLite database
- Flask-CORS

---

## 📦 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/eventify.git
cd eventify

Backend Setup

cd backend
python3 -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

pip install -r requirements.txt
flask db init
flask db migrate
flask db upgrade
python seed.py  # Optional: seed sample events & tickets

flask run

Frontend Setup
cd frontend
npm install
npm run dev

| Method | Endpoint       | Description             |
| ------ | -------------- | ----------------------- |
| GET    | `/events`      | List all events         |
| POST   | `/register`    | Register new user       |
| POST   | `/login`       | Login user/admin        |
| POST   | `/bookings`    | Submit a new booking    |
| DELETE | `/events/<id>` | Delete an event (admin) |
| PUT    | `/events/<id>` | Update an event (admin) |


Project Structure

eventify/
├── backend/                          # Flask backend
│   ├── app.py                       # Flask app entry point
│   ├── models.py                    # SQLAlchemy models (User, Event, Ticket, Booking)
│   ├── routes.py                    # Flask API routes
│   └── seed.py                      # Seed script for initial test data
│
├── frontend/                         # React frontend (Vite)
│   ├── src/
│   │   ├── components/              # Reusable UI components (forms, tables, buttons)
│   │   ├── pages/                   # Route-based page components
│   │   │   ├── AdminLogin.jsx      # Login page for admin users
│   │   │   ├── AdminPage.jsx       # Admin dashboard with event/ticket controls
│   │   │   ├── Contact.jsx         # Contact form/page
│   │   │   ├── DashboardPage.jsx   # User dashboard showing bookings/events
│   │   │   ├── EventList.jsx       # Displays a list of all available events
│   │   │   ├── Home.jsx            # Public homepage with general info
│   │   │   ├── Login.jsx           # User login page
│   │   │   ├── Register.jsx        # User registration page
│   │   │   └── index.jsx           # Central exports or page router (if used)
│   │   ├── App.jsx                 # Main app component with route definitions
│   │   └── main.jsx                # React entry point
│   └── index.html                  # HTML template used by Vite
│
└── README.md                       # Project documentation

🖼️ UI Screens

Components/JSX Overview

Home.jsx: Hero section with animated grid of events + Book Now links

EventList.jsx: Search bar, dynamic event table, fallback placeholder images

BookingForm.jsx: Booking inputs with validation + toast success feedback

Dashboard.jsx: User dashboard showing total bookings and upcoming event

LoginForm.jsx / RegisterForm.jsx: Auth forms with validation and navigation

AdminPanel.jsx: Full CRUD interface for managing events and viewing bookings

Navbar.jsx: Navigation links to events, home, and contact

Contact.jsx: Feedback form + go back button

All UI is responsive, styled using Tailwind CSS, and includes UX enhancements like hover states, modals, and animated transitions.

 Author

Allan,Elvis,Warioba,Ian Built by passionate full-stack developers.

License

MIT License
