import React, { useContext, useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export default function Dashboard() {
  const { darkMode, username, features } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if user is not logged in
    const token = localStorage.getItem("token");
    console.log("Dashboard useEffect fired, token:", token);
    if (!token) {
      console.log("No token found → redirecting to /login");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const tabs = [
    { label: "📈 Overview", path: "/dashboard/overview" },
    { label: "📖 Story", path: "/dashboard/gap-story" },
    { label: "📅 Planner", path: "/dashboard/planner" },
    { label: "💼 Job Tracker", path: "/dashboard/interview-tracker" },
    { label: "🌐 Resources", path: "/dashboard/resources" },
    { label: "💬 Chat-Bot", path: "/dashboard/chat-bot" },
  ];

  const activeTab =
    tabs.find((tab) => location.pathname.startsWith(tab.path))?.path ||
    "/dashboard/overview";

  // Create a Dashboard component that greets the user by name and shows navigation links

  return (
    <div
      className={`p-6 ${
        darkMode ? "text-gray-100" : "text-gray-900"
      } bg-transparent`}
    >
      {" "}
      {username && (
        <>
          <h1 className="text-3xl font-bold mb-4">Welcome back, {username}!</h1>
          <p className="mb-8 text-lg">
            Continue building your career comeback journey
          </p>
          <div
            className={`flex justify-around gap-x-4 rounded-md px-4 py-2 ${
              darkMode
                ? "bg-gray-800" // Dark container background
                : "bg-gradient-to-r from-blue-400 to-gray-400" // Light container background
            }`}
          >
            {tabs.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center justify-center w-40 px-4 py-2 rounded-md font-medium transition-colors ${
                  // 🚨 FIX 3: Conditional styling for active/inactive tabs
                  activeTab === path
                    ? // Active Tab
                      darkMode
                      ? "bg-blue-600 text-white" // Dark Active: Highlighted Blue
                      : "bg-white text-black" // Light Active: Highlighted White
                    : // Inactive Tab
                    darkMode
                    ? "text-gray-300 hover:bg-gray-700" // Dark Inactive: Light text on dark hover
                    : "text-gray-600 hover:bg-gray-300" // Light Inactive: Dark text on light hover
                }`}
              >
                <span>{label}</span>
              </Link>
            ))}
          </div>
          <Outlet />
        </>
      )}
    </div>
  );
}
