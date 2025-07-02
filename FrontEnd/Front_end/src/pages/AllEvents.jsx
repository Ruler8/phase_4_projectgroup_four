import { useEffect, useState } from 'react';
import {
  getAllEvents,
  getAllTickets,
  createBooking,
  getBookingsByUser,
  deleteBooking,
} from '../api/auth';
import './AllEvents.css';
import { useNavigate } from 'react-router-dom';


function AllEvents() {
  const navigate = useNavigate();
  const userId = parseInt(localStorage.getItem('userId'));
  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState({}); // { eventId: ticketId }
  const [bookings, setBookings] = useState([]);

  const fetchData = async () => {
    try {
      const [eventRes, ticketRes, bookingRes] = await Promise.all([
        getAllEvents(),
        getAllTickets(),
        getBookingsByUser(userId, userId),
      ]);
      setEvents(eventRes);
      setTickets(ticketRes);
      setBookings(bookingRes);
    } catch (err) {
      console.error(err);
      alert('Failed to load events or tickets');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBook = async (eventId) => {
    const ticketId = selected[eventId];
    if (!ticketId) return alert('Please select a ticket');

    const attendee_name = prompt('Enter your name:');
    const attendee_email = prompt('Enter your email:');

    if (!attendee_name || !attendee_email) {
      alert('Name and email are required');
      return;
    }

    try {
      await createBooking({
        user_id: userId,
        event_id: eventId,
        ticket_id: ticketId,
        attendee_name,
        attendee_email,
      });
      alert('Booking successful!');
      fetchData(); // refresh booking state
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Booking failed');
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await deleteBooking(bookingId, userId);
      alert('Booking cancelled');
      fetchData(); // refresh bookings
    } catch (err) {
      console.error(err);
      alert('Failed to cancel booking');
    }
  };

  return (
    <div className="all-events-container">
      <h2 className="all-events-title">Available Events</h2>
      <button className="register-button" onClick={() => navigate('/user/home')}>
        Back
      </button>

      <table className="events-table">
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Description</th>
            <th>Location</th>
            <th>Start</th>
            <th>End</th>
            <th>Ticket Options</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => {
            const availableTickets = tickets.filter(
              (t) => t.event_id === event.id && t.sold < t.quantity
            );

            const userBooking = bookings.find((b) => b.event_id === event.id);

            return (
              <tr key={event.id}>
                <td>{event.name}</td>
                <td>{event.description}</td>
                <td>{event.location}</td>
                <td>{new Date(event.start_time).toLocaleString()}</td>
                <td>{new Date(event.end_time).toLocaleString()}</td>
                <td>
                  {userBooking ? (
                    <span>Booked: {userBooking.attendee_name}</span>
                  ) : availableTickets.length > 0 ? (
                    <select
                      value={selected[event.id] || ''}
                      onChange={(e) =>
                        setSelected({ ...selected, [event.id]: e.target.value })
                      }
                    >
                      <option value="">-- Select Ticket --</option>
                      {availableTickets.map((ticket) => (
                        <option key={ticket.id} value={ticket.id}>
                          {ticket.type} - ${ticket.price} ({ticket.quantity - ticket.sold} left)
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span>No tickets</span>
                  )}
                </td>
                <td>
                  {userBooking ? (
                    <button className="btn-cancel" onClick={() => handleCancel(userBooking.id)}>
                      Cancel
                    </button>
                  ) : (
                    <button
                      className="btn-book"
                      onClick={() => handleBook(event.id)}
                      disabled={!selected[event.id]}
                    >
                      Book
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default AllEvents;
