import { useEffect, useState } from 'react';
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000',
});

function UserBookingManagement({ requesterId }) {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await API.get(`/bookings/user/${requesterId}?requester_id=${requesterId}`);
      setBookings(res.data);
    } catch (err) {
      alert('Failed to load bookings.');
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this booking?');
    if (!confirm) return;
    try {
      await API.delete(`/bookings/${id}?requester_id=${requesterId}`);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete booking');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">My Bookings</h2>

      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Event ID</th>
            <th className="border p-2">Ticket ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Booking Time</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length > 0 ? (
            bookings.map((b) => (
              <tr key={b.id}>
                <td className="border p-2">{b.event_id}</td>
                <td className="border p-2">{b.ticket_id}</td>
                <td className="border p-2">{b.attendee_name}</td>
                <td className="border p-2">{b.attendee_email}</td>
                <td className="border p-2">{b.status}</td>
                <td className="border p-2">{new Date(b.booking_time).toLocaleString()}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="bg-red-600 text-white px-3 py-1"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center p-4">No bookings found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserBookingManagement;
