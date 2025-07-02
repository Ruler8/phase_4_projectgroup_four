import { useState } from 'react';
import { loginUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import './Login.css';


function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData);
      localStorage.setItem('userId', response.user_id);
      localStorage.setItem('role', response.user.role);
      alert('Login successful!');
      navigate(response.user.role === 'admin' ? '/admin/dashboard' : '/user/home');
window.location.reload(); // Force reload so App sees updated localStorage

    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="page-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
        Don't have an account?{" "}

        <button
        
          type="button"
          onClick={() => navigate('/register')}
          className="secondary-btn"
        >
          Register
        </button>

      </form>
    </div>
  );
}

export default Login;
