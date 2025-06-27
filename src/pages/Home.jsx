import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to Event Booking
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Book events, and manage tickets with a seamless experience.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/login"
            className="bg-white text-blue-600 font-semibold px-6 py-2 rounded hover:bg-gray-100"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-yellow-400 text-white font-semibold px-6 py-2 rounded hover:bg-yellow-500"
          >
            Register
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10">Why Use EventEase?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-gray-100 rounded shadow text-center">
            <h3 className="font-semibold text-xl mb-2">Easy Booking</h3>
            <p>Browse and book your favorite events in just a few clicks.</p>
          </div>
          <div className="p-6 bg-gray-100 rounded shadow text-center">
            <h3 className="font-semibold text-xl mb-2">Admin Control</h3>
            <p>Admins can manage events and track all bookings effortlessly.</p>
          </div>
          <div className="p-6 bg-gray-100 rounded shadow text-center">
            <h3 className="font-semibold text-xl mb-2">Secure Access</h3>
            <p>Login with secure authentication and manage your account.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-6">
        &copy; 2025 EventEase. All rights reserved.
      </footer>
    </div>
  );
}
