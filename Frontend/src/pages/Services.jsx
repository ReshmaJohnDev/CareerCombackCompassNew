import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import { AppContext } from "../context/AppContext";

export default function Services() {
  const { darkMode } = useContext(AppContext);
  const features = [
    {
      title: "Gap Story Builder",
      description: "Craft a compelling narrative of your career gap.",
      path: "/gap-story",
      img: "/career_gap.png",
    },
    {
      title: "Action Planner",
      description: "Set goals, track progress, and receive reminders.",
      path: "/planner",
      img: "/action_plan.png",
    },
    {
      title: "Job Application Tracker",
      description: "Track jobs, statuses, and follow-ups easily.",
      path: "/job-tracker",
      img: "/job_tracker.png",
    },
    {
      title: "Career Advice Chatbot",
      description: "Get career advice and prep support in real time.",
      path: "/chatbot",
      img: "/chatbot.png",
    },
    {
      title: "Career Returnee Resources",
      description: "Browse events, returnships, and curated links.",
      path: "/resources",
      img: "/resources.png",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <div
        className="min-h-screen p-6 text-white"
        style={{
          background: "linear-gradient(to bottom right, #444343,#dddddd",
          color: "#222", // optional: improves contrast
        }}
      >
        <h1 className="text-3xl font-bold text-center mb-8">Our Services</h1>

        <div className="carousel w-full max-w-6xl mx-auto">
          {features.map((feature, idx) => {
            const prev = (idx - 1 + features.length) % features.length;
            const next = (idx + 1) % features.length;
            return (
              <div
                key={idx}
                id={`slide${idx}`}
                className="carousel-item relative w-full"
              >
                {/* Image with overlay */}
                <Link to={feature.path}>
                  <div className="relative w-full flex">
                    <img
                      src={feature.img}
                      alt={feature.title}
                      className="w-1/2 h-96 object-cover"
                    />
                    <div
                      className="w-1/2 flex flex-col justify-center p-6 text-black 
    bg-opacity-90 shadow-lg
    animate-slideFadeIn
    border border-gray-300 dark:border-gray-600
    transition-transform duration-300 ease-in-out
    hover:scale-105 hover:brightness-110"
                      style={{
                        background: darkMode
                          ? "linear-gradient(to top right, #222222, #444444)"
                          : "linear-gradient(to top right, #dddddd, #444343)",
                        color: darkMode ? "#f0f0f0" : "#222222",
                      }}
                    >
                      <h2
                        className="text-3xl font-extrabold mb-2 bg-clip-text 
      bg-gradient-to-r from-gray-700 via-gray-500 to-gray-900
      drop-shadow-md"
                      >
                        {feature.title}
                      </h2>
                      <p className="text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    <style>
                      {`
@keyframes slideFadeIn {
  0% {
    opacity: 0;
    transform: translateX(40px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
.animate-slideFadeIn {
  animation: slideFadeIn 0.8s ease forwards;
}
`}
                    </style>
                  </div>
                </Link>

                {/* Navigation Arrows */}
                <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                  <button
                    onClick={() =>
                      document.getElementById(`slide${prev}`)?.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest",
                      })
                    }
                    className="btn btn-circle"
                  >
                    ❮
                  </button>
                  <button
                    onClick={() =>
                      document.getElementById(`slide${next}`)?.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest",
                      })
                    }
                    className="btn btn-circle"
                  >
                    ❯
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer darkMode={darkMode} />
    </div>
  );
}
