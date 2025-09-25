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
    if (!token) {
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
      className={`p-6 text-${
        darkMode ? "gray-100" : "gray-900"
      } bg-transparent`}
    >
      {" "}
      {username && (
        <>
          <h1 className="text-3xl font-bold mb-4">Welcome back, {username}!</h1>
          <p className="mb-8 text-lg">
            Continue building your career comeback journey
          </p>
          <div className="flex justify-around gap-x-4 rounded-md bg-gradient-to-r from-blue-400 to-gray-400 px-4 py-2">
            {tabs.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center justify-center w-40 px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === path
                    ? "bg-white text-black"
                    : "text-gray-600 hover:bg-gray-300"
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
