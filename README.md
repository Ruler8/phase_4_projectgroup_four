# Phase_4_Project-Group-4

#  Flask Event Booking API

This is a backend RESTful API built with Flask and SQLAlchemy that supports **event browsing**, **ticket management**, **user registration**, and **booking events**. The system supports both free and paid events and tracks attendee bookings.

##  Features

- User registration with role assignment (e.g., admin, attendee)
- Event creation and listing
- Ticket type management (e.g., VIP, Regular)
- Booking system with status tracking
- Relational database using SQLAlchemy ORM
- RESTful JSON responses (to be implemented)

##  Models Overview

### `User`
| Field | Type | Description |
|-------|------|-------------|
| id | Integer | Primary key |
| name | String | User's full name |
| email | String | Unique email |
| phone | String | Phone number |
| password_hash | String | Password hash |
| role | String | User role (admin, attendee) |
| created_at | DateTime | Time of creation |

---

### `Events`
| Field | Type | Description |
|-------|------|-------------|
| id | Integer | Primary key |
| name | String | Event title |
| description | String | Description of the event |
| location | String | Venue |
| category | String | Category (e.g., Music, Business) |
| start_time | DateTime | Start date/time |
| end_time | DateTime | End date/time |
| is_free | Boolean | Whether the event is free |
| created_at | DateTime | Creation timestamp |

---

### `Ticket`
| Field | Type | Description |
|-------|------|-------------|
| id | Integer | Primary key |
| event_id | ForeignKey | Related event |
| type | String | Ticket type (VIP, Regular) |
| price | Float | Price of the ticket |
| quantity | Integer | Total available |
| sold | Integer | Tickets sold |

---

### `Booking`
| Field | Type | Description |
|-------|------|-------------|
| id | Integer | Primary key |
| user_id | ForeignKey | User who booked |
| event_id | ForeignKey | Event being booked |
| ticket_id | ForeignKey | Ticket type |
| attendee_name | String | Name on ticket |
| attendee_email | String | Email of attendee |
| status | String | Booking status |
| booking_time | DateTime | Booking timestamp |

---

##  Technologies Used

- Python 3
- Flask
- SQLAlchemy ORM
- SQLite (can be switched to PostgreSQL/MySQL)
- Flask-SQLAlchemy

---

##  Setup Instructions

1. **Clone the repo:**
   ```bash
   git clone https://github.com/yourusername/event-booking-api.git
   cd event-booking-api
