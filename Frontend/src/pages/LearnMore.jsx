import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { AppContext } from "../context/AppContext";

export default function LearnMore() {
  const { darkMode } = useContext(AppContext);
  const navigate = useNavigate();
  const [visible, setVisible] = useState({
    intro: false,
    offers: false,
    howItWorks: false,
    buttons: false,
  });

  const handleGetStarted = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/services");
    } else {
      navigate("/get_started");
    }
  };

  useEffect(() => {
    const timers = [
      setTimeout(() => setVisible((v) => ({ ...v, intro: true })), 300),
      setTimeout(() => setVisible((v) => ({ ...v, offers: true })), 900),
      setTimeout(() => setVisible((v) => ({ ...v, howItWorks: true })), 1500),
      setTimeout(() => setVisible((v) => ({ ...v, buttons: true })), 2000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const sectionBaseClass =
    "max-w-3xl mb-12 transition-all duration-700 ease-in-out transform";

  return (
    <div
      className={`min-h-screen p-6 ${
        darkMode ? "bg-black text-gray-100" : "bg-light-gradient text-gray-900"
      }`}
    >
      <div className="flex-grow max-w-4xl mx-auto px-8 sm:px-12 md:px-16 lg:px-20 xl:px-24 py-16">
        <h1
          className={`text-5xl md:text-6xl font-extrabold mb-8 drop-shadow-lg transform transition-opacity duration-700 ${
            visible.intro
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          Learn More About Career Comeback
        </h1>

        {/* Intro Section */}
        <section
          className={`${sectionBaseClass} ${
            visible.intro
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-10"
          }`}
        >
          <h2 className="text-3xl font-semibold mb-4">
            My Story: Why I Built This App
          </h2>
          <p className="text-lg md:text-xl leading-relaxed drop-shadow-md">
            Like many, I faced a significant career gap that made it challenging
            to stay focused and motivated. Keeping track of goals, progress, and
            daily tasks felt overwhelming. I struggled with regaining confidence
            and organizing my efforts to get back on track.
          </p>
          <p className="mt-4 text-lg md:text-xl leading-relaxed drop-shadow-md">
            That’s why I created <strong>Career Comeback</strong> — a personal
            project born from my journey. This app is designed to help others
            like me who want to reclaim their career path, sharpen their skills,
            and stay motivated every step of the way.
          </p>
        </section>

        {/* What Career Comeback Offers */}
        <section
          className={`${sectionBaseClass} ${
            visible.offers
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-10"
          }`}
        >
          <h2 className="text-3xl font-semibold mb-4">
            What Career Comeback Offers
          </h2>
          <ul className="list-disc list-inside space-y-3 text-lg md:text-xl drop-shadow-md">
            {[
              "Task & Goal Tracking: Stay organized and monitor your progress with clear task management.",
              "Reminders & Alerts: Never miss an important step with built-in reminders.",
              "Personalized Experience: Designed to support the unique challenges faced during career transitions.",
              "Motivation & Focus: Tools to help keep you motivated and focused on your comeback journey.",
            ].map((item, i) => (
              <li
                key={i}
                className="hover:text-gray-400 transition-colors cursor-default"
              >
                <strong>{item.split(":")[0]}:</strong> {item.split(":")[1]}
              </li>
            ))}
          </ul>
        </section>

        {/* How It Works */}
        <section
          className={`${sectionBaseClass} ${
            visible.howItWorks
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl font-semibold mb-4">How It Works</h2>
          <ol className="list-decimal list-inside space-y-3 text-lg md:text-xl drop-shadow-md">
            {[
              "Set Clear Goals: Create tasks and subtasks that break down your career comeback into manageable steps.",
              "Track Progress: Mark tasks as complete and see your progress with visual indicators.",
              "Stay Motivated: Use reminders and notifications to keep you moving forward.",
              "Reflect & Adjust: Update your goals as you grow and evolve.",
            ].map((item, i) => (
              <li key={i}>
                <strong>{item.split(":")[0]}:</strong> {item.split(":")[1]}
              </li>
            ))}
          </ol>
        </section>

        {/* Buttons */}
        <div
          className={`flex space-x-6 transition-opacity duration-700 ${
            visible.buttons ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            onClick={handleGetStarted}
            className={` hover:text-gray-300 font-semibold py-3 px-6 rounded-lg transition underline ${
              darkMode
                ? "bg-gray-200 text-black hover:bg-gray-300"
                : "bg-gray-700 text-white hover:bg-gray-800"
            }`}
          >
            Get Started
          </button>
          <button
            onClick={() => navigate("/")}
            className={` hover:text-gray-300 font-semibold py-3 px-6 rounded-lg transition underline ${
              darkMode
                ? "bg-gray-200 text-black hover:bg-gray-300"
                : "bg-gray-700 text-white hover:bg-gray-800"
            }`}
          >
            Back to Home
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
