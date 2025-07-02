import { useNavigate } from 'react-router-dom';
import './UserHome.css';

function UserHome() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="user-home-container">
      <h1>Welcome, Attendee!</h1>
      <div className="user-home-buttons">
        <button onClick={() => navigate('/profile')}>View Profile</button>
        <button onClick={() => navigate('/all-events')}>Browse Events</button>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default UserHome;
