import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import FeaturesCarousel from "./FeaturesCarousel";

export default function Landing() {
  const { darkMode, features } = useContext(AppContext);

  const [showParagraph, setShowParagraph] = useState(false);
  useEffect(() => {
    if (window.location.hash === "#features") {
      const el = document.getElementById("features");
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 2000); // delay ensures it happens after render
      }
    }
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShowParagraph(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    const token = localStorage.getItem("token");
    navigate(token ? "/dashboard" : "/login");
  };

  const textColor = darkMode ? "text-white" : "text-black";

  return (
    <div className="min-h-screen text-white overflow-x-hidden bg-transparent">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-start px-6 sm:px-12 text-left overflow-hidden">
        <div className="absolute inset-0 animated-gradient opacity-70" />

        <div className="relative z-10 max-w-3xl w-full">
          <p className="text-lg sm:text-xl mb-2 text-orange-300 font-semibold fade-in">
            🧭 Your Career Comeback Starts Here
          </p>
          <h1 className="text-4xl lg:text-4xl font-bold leading-tight text-white animate-slideUpFade">
            Navigate Your{" "}
            <span className="shine bg-gradient-to-r from-blue-700 to-gray-700">
              Career Comeback Career Comeback
            </span>{" "}
            with Confidence
          </h1>
          {showParagraph && (
            <p className="text-l text-blue-100 leading-relaxed mb-8">
              A complete web application for professionals with career gaps.
              Build your story, plan your comeback, track applications, and get
              expert guidance - all in one place.
            </p>
          )}
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <button
              onClick={handleGetStarted}
              className="relative px-6 py-3 rounded-xl border-2 border-transparent bg-white/5 backdrop-blur-sm group overflow-hidden"
            >
              <span className="relative z-10 bg-gradient-to-r from-blue-300 to-blue-300 bg-clip-text text-transparent font-semibold transition duration-300 group-hover:text-white">
                Start Your Journey
              </span>
            </button>

            <Link
              to="/learn_more"
              className="relative px-6 py-3 rounded-xl border-2 border-transparent bg-white/5 backdrop-blur-sm group overflow-hidden"
            >
              <span className="relative z-10 bg-gradient-to-r from-blue-300 to-blue-300 bg-clip-text text-transparent font-semibold transition duration-300 group-hover:text-white">
                Watch Walkthrough
              </span>
            </Link>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section
        id="features"
        className="-mt-24 py-24 px-12 text-center relative bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: 'url("/Background.png")' }}
      >
        <h2 className="shine text-4xl lg:text-4xl font-bold leading-tight bg-gradient-to-r from-blue-700 to-gray-700 bg-clip-text text-transparent space-y-8">
          Complete Comeback Toolkit
        </h2>

        <FeaturesCarousel features={features} />
      </section>

      {/* CTA Section */}
      <section className="py-24 px-8 bg-gradient-to-r from-blue-400 to-gray-700 text-center">
        <h2 className="text-4xl font-bold mb-4 text-white">
          Ready to restart your career?
        </h2>
        <p className="mb-6 text-white text-lg">
          Join our supportive network and take your first confident step
          forward.
        </p>
        <button
          onClick={handleGetStarted}
          className="bg-white text-purple-700 font-bold py-3 px-6 rounded-lg shadow hover:bg-gray-100 transition"
        >
          Let’s Go
        </button>
      </section>

      {/* Fade-in animation */}
      <style>{`
        .fade-in {
          opacity: 0;
          animation: fadeIn 1s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
          @keyframes slideUpFade {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slideUpFade {
  animation: slideUpFade 0.8s ease-out forwards;
}
  @keyframes shine {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
.shine {
  background: linear-gradient(90deg, #60a5fa, #d1d5db, #60a5fa);
  background-size: 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shine 3s linear infinite;
}
          
      `}</style>
    </div>
  );
}
