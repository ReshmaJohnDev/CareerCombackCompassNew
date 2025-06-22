import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Services from "./pages/Services";
import Landing from "./pages/Landing";
import GapStoryBuilder from "./pages/GapGenerator/GapStoryBuilder";
import ActionPlanner from "./pages/ActionPlanner";
import JobTracker from "./pages/JobTracker/JobTracker";
import Chatbot from "./pages/Chatbot";
import "./index.css";
import GetStarted from "./pages/GetStarted";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Navbar from "./pages/Navbar";
import ManualForm from "./pages/GapGenerator/ManualForm";
import UploadForm from "./pages/GapGenerator/UploadForm";

function App() {
  const [username, setUsername] = useState(localStorage.getItem("user_name"));
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  // Sync darkMode to localStorage & toggle class on document root
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    function onStorageChange() {
      setUsername(localStorage.getItem("user_name"));
    }
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  return (
    <Router>
      <Navbar
        username={username}
        setUsername={setUsername}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="services" element={<Services />} />
        <Route path="/gap-story" element={<GapStoryBuilder />} />
        <Route path="/planner" element={<ActionPlanner />} />
        <Route path="/job-tracker" element={<JobTracker />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/get_started" element={<GetStarted />} />
        <Route path="/login" element={<Login setUsername={setUsername} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/manaul" element={<ManualForm />} />
        <Route path="/upload" element={<UploadForm />} />
      </Routes>
    </Router>
  );
}

export default App;
