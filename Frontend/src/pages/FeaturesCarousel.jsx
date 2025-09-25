import React, { useEffect, useRef, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export default function FeaturesCarousel({ features }) {
  const scrollContainerRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { darkMode } = useContext(AppContext);

  useEffect(() => {
    const container = scrollContainerRef.current;
    const scrollAmount = 300;
    const intervalTime = 3000;

    const interval = setInterval(() => {
      if (!container) return;

      console.log(
        "scrollLeft:",
        container.scrollLeft,
        "/",
        container.scrollWidth
      );

      container.scrollBy({ left: scrollAmount, behavior: "smooth" });

      if (
        container.scrollLeft + container.clientWidth >=
        container.scrollWidth - 1
      ) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-x-auto no-scrollbar py-6">
      <div
        className="flex space-x-3 px-4 flex-nowrap min-w-max"
        ref={scrollContainerRef}
      >
        {features.map((feature, idx) => (
          <div
            key={feature.title + idx}
            to={feature.path}
            className={`
    flex-shrink-0
    w-60 sm:w-64 md:w-72
    rounded-lg
    shadow-md
    hover:shadow-xl
    transition
    transform
    hover:scale-110
    duration-300
    cursor-pointer
    overflow-hidden
    flex flex-col
    relative
    ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}
  `}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <img
              src={feature.img}
              alt={feature.title}
              className="w-full h-96   object-cover rounded-t-lg"
            />
            {/* Overlay description on hover */}
            {hoveredIndex === idx && (
              <div
                className="absolute inset-0 p-4 flex flex-col items-center justify-center text-center rounded-lg text-white space-y-2"
                style={{
                  backgroundColor: darkMode
                    ? "rgba(18, 18, 18, 0.8)"
                    : "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                }}
              >
                <h1
                  className={`text-lg font-bold ${
                    darkMode
                      ? "bg-gradient-to-br from-blue-300 to-gray-300"
                      : "bg-gradient-to-br from-blue-700 to-gray-700"
                  } bg-clip-text text-transparent`}
                >
                  {feature.title}
                </h1>
                <h2
                  className={`text-sm font-normal ${
                    darkMode
                      ? "bg-gradient-to-br from-blue-200 to-gray-200"
                      : "bg-gradient-to-br from-blue-600 to-gray-700"
                  } bg-clip-text text-transparent`}
                >
                  {feature.description}
                </h2>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
