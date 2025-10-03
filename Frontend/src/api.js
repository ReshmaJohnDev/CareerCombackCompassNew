import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;
const api = axios.create({
  baseURL: apiUrl,
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
      //  FIX: Check if the current request is for the login endpoint
      const isLoginAttempt = error.config.url.endsWith("/auth/login");

      if (!isLoginAttempt) {
        // This is a global failure (e.g., token expired on a dashboard page)
        localStorage.removeItem("token");
        localStorage.removeItem("user_name");

        //  ONLY REDIRECT when the 401 is NOT from the login attempt
        window.location.href = "/login";
      }
    }

    // This ensures ALL errors (including the 401 from login) reach the component's catch block
    return Promise.reject(error);
  }
);
export default api;
