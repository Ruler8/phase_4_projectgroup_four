import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000', // Replace with your Flask server URL if deployed
});

// Register user
export const registerUser = async (userData) => {
  const response = await API.post('/register', userData);
  return response.data;
};
