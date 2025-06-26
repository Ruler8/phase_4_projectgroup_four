import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <Router>
      <nav className="bg-gray-800 p-4 text-white">
        <ul className="flex gap-4">
          <li><Link to="/" className="hover:underline">Login</Link></li>
          <li><Link to="/register" className="hover:underline">Register</Link></li>
          <li><Link to="/dashboard" className="hover:underline">Dashboard</Link></li>
          <li><Link to="/admin" className="hover:underline">Admin</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}
