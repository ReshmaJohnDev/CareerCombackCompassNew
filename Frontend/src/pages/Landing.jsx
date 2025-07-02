import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { AppContext } from "../context/AppContext";

export default function Landing() {
  const { darkMode } = useContext(AppContext);
  const [showParagraph, setShowParagraph] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowParagraph(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // No need to toggle .dark here, your App.jsx handles that globally

  const handleGetStarted = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/services");
    } else {
      navigate("/get_started");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div
        className="relative flex-grow bg-cover bg-center flex items-center justify-start min-h-[550px]"
        style={{
          backgroundImage: darkMode
            ? "url('/background-dark.jpg')"
            : "url('/background-light.jpg')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-60 dark:bg-gray-800 dark:opacity-70"></div>

        {/* Content */}
        <div className="relative max-w-3xl px-8 sm:px-12 md:px-16 lg:px-20 xl:px-24 text-left z-10 flex flex-col justify-center min-h-[550px] text-white">
          <h1
            className={`text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg ${
              darkMode ? "text-gray-100" : "text-black"
            }`}
          >
            Welcome to Career Comeback
          </h1>
          {showParagraph && (
            <p
              className="mb-4 text-lg md:text-xl leading-relaxed max-w-xl fade-in drop-shadow-md
                          text-gray-800 dark:text-gray-300
"
            >
              Your journey to reclaim confidence, sharpen skills, and relaunch
              your career starts here.
            </p>
          )}

          <div className="flex space-x-4">
            <button
              onClick={handleGetStarted}
              className={`font-semibold py-3 px-8 rounded-lg shadow-lg transition transform hover:scale-105 ${
                darkMode
                  ? "bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 text-black"
                  : "bg-gradient-to-r from-gray-700 via-gray-900 to-black text-white"
              }`}
            >
              Get Started
            </button>

            <Link
              to="/learn_more"
              className="text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-lg transition underline hover:text-gray-900 dark:hover:text-white"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      <Footer darkMode={darkMode} />

      <style>{`
        .fade-in {
          opacity: 0;
          animation: fadeIn 0.8s forwards ease-in-out;
        }
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
