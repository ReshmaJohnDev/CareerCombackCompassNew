import axios from "axios";

const api = axios.create({
  baseURL: "https://your-backend-url.onrender.com",
  withCredentials: true, // optional: only if using cookies
});

export default api;
