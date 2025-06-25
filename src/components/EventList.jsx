import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function EventList() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/events") // Replace with your actual API
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  return (
    <div className="bg-yellow-50 min-h-screen p-6">
      <h2 className="text-3xl font-bold mb-6 text-yellow-900">All Events</h2>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full table-auto">
          <thead className="bg-yellow-400 text-yellow-900">
            <tr>
              <th className="text-left p-4">Title</th>
              <th className="text-left p-4">Location</th>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-b hover:bg-yellow-100">
                <td className="p-4 font-medium">{event.title}</td>
                <td className="p-4">{event.location}</td>
                <td className="p-4">{event.date}</td>
                <td className="p-4">
                  <Link
                    to={`/events/${event.id}`}
                    className="text-yellow-800 hover:underline"
                  >
                    View Details →
                  </Link>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td className="p-4" colSpan="4">
                  No events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EventList;
