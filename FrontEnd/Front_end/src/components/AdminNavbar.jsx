import { Link, useLocation } from 'react-router-dom';
import './AdminNavbar.css';

function AdminNavbar() {
  const { pathname } = useLocation();

  return (
    <nav className="admin-navbar">
      <ul>
        <li className={pathname.includes('users') ? 'active' : ''}>
          <Link to="/admin/users">Users</Link>
        </li>
        <li className={pathname.includes('events') ? 'active' : ''}>
          <Link to="/admin/events">Events</Link>
        </li>
        <li className={pathname.includes('tickets') ? 'active' : ''}>
          <Link to="/admin/tickets">Tickets</Link>
        </li>
        <li className={pathname.includes('bookings') ? 'active' : ''}>
          <Link to="/admin/bookings">Bookings</Link>
        </li>
        <li className={pathname.includes('dashboard') ? 'active' : ''}>
          <Link to="/admin/dashboard">Home</Link>
        </li>
      </ul>
    </nav>
  );
}

export default AdminNavbar;
