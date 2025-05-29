import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:5000/', // Update with your backend URL
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Authentication API
const register = async (userData) => {
  try {
    console.log('Register request payload:', userData);
    const response = await api.post('/auth/register', userData);
    console.log('Register response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Register error:', error.response?.data || error.message);
    throw error.response.data;
  }
};

const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('userId', response.data.user_id);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Chat API
const generateResponse = async (promptData) => {
  try {
    console.log('Sending prompt data:', promptData);
    const response = await api.post('/chat/generate', promptData);
    console.log('Received response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in generateResponse:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error.response.data;
  }
};

const getChatHistory = async (userId) => {
  try {
    const response = await api.get('/chat/history', { params: { user_id: userId } });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const clearChatHistory = async (userId) => {
  try {
    const response = await api.delete('/chat/clear', { params: { user_id: userId } });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const rateMessage = async (ratingData) => {
  try {
    const response = await api.post('/chat/rate', ratingData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export default {
  register,
  login,
  generateResponse,
  getChatHistory,
  clearChatHistory,
  rateMessage
};