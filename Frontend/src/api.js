import axios from "axios";

const api = axios.create({
  baseURL: "https://career-comback-backend.onrender.com",
  withCredentials: true, // optional: only if using cookies
});

export default api;
