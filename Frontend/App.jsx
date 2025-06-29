import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import logo from './assets/logobooking.jpg';
import AdminLogin from './pages/AdminLogin';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import EventList from './components/EventList';
import BookingForm from './components/BookingForm';
import Contact from './pages/Contact';



import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function RoleRedirector() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "admin") navigate("/admin");
    else if (role === "user") navigate("/dashboard");
    else navigate("/login");
  }, []);

  return null;
}

export default function App() {
  return (
    <Router>
      <nav className="bg-gray-900 p-4 text-white shadow">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
          <span className="font-bold text-lg">Event Booking</span>
          <ul className="flex gap-6 text-sm">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "text-yellow-400 font-semibold" : "hover:text-yellow-400"
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? "text-yellow-400 font-semibold" : "hover:text-yellow-400"
                }
              >
                User Login
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin-login"
                className={({ isActive }) =>
                  isActive ? "text-yellow-400 font-semibold" : "hover:text-yellow-400"
                }
              >
                Admin Login
              </NavLink>
            </li>
            
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? "text-yellow-400 font-semibold" : "hover:text-yellow-400"
                }
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  isActive ? "text-yellow-400 font-semibold" : "hover:text-yellow-400"
                }
              >
                Admin
              </NavLink>
              </li>
              <li>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  isActive ? "text-yellow-400 font-semibold" : "hover:text-yellow-400"
                }
              >
               Contact us 
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/events/:id/book" element={<BookingForm />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/redirect" element={<RoleRedirector />} />
      </Routes>
    </Router>
  );
}
