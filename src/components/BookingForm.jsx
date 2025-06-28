import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockEvents } from "../data/events";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function BookingForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    price: "",
    date: ""
  });

  useEffect(() => {
    const selected = mockEvents.find((e) => e.id === id);
    setEvent(selected);
  }, [id]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Log form data
    console.log("Booking Submitted:", { eventId: id, ...formData });

    // ✅ Show Toast
    toast.success("🎉 Booking successful!", {
      position: "top-center",
      autoClose: 3000,
      theme: "colored"
    });

    // Reset form
    setFormData({ name: "", email: "", phone: "", price: "", date: "" });
  };

  const handleReturn = () => {
    navigate("/");
  };

  if (!event) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 15 }}
        className="max-w-xl mx-auto bg-white rounded shadow p-8 border-l-4 border-red-600"
      >
        <h2 className="text-2xl font-bold text-red-800 mb-2">
          Book: {event.title}
        </h2>
        <p className="text-sm mb-6 text-gray-600">
          {event.location} — {event.date}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="tel"
            name="phone"
            placeholder="0712345678"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            name="price"
            placeholder="Ticket Price"
            required
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="date"
            name="date"
            required
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
          >
            Submit Booking
          </motion.button>
        </form>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReturn}
          className="mt-6 text-sm text-red-700 underline hover:text-red-900"
        >
          ← Return to Events
        </motion.button>
      </motion.div>

      {/* ✅ Toast Container */}
      <ToastContainer />
    </div>
  );
}

export default BookingForm;
