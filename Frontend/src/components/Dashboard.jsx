import { useEffect, useState } from "react";

const mockBookings = [
  {
    id: 1,
    event: "React Conference 2025",
    date: "2025-07-15",
    location: "Nairobi, Kenya",
    ticket: "Standard Pass",
  },
  {
    id: 2,
    event: "AI Summit Africa",
    date: "2025-08-03",
    location: "Kigali, Rwanda",
    ticket: "VIP Pass",
  },
];

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Simulate fetch
    setTimeout(() => setBookings(mockBookings), 500);
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-bold mb-6">Welcome back</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-100 p-6 rounded shadow">
          <h3 className="text-xl font-semibold">Total Bookings</h3>
          <p className="text-4xl font-bold text-blue-700 mt-2">{bookings.length}</p>
        </div>
        <div className="bg-green-100 p-6 rounded shadow md:col-span-2">
          <h3 className="text-xl font-semibold">Next Event</h3>
          <p className="text-lg mt-2">
            {bookings.length > 0
              ? `${bookings[0].event} — ${bookings[0].date}`
              : "No upcoming events"}
          </p>
        </div>
      </div>

      <div className="bg-white rounded shadow p-6">
        <h3 className="text-2xl font-semibold mb-4">My Bookings</h3>

        {bookings.length === 0 ? (
          <p className="text-gray-600">You have no bookings yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <li key={booking.id} className="py-4">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-bold">{booking.event}</h4>
                    <p className="text-sm text-gray-600">
                      {booking.date} • {booking.location}
                    </p>
                  </div>
                  <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded">
                    {booking.ticket}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
