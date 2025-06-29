import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const card = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function Home() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/events")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setEvents(data);
        console.log("✅ Events fetched:", data);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch events:", err);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Navbar />

      {/* Hero Section */}
      <header className="bg-gradient-to-r from-red-600 to-red-400 py-16 text-white shadow-lg">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow-md">Find & Book Your Next Experience</h1>
          <p className="text-lg max-w-xl mx-auto">Concerts, conferences, meetups, and more – all in one place. Reserve your spot now!</p>
        </div>
      </header>

      {/* Event List */}
      <main className="container mx-auto px-4 py-10 flex-grow">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Upcoming Events</h2>

        {events.length === 0 ? (
          <p className="text-center text-gray-600">No events available.</p>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {events.map((event) => (
              <motion.div
                key={event.id}
                variants={card}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition duration-300"
              >
                <div className="bg-gray-100 h-40 flex items-center justify-center text-gray-400 text-sm italic">
                  Event Image
                </div>

                <div className="p-6 flex flex-col justify-between h-[250px]">
                  <div>
                    <h3 className="text-xl font-semibold text-red-700">{event.name}</h3>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-3">{event.description}</p>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-4"
                  >
                    <Link
                      to={`/events/${event.id}/book`}
                      className="block w-full bg-red-600 hover:bg-red-700 text-white font-medium text-center py-2 px-4 rounded-lg transition duration-200"
                    >
                      Book Now
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center p-5 mt-12">
        <p>&copy; {new Date().getFullYear()} <span className="font-semibold text-red-400">Eventify</span>. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
