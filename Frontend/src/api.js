import axios from "axios";

const api = axios.create({
  baseURL: "https://career-comback-backend.onrender.com",
});

// Automatically attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle unauthorized errors globally (e.g., token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear auth info
      localStorage.removeItem("token");
      localStorage.removeItem("user_name");
      // Optionally reload or redirect to login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
