import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Navbar() {
  return (
    <motion.nav
      className="bg-red-800 text-white shadow p-4"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide">Eventify</h1>
        <div className="space-x-6 text-lg">
          <Link to="/events" className="hover:text-red-300">Events List</Link>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;
