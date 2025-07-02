import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Login from './pages/Login';
import AdminUserManagement from './pages/AdminUserManagement';
import AdminEventManagement from './pages/AdminEventManagement';
import AdminTicketManagement from './pages/AdminTicketManagement';
import AdminBookingManagement from './pages/AdminBookingManagement';
import UserBookingManagement from './pages/UserBookingManagement';
import BookingForm from './pages/BookingForm';
import AdminDashboard from './pages/AdminDashboard';
import ViewEditUser from './pages/ViewEditUser';
import AllEvents from './pages/AllEvents';
import UserHome from './pages/UserHome';
import UserProfile from './pages/UserProfile';


function App() {
  const [requesterId, setRequesterId] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem('userId');
    const storedRole = localStorage.getItem('role');
    if (id && storedRole) {
      setRequesterId(parseInt(id));
      setRole(storedRole);
    }
    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Admin Routes */}
      <Route
        path="/admin/users"
        element={role === 'admin' ? <AdminUserManagement requesterId={requesterId} /> : <Navigate to="/" replace />}
      />
      <Route
        path="/admin/events"
        element={role === 'admin' ? <AdminEventManagement requesterId={requesterId} /> : <Navigate to="/" replace />}
      />
      <Route
        path="/admin/tickets"
        element={role === 'admin' ? <AdminTicketManagement requesterId={requesterId} /> : <Navigate to="/" replace />}
      />
      <Route
        path="/admin/bookings"
        element={role === 'admin' ? <AdminBookingManagement requesterId={requesterId} /> : <Navigate to="/" replace />}
      />
      <Route
        path="/admin/dashboard"
        element={role === 'admin' ? <AdminDashboard /> : <Navigate to="/" replace />}
      />
      <Route
        path="/admin/users/:userId"
        element={role === 'admin' ? <ViewEditUser /> : <Navigate to="/" replace />}
      />

      {/* Attendee/User Routes */}
      <Route
        path="/my-bookings"
        element={role === 'attendee' ? <UserBookingManagement requesterId={requesterId} /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/book"
        element={role === 'attendee' ? <BookingForm requesterId={requesterId} /> : <Navigate to="/login" replace />}
      />
      <Route
  path="/all-events"
  element={role === 'attendee' ? <AllEvents requesterId={requesterId} /> : <Navigate to="/login" replace />}
/>


      <Route path="/user/home" element={<UserHome />} />

      <Route
  path="/profile"
  element={
    role === 'attendee' ? <UserProfile /> : <Navigate to="/" replace />
  }
/>


    </Routes>
  );
}

export default App;
