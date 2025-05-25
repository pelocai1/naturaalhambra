import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
  // ❌ No ponemos 'Content-Type' aquí, axios lo maneja automáticamente
});

// Interceptor para añadir el token en cada solicitud
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
