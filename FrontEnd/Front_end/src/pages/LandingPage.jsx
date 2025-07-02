// src/pages/LandingPage.jsx
import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css'; // Optional CSS for styling

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <h1>Welcome to Eventify</h1>
      <div className="links-container">
        <Link to="/login" state={{ role: 'admin' }} className="role-link">
          Continue as Admin
        </Link>
        <Link to="/login" state={{ role: 'attendee' }} className="role-link">
          Continue as User
        </Link>
      </div>
      <button className="register-button" onClick={() => navigate('/register')}>
        Register
      </button>
    </div>
  );
}
