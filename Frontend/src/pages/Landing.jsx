import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Landing({ darkMode, setDarkMode }) {
  const [showParagraph, setShowParagraph] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowParagraph(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

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
      {/* Navbar could be here if needed */}
      <div
        className="relative flex-grow bg-cover bg-center flex items-center justify-start min-h-[550px]"
        style={{
          backgroundImage: "url('/background.jpg')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-60"></div>

        {/* Content */}
        <div className="relative text-white max-w-3xl px-8 sm:px-12 md:px-16 lg:px-20 xl:px-24 text-left z-10 flex flex-col justify-center min-h-[550px]">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
            Welcome to Career Comeback
          </h1>
          {showParagraph && (
            <p className="mb-4 text-lg md:text-xl leading-relaxed max-w-xl fade-in drop-shadow-md">
              Your journey to reclaim confidence, sharpen skills, and relaunch
              your career starts here.
            </p>
          )}

          <div className="flex space-x-4">
            <button
              onClick={handleGetStarted}
              className="bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:ring-igray-500 focus:ring-opacity-50 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition transform hover:scale-105"
            >
              Get Started
            </button>
            <Link
              to="/learn_more"
              className="text-gray-300 hover:text-gray-400 font-semibold py-3 px-6 rounded-lg transition underline"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      <Footer />
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
