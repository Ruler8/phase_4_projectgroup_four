import React, { useEffect, useState } from "react";

function EventList() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("❌ Error fetching events:", err));
  }, []);

  if (events.length === 0) {
    return <p className="p-10 text-center">No events found.</p>;
  }

  return (
    <div className="p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {events.map((event) => (
        <div key={event.id} className="bg-white rounded-lg shadow-lg p-5 border border-gray-200">
          <h2 className="text-xl font-bold text-red-600">{event.name}</h2>
          <p className="text-gray-600 mt-2">{event.description}</p>
          <p className="text-sm mt-1 text-gray-500">
            Location: {event.location} | Date: {new Date(event.date).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}

export default EventList;
