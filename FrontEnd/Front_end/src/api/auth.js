import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000', // Change to production URL when needed
});

//
// Authentication
//
export const registerUser = async (userData) => {
  const res = await API.post('/register', userData);
  return res.data;
};

export const loginUser = async (userData) => {
  const res = await API.post('/login', userData);
  return res.data;
};

//
// User Management
//
export const getAllUsers = async (requesterId) => {
  const res = await API.get(`/users?requester_id=${requesterId}`);
  return res.data;
};

export const getUserById = async (userId, requesterId) => {
  const res = await API.get(`/users/${userId}`, {
    params: { requester_id: requesterId },
  });
  return res.data;
};

export const updateUser = async (userId, userData, requesterId) => {
  const res = await API.put(`/users/${userId}?requester_id=${requesterId}`, userData);
  return res.data;
};

export const deleteUser = async (userId, requesterId) => {
  const res = await API.delete(`/users/${userId}?requester_id=${requesterId}`);
  return res.data;
};

//
// Event Management
//
export const getAllEvents = async () => {
  const res = await API.get('/events');
  return res.data;
};

export const searchEventsByName = async (name) => {
  const res = await API.get(`/events/search?name=${name}`);
  return res.data;
};

export const createEvent = async (eventData) => {
  const res = await API.post('/events', eventData);
  return res.data;
};

export const deleteEvent = async (eventId, requesterId) => {
  const res = await API.delete(`/events/${eventId}`, {
    params: { requester_id: requesterId },
  });
  return res.data;
};

//
// Ticket Management
//
export const getAllTickets = async () => {
  const res = await API.get('/tickets');
  return res.data;
};

export const createTicket = async (ticketData) => {
  const res = await API.post('/tickets', ticketData);
  return res.data;
};

export const updateTicket = async (ticketId, ticketData, requesterId) => {
  const res = await API.patch(`/tickets/${ticketId}?requester_id=${requesterId}`, ticketData);
  return res.data;
};

export const deleteTicket = async (ticketId, requesterId) => {
  const res = await API.delete(`/tickets/${ticketId}?requester_id=${requesterId}`);
  return res.data;
};

//
// Booking
//
export const createBooking = async (bookingData) => {
  const res = await API.post('/book', bookingData);
  return res.data;
};

export const getBookingsByUser = async (userId, requesterId) => {
  const res = await API.get(`/bookings/user/${userId}`, {
    params: { requester_id: requesterId },
  });
  return res.data;
};

export const deleteBooking = async (bookingId, requesterId) => {
  const res = await API.delete(`/bookings/${bookingId}?requester_id=${requesterId}`);
  return res.data;
};


