import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Navbar() {
  return (
    <motion.nav
      className="bg-red-600 text-white shadow-md py-4"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo / Brand */}
        <Link to="/" className="text-2xl font-bold tracking-wide hover:text-red-300 transition">
          Eventify
        </Link>

        {/* Nav Links */}
        <div className="space-x-6 text-lg">
          <Link to="/events" className="hover:text-red-300 transition">
            Events List
          </Link>
          <Link to="/contact" className="hover:text-red-300 transition">
            Contact
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;
