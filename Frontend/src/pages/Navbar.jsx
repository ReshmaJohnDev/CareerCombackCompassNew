import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { AppContext } from "../context/AppContext";

export default function Navbar() {
  const { username, setUsername, darkMode, setDarkMode } =
    useContext(AppContext);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_name");
    setUsername(null);
    setShowMenu(false);
    navigate("/");
  };

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        backgroundColor: darkMode
          ? "rgba(18, 18, 18, 0.8)"
          : "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: darkMode
          ? "1px solid rgba(255, 255, 255, 0.1)"
          : "1px solid rgba(0, 0, 0, 0.05)",
        color: darkMode ? "#f0f0f0" : "#222222",
        transition:
          "background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease",
      }}
    >
      <div
        className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center"
        style={{ color: darkMode ? "#f0f0f0" : "#222222" }}
      >
        <nav className="flex space-x-8 font-semibold text-lg">
          <Link
            to="/"
            className={`hover:text-gray-300 transition-colors duration-300 ${
              darkMode ? "text-gray-200" : "text-gray-800"
            }`}
          >
            <span className="text-xl font-bold bg-gradient-to-br from-blue-600 to-gray-400  bg-clip-text text-transparent">
              Career Comeback Compass
            </span>
          </Link>
        </nav>

        <div className="flex items-center space-x-6">
          <Link
            to="/services#features"
            onClick={(e) => {
              e.preventDefault();
              const featuresSection = document.getElementById("features");
              if (featuresSection) {
                featuresSection.scrollIntoView({ behavior: "smooth" });
              } else {
                // Navigate to landing page with anchor
                window.location.href = "/#features";
              }
            }}
            className={`font-semibold hover:text-gray-300 transition-colors duration-300 ${
              darkMode ? "text-gray-200" : "text-gray-800"
            }`}
          >
            Services
          </Link>
          <Link
            to="/dashboard"
            className={`font-semibold hover:text-gray-300 transition-colors duration-300 ${
              darkMode ? "text-gray-200" : "text-gray-800"
            }`}
          >
            Dashboard
          </Link>
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* User Menu */}
          <div className="relative">
            {!username ? (
              <Link
                to="/login"
                className={`font-semibold hover:text-gray-300 transition-colors duration-300 ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Login
              </Link>
            ) : (
              <>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className={`font-semibold flex items-center space-x-1 focus:outline-none ${
                    darkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  <span>{username}</span>
                  <span className="transform transition-transform duration-200">
                    ▼
                  </span>
                </button>

                {showMenu && (
                  <div
                    className={`absolute right-0 mt-2 w-36 rounded-lg shadow-lg z-20 ${
                      darkMode
                        ? "bg-gray-800 text-gray-200"
                        : "bg-white text-gray-900"
                    }`}
                  >
                    <button
                      onClick={handleLogout}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200 rounded-b-lg ${
                        darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                      }`}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
