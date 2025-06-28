import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function EventList() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/events")
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-900 min-h-screen px-6 py-10 text-white">
      <h2 className="text-3xl font-bold text-center text-red-500 mb-6">
        Browse All Events
      </h2>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-6">
        <input
          type="text"
          placeholder="Search events by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-400"
        />
      </div>

      {/* Go Back Button */}
      <div className="mb-6 text-center">
        <button
          onClick={() => navigate(-1)}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition"
        >
          ← Go Back
        </button>
      </div>

      {/* Event Table */}
      <div className="overflow-x-auto bg-gray-800 rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-red-600 text-white">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold uppercase">Title</th>
              <th className="text-left px-6 py-4 text-sm font-semibold uppercase">Location</th>
              <th className="text-left px-6 py-4 text-sm font-semibold uppercase">Date</th>
              <th className="text-left px-6 py-4 text-sm font-semibold uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <tr key={event.id} className="hover:bg-gray-700 transition">
                  <td className="px-6 py-4 font-medium text-white">{event.title}</td>
                  <td className="px-6 py-4 text-gray-300">{event.location}</td>
                  <td className="px-6 py-4 text-gray-300">{event.date}</td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/events/${event.id}`}
                      className="text-red-400 hover:underline font-medium"
                    >
                      View Details →
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-6 text-center text-gray-400">
                  No matching events found.
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
