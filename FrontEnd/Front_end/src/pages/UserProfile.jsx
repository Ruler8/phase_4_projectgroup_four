import { useEffect, useState } from 'react';
import { getUserById } from '../api/auth'; // ✅ use the function you provided
import './UserProfile.css';

function UserProfile() {
  const [user, setUser] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserById(userId);
        setUser(data);
      } catch (error) {
        console.error('Failed to load user:', error);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  if (!user) return <div>Loading profile...</div>;

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>
      <div className="profile-card">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
    </div>
  );
}

export default UserProfile;
