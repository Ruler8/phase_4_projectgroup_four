import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from '../components/AdminNavbar';
import './AdminBookingManagement.css';


const API = axios.create({
  baseURL: 'http://localhost:5000',
});

function AdminBookingManagement({ requesterId }) {
  const [bookings, setBookings] = useState([]);

  const fetchAllBookings = async () => {
    try {
      const res = await API.get(`/bookings/all?requester_id=${requesterId}`);
      setBookings(res.data);
    } catch (err) {
      alert('Failed to fetch bookings');
    }
  };

  const handleDelete = async (bookingId) => {
    const confirm = window.confirm('Are you sure you want to delete this booking?');
    if (!confirm) return;

    try {
      await API.delete(`/bookings/${bookingId}?requester_id=${requesterId}`);
      fetchAllBookings();
      alert('Booking deleted successfully');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete booking');
    }
  };

  useEffect(() => {
    fetchAllBookings();
  }, []);

  return (
    <>
      <AdminNavbar />
      <div className="booking-container">
        <h2 className="booking-title">Admin Booking Management</h2>

        <table className="booking-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User ID</th>
              <th>Event ID</th>
              <th>Ticket ID</th>
              <th>Attendee Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Booking Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.user_id}</td>
                  <td>{b.event_id}</td>
                  <td>{b.ticket_id}</td>
                  <td>{b.attendee_name}</td>
                  <td>{b.attendee_email}</td>
                  <td>{b.status}</td>
                  <td>{new Date(b.booking_time).toLocaleString()}</td>
                  <td>
                    <button onClick={() => handleDelete(b.id)} className="delete-btn">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-bookings">No bookings found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AdminBookingManagement;
