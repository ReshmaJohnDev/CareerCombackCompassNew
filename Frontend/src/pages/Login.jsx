import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import { AppContext } from "../context/AppContext";

export default function Login() {
  const { setUsername, darkMode, loginError, setLoginError } =
    useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { access_token, name } = response.data;
      localStorage.setItem("token", access_token); // save token in browser
      localStorage.setItem("user_name", name);
      setUsername(name);
      navigate("/dashboard"); // redirect after login
    } catch (err) {
      console.log("test");
      setLoginError("Invalid email or password");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div
        className={`p-4 flex flex-col items-center justify-center min-h-screen transition-colors duration-500 ${
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
          <h3 className="text-2xl font-extrabold mb-6">
            Login to Your Account
          </h3>
          <form onSubmit={handleLogin} className="space-y-5">
            <label className="flex flex-col">
              <span>Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`input input-bordered w-full ${
                  darkMode
                    ? "bg-gray-700 text-gray-100 border-gray-600 placeholder-gray-400"
                    : "text-gray-900"
                }`}
                placeholder="mail@site.com"
              />
            </label>
            <label className="flex flex-col">
              <span>Password</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`input input-bordered w-full ${
                  darkMode
                    ? "bg-gray-700 text-gray-100 border-gray-600 placeholder-gray-400"
                    : "text-gray-900"
                }`}
                placeholder="Password"
              />
            </label>
            <button type="submit" className="btn btn-neutral w-full mt-4">
              Login
            </button>
            {loginError && (
              <p className="text-red-500 text-sm text-center">{loginError}</p>
            )}
            <p className="mt-4 text-sm text-center">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
