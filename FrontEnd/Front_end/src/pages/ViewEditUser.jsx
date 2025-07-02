import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUserById, updateUser } from '../api/auth';
import AdminNavbar from '../components/AdminNavbar';
import './ViewEditUser.css';

function ViewEditUser() {
  const { userId } = useParams();
  const requesterId = parseInt(localStorage.getItem('userId'));
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  useEffect(() => {
    async function fetchUser() {
      const user = await getUserById(userId, requesterId);
      setFormData({ ...user, password: '' });
    }
    fetchUser();
  }, [userId, requesterId]);

  const handleUpdate = async () => {
    await updateUser(userId, formData, requesterId);
    alert('User updated successfully');
    navigate('/admin/users');
  };

  return (
    <>
      <AdminNavbar />
      <div className="view-edit-container">
        <h2>Edit User #{userId}</h2>
        <div className="form-fields">
          <input
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Name"
          />
          <input
            name="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Email"
          />
          <input
            name="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="Phone"
          />
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="New Password (optional)"
          />
        </div>
        <div className="buttons">
          <button onClick={handleUpdate} className="save-btn">Save</button>
          <button onClick={() => navigate('/admin/users')} className="cancel-btn">Go Back</button>
        </div>
      </div>
    </>
  );
}

export default ViewEditUser;
