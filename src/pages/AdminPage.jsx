import { useEffect, useState } from "react";

const mockEvents = [
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
];

const mockBookings = [
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
];

export default function AdminPanel() {
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    setEvents(mockEvents);
    setBookings(mockBookings);
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-bold mb-6">Admin Panel 🛠️</h2>

      <div className="mb-8 flex justify-between items-center">
        <h3 className="text-2xl font-semibold">Manage Events</h3>
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          + Add Event
        </button>
      </div>

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
                    <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                      Edit
                    </button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

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
