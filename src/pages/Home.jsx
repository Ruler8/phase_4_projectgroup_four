import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { mockEvents } from "../data/events";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const card = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1 },
};

function Home() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    setEvents(mockEvents);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Navbar />

      <header className="bg-red-100 py-10 shadow-inner">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-2 text-red-800">Discover Events Near You</h2>
          <p className="text-lg">From music festivals to tech conferences – book your spot now.</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-grow">
        <h3 className="text-2xl font-bold text-red-800 mb-6">All Events</h3>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        >
          {events.map((event) => (
            <motion.div
              key={event.id}
              variants={card}
              className="bg-teal-100 rounded-lg shadow-md border-t-4 border-red-600 p-4 flex flex-col justify-between h-60"
            >
              <div>
                <h4 className="text-lg font-semibold text-red-800">{event.title}</h4>
                <p className="mt-1 text-sm text-gray-700 line-clamp-3">
                  {event.description}
                </p>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={`/events/${event.id}/book`}
                  className="block mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm rounded shadow text-center"
                >
                  Book Now
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </main>

      <footer className="bg-red-800 text-white text-center p-4 mt-10">
        &copy; {new Date().getFullYear()} Eventify. Crafted with ❤️
      </footer>
    </div>
  );
}

export default Home;
