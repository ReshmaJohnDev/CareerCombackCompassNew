import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function LearnMore() {
  const { features, darkMode } = useContext(AppContext);
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % features.length);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + features.length) % features.length);

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-12 transition-colors duration-500 ${
        darkMode
          ? "bg-black text-gray-100" // Dark Mode: Black background, light text
          : "bg-gray-100 text-gray-900" // Light Mode: Light background, dark text
      }`}
    >
      <h1 className="text-4xl font-bold mb-8 text-center">App Walkthrough</h1>

      <iframe
        width="100%"
        height="480"
        src="https://www.youtube.com/embed/RoCiqAFQjao"
        title="App Walkthrough"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className={`rounded-lg w-full max-w-3xl ${
          darkMode ? "shadow-xl shadow-gray-700/50" : "shadow-lg"
        }`}
      ></iframe>

      <p
        className={`mt-4 text-center ${
          darkMode ? "text-gray-300" : "text-gray-700"
        }`}
      >
        Watch this walkthrough to see how the app works.
      </p>
    </div>
  );
}
