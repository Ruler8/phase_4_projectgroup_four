import { useEffect, useState } from 'react'; 
import { createBooking } from '../api/auth';
import axios from 'axios';
import './BookingForm.css'; // <-- Import the CSS file

const API = axios.create({ baseURL: 'http://localhost:5000' });

function BookingForm({ requesterId }) {
  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [formData, setFormData] = useState({
    event_id: '',
    ticket_id: '',
    attendee_name: '',
    attendee_email: '',
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await API.get('/events');
        setEvents(res.data);
      } catch (err) {
        alert('Failed to fetch events.');
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!formData.event_id) return;
      try {
        const res = await API.get(`/tickets/event/${formData.event_id}`);
        setTickets(res.data);
      } catch (err) {
        alert('Failed to fetch tickets.');
      }
    };
    fetchTickets();
  }, [formData.event_id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        user_id: requesterId,
      };
      await createBooking(payload);
      alert('Booking successful!');
      setFormData({
        event_id: '',
        ticket_id: '',
        attendee_name: '',
        attendee_email: '',
      });
      setTickets([]);
    } catch (err) {
      alert(err.response?.data?.error || 'Booking failed');
    }
  };

  return (
    <div className="booking-container">
      <h2 className="booking-title">Book a Ticket</h2>

      <form onSubmit={handleSubmit} className="booking-form">
        <select
          name="event_id"
          value={formData.event_id}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Event --</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.name}
            </option>
          ))}
        </select>

        <select
          name="ticket_id"
          value={formData.ticket_id}
          onChange={handleChange}
          required
          disabled={!tickets.length}
        >
          <option value="">-- Select Ticket --</option>
          {tickets.map((ticket) => (
            <option key={ticket.id} value={ticket.id}>
              {ticket.type} (${ticket.price}) - Available: {ticket.quantity - ticket.sold}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="attendee_name"
          value={formData.attendee_name}
          onChange={handleChange}
          placeholder="Your Full Name"
          required
        />

        <input
          type="email"
          name="attendee_email"
          value={formData.attendee_email}
          onChange={handleChange}
          placeholder="Your Email"
          required
        />

        <button type="submit">Book Ticket</button>
      </form>
    </div>
  );
}

export default BookingForm;
