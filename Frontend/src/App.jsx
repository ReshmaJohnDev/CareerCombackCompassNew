import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Services from "./pages/Services";
import Landing from "./pages/Landing";
import GapStoryBuilder from "./pages/GapGenerator/GapStoryBuilder";
import ActionPlanner from "./pages/ActionPlanner/ActionPlanner";
import JobTracker from "./pages/JobTracker/JobTracker";
import Chatbot from "./pages/Chatbot";
import "./index.css";
import GetStarted from "./pages/GetStarted";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Navbar from "./pages/Navbar";
import LearnMore from "./pages/LearnMore";

import { AppProvider } from "./context/AppContext";

function App() {
  return (
    <AppProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="services" element={<Services />} />
          <Route path="/gap-story" element={<GapStoryBuilder />} />
          <Route path="/planner" element={<ActionPlanner />} />
          <Route path="/job-tracker" element={<JobTracker />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/get_started" element={<GetStarted />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/learn_more" element={<LearnMore />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
