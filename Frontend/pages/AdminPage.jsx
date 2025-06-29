import { useEffect, useState } from "react";

export default function AdminPanel() {
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    location: "",
    capacity: "",
  });

  useEffect(() => {
    // Dummy Data
    setEvents([
      {
        id: 1,
        name: "React Conference 2025",
        date: "2025-07-15",
        location: "Nairobi",
        capacity: 300,
      },
      {
        id: 2,
        name: "AI Summit Africa",
        date: "2025-08-03",
        location: "Kigali",
        capacity: 500,
      },
    ]);

    setBookings([
      {
        id: 101,
        user: "elvis@event.com",
        event: "React Conference 2025",
        ticket: "Standard Pass",
      },
      {
        id: 102,
        user: "ian@event.com",
        event: "AI Summit Africa",
        ticket: "VIP Pass",
      },
    ]);
  }, []);

  const resetForm = () => {
    setFormData({ name: "", date: "", location: "", capacity: "" });
    setEditingEvent(null);
    setShowForm(false);
  };

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    if (editingEvent) {
      // Update existing event
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === editingEvent.id ? { ...editingEvent, ...formData } : ev
        )
      );
    } else {
      // Add new event
      const newEvent = {
        id: Date.now(),
        ...formData,
        capacity: parseInt(formData.capacity),
      };
      setEvents((prev) => [...prev, newEvent]);
    }
    resetForm();
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this event?")) {
      setEvents((prev) => prev.filter((ev) => ev.id !== id));
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      date: event.date,
      location: event.location,
      capacity: event.capacity,
    });
    setShowForm(true);
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-bold mb-6">Admin Panel 🛠️</h2>

      {/* Event Manager Header */}
      <div className="mb-8 flex justify-between items-center">
        <h3 className="text-2xl font-semibold">Manage Events</h3>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => {
            setShowForm(true);
            setEditingEvent(null);
            setFormData({ name: "", date: "", location: "", capacity: "" });
          }}
        >
          + Add Event
        </button>
      </div>

      {/* Form Section */}
      {showForm && (
        <form
          onSubmit={handleAddOrUpdate}
          className="bg-white p-6 rounded shadow mb-10 space-y-4"
        >
          <h4 className="text-xl font-semibold">
            {editingEvent ? "Edit Event" : "Add New Event"}
          </h4>
          <input
            type="text"
            placeholder="Event Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="number"
            placeholder="Capacity"
            value={formData.capacity}
            onChange={(e) =>
              setFormData({ ...formData, capacity: e.target.value })
            }
            className="w-full border p-2 rounded"
            required
          />
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {editingEvent ? "Update" : "Add"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Events Table */}
      <div className="bg-white rounded shadow p-6 mb-10">
        {events.length === 0 ? (
          <p>No events created yet.</p>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Event</th>
                <th className="p-3">Date</th>
                <th className="p-3">Location</th>
                <th className="p-3">Capacity</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-t">
                  <td className="p-3">{event.name}</td>
                  <td className="p-3">{event.date}</td>
                  <td className="p-3">{event.location}</td>
                  <td className="p-3">{event.capacity}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => handleEdit(event)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Booking Summary */}
      <h3 className="text-2xl font-semibold mb-4">Recent Bookings</h3>
      <div className="bg-white rounded shadow p-6">
        {bookings.length === 0 ? (
          <p>No bookings available.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <li key={booking.id} className="py-4 flex justify-between">
                <div>
                  <p className="font-medium">{booking.user}</p>
                  <p className="text-sm text-gray-600">{booking.event}</p>
                </div>
                <span className="bg-indigo-600 text-white text-sm px-3 py-1 rounded">
                  {booking.ticket}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
