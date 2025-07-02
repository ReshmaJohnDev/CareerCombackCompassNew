import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import { AppContext } from "../context/AppContext";

export default function GetStarted() {
  const { darkMode } = useContext(AppContext);
  return (
    <div className="flex flex-col min-h-screen">
      <div
        className={`p-4 flex flex-col items-center min-h-screen transition-colors duration-500 ${
          darkMode
            ? "bg-black text-gray-100"
            : "bg-light-gradient text-gray-900"
        }`}
      >
        <h2 className="text-2xl font-bold">Start Your Comeback Journey</h2>
        <p className="mt-2 text-gray-600">
          Track applications, plan actions, reflect on interviews, and more.
        </p>
        <div className="mt-6 space-x-4">
          <Link to="/login">
            <button className="bg-gray-600 text-white px-4 py-2 rounded">
              Login
            </button>
          </Link>
          <Link to="/register">
            <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
      <Footer darkMode={darkMode} />
    </div>
  );
}
