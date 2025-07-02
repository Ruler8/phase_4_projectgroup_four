import { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminEventManagement.css'; 
import AdminNavbar from '../components/AdminNavbar';

const API = axios.create({
  baseURL: 'http://localhost:5000',
});

function AdminEventManagement({ requesterId }) {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    category: '',
    start_time: '',
    end_time: '',
    is_free: false,
  });
  const [editingEventId, setEditingEventId] = useState(null);

  const formatDateTime = (input) => {
    const date = new Date(input);
    const pad = (n) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
      `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  const fetchEvents = async () => {
    try {
      const res = await API.get('/events');
      setEvents(res.data);
    } catch (err) {
      alert('Failed to fetch events');
    }
  };

  const searchEvents = async () => {
    try {
      const res = await API.get(`/events/search?name=${searchTerm}`);
      setEvents(res.data);
    } catch (err) {
      alert('Search failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await API.delete(`/events/${id}?requester_id=${requesterId}`);
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete event');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        user_id: requesterId,
        start_time: formatDateTime(formData.start_time),
        end_time: formatDateTime(formData.end_time),
      };
      await API.post('/events', payload);
      fetchEvents();
      alert('Event created!');
      resetForm();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create event');
    }
  };

  const handleEdit = (event) => {
    setEditingEventId(event.id);
    setFormData({
      name: event.name,
      description: event.description,
      location: event.location,
      category: event.category,
      start_time: event.start_time,
      end_time: event.end_time,
      is_free: event.is_free,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        start_time: formatDateTime(formData.start_time),
        end_time: formatDateTime(formData.end_time),
      };
      await API.put(`/events/${editingEventId}?requester_id=${requesterId}`, payload);
      fetchEvents();
      alert('Event updated!');
      resetForm();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update event');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      location: '',
      category: '',
      start_time: '',
      end_time: '',
      is_free: false,
    });
    setEditingEventId(null);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div>
      <AdminNavbar />
      <div className="container">
        <h2>Admin Event Management</h2>

        <div className="search-section">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={searchEvents}>Search</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Start</th>
              <th>End</th>
              <th>Free?</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.length > 0 ? (
              events.map((event) => (
                <tr key={event.id}>
                  <td>{event.name}</td>
                  <td>{event.location}</td>
                  <td>{new Date(event.start_time).toLocaleString()}</td>
                  <td>{new Date(event.end_time).toLocaleString()}</td>
                  <td>{event.is_free ? 'Yes' : 'No'}</td>
                  <td>
                    <button className="edit" onClick={() => handleEdit(event)}>Edit</button>
                    <button className="delete" onClick={() => handleDelete(event.id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6">No events found</td></tr>
            )}
          </tbody>
        </table>

        <form onSubmit={editingEventId ? handleUpdate : handleCreate}>
          <input
            placeholder="Name"
            value={formData.name}
            required
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            placeholder="Description"
            value={formData.description}
            required
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <input
            placeholder="Location"
            value={formData.location}
            required
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
          <select
            value={formData.category}
            required
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="">-- Select Category --</option>
            <option value="Workshop">Workshop</option>
            <option value="Seminar">Seminar</option>
            <option value="Concert">Concert</option>
            <option value="Conference">Conference</option>
            <option value="Meetup">Meetup</option>
          </select>
          <input
            type="datetime-local"
            value={formData.start_time}
            required
            onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
          />
          <input
            type="datetime-local"
            value={formData.end_time}
            required
            onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
          />
          <div className="checkbox-group">
            <input
              type="checkbox"
              checked={formData.is_free}
              onChange={(e) => setFormData({ ...formData, is_free: e.target.checked })}
            />{' '}
            Is Free?
          </div>
          <div className="button-group">
            <button type="submit" className="submit">
              {editingEventId ? 'Update Event' : 'Create Event'}
            </button>
            {editingEventId && (
              <button type="button" className="cancel" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminEventManagement;
