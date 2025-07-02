import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();

  const sections = [
    { label: 'User Management', path: '/admin/users' },
    { label: 'Event Management', path: '/admin/events' },
    { label: 'Ticket Management', path: '/admin/tickets' },
    { label: 'Booking Management', path: '/admin/bookings' },
  ];

  const handleLogout = () => {
    localStorage.clear(); // Clear stored user data
    navigate('/');        // Redirect to landing page
    window.location.reload(); // Refresh to reset state
  };

  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>
      
      <ul className="dashboard-list">
        {sections.map((section, index) => (
          <li key={index} onClick={() => navigate(section.path)}>
            {section.label}
          </li>
        ))}
      </ul>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default AdminDashboard;
