import { useEffect, useState } from 'react';
import axios from 'axios';
import './TicketManagement.css';
import AdminNavbar from '../components/AdminNavbar';

const API = axios.create({
  baseURL: 'http://localhost:5000',
});

function AdminTicketManagement({ requesterId }) {
  const [tickets, setTickets] = useState([]);
  const [formData, setFormData] = useState({
    event_id: '',
    type: '',
    price: '',
    quantity: '',
  });
  const [editTicketId, setEditTicketId] = useState(null);

  const ticketTypes = ['Regular', 'VIP'];

  const fetchTickets = async () => {
    try {
      const res = await API.get('/tickets');
      setTickets(res.data);
    } catch (err) {
      alert('Failed to fetch tickets');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, user_id: requesterId };
      await API.post('/tickets', payload);
      fetchTickets();
      alert('Ticket created!');
      setFormData({ event_id: '', type: '', price: '', quantity: '' });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create ticket');
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this ticket?');
    if (!confirmDelete) return;
    try {
      await API.delete(`/tickets/${id}?requester_id=${requesterId}`);
      fetchTickets();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete ticket');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, user_id: requesterId };
      await API.patch(`/tickets/${editTicketId}?requester_id=${requesterId}`, payload);
      fetchTickets();
      alert('Ticket updated!');
      setFormData({ event_id: '', type: '', price: '', quantity: '' });
      setEditTicketId(null);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update ticket');
    }
  };

  const startEdit = (ticket) => {
    setFormData({
      event_id: ticket.event_id,
      type: ticket.type,
      price: ticket.price,
      quantity: ticket.quantity,
    });
    setEditTicketId(ticket.id);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <>
      <AdminNavbar />
      <div className="ticket-container">
        <h2 className="ticket-title">Admin Ticket Management</h2>

        <table className="ticket-table">
          <thead>
            <tr>
              <th>Event ID</th>
              <th>Type</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Sold</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.event_id}</td>
                  <td>{ticket.type}</td>
                  <td>${ticket.price}</td>
                  <td>{ticket.quantity}</td>
                  <td>{ticket.sold}</td>
                  <td>
                    <button onClick={() => startEdit(ticket)} className="btn-edit">Edit</button>
                    <button onClick={() => handleDelete(ticket.id)} className="btn-delete">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No tickets available</td>
              </tr>
            )}
          </tbody>
        </table>

        <form onSubmit={editTicketId ? handleUpdate : handleCreate} className="ticket-form">
          <input
            type="number"
            placeholder="Event ID"
            value={formData.event_id}
            required
            onChange={(e) => setFormData({ ...formData, event_id: e.target.value })}
          />

          <select
            value={formData.type}
            required
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="">-- Select Ticket Type --</option>
            {ticketTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Price"
            value={formData.price}
            required
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />

          <input
            type="number"
            placeholder="Quantity"
            value={formData.quantity}
            required
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          />

          <button type="submit" className="btn-submit">
            {editTicketId ? 'Update Ticket' : 'Create Ticket'}
          </button>
        </form>
      </div>
    </>
  );
}

export default AdminTicketManagement;
