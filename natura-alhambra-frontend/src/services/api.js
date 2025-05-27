import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  // ❌ No ponemos 'Content-Type' aquí, axios lo maneja automáticamente
});

// Interceptor para añadir el token en cada solicitud
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem("token");
      window.location.href = "/login"; // Redirigir al login
    }

    return Promise.reject(error);
  }
);

export default api;
