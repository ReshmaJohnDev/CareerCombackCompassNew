import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { AppContext } from "../context/AppContext";

export default function Register() {
  const { darkMode } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/register", formData);
      setSuccess(response.data.message || "Registration successful");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
      setSuccess("");
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen transition-colors duration-500 ${
        darkMode
          ? "bg-black text-gray-100"
          : "bg-gradient-to-r from-blue-400 to-gray-700 text-gray-100"
      }`}
    >
      <div
        className={`w-full max-w-xl p-8 rounded-xl shadow-md transition-colors duration-500 ${
          darkMode
            ? "bg-gray-800 text-gray-100"
            : "bg-white/20 backdrop-blur-md text-gray-900"
        }`}
      >
        <h3 className="text-2xl font-extrabold mb-6 text-center">
          Create an Account
        </h3>
        <form onSubmit={handleRegister} className="space-y-5">
          <label className="flex flex-col">
            <span>Email</span>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Email"
            />
          </label>
          <label className="flex flex-col">
            <span>Username</span>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Username"
            />
          </label>
          <label className="flex flex-col">
            <span>Password</span>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Password"
            />
          </label>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button className="btn btn-neutral w-full mt-4">Register</button>

          <p className="mt-4 text-sm text-center">
            Already have an account?{" "}
            <a href="/login" className="text-blue-200 hover:underline">
              Login
            </a>
          </p>

          {success && (
            <p className="text-green-500 text-sm text-center mt-2">{success}</p>
          )}
        </form>
      </div>
    </div>
  );
}
