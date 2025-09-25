import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Services from "./pages/Services";
import Landing from "./pages/Landing";
import GapStoryBuilder from "./pages/GapGenerator/GapStoryBuilder";
import ActionPlanner from "./pages/ActionPlanner/ActionPlanner";
import InterviewTracker from "./pages/JobTracker/InterviewTracker";
import "./index.css";
import GetStarted from "./pages/GetStarted";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Resources from "./pages/Resources/Resources";
import LearnMore from "./pages/LearnMore";
import Dashboard from "./components/Dashboard";
import StepOne from "./pages/GapGenerator/ManualForm/StepOne";
import StepTwo from "./pages/GapGenerator/ManualForm/StepTwo";
import StepThree from "./pages/GapGenerator/ManualForm/StepThree";
import StepFour from "./pages/GapGenerator/ManualForm/StepFour";
import StepFive from "./pages/GapGenerator/ManualForm/StepFive";
import StepSix from "./pages/GapGenerator/ManualForm/StepSix";
import Overview from "./components/Overview";
import { AppProvider } from "./context/AppContext";
import ChatBot from "./pages/ChatBot/ChatBot";
import DashboardLayout from "./components/DashboardLayout";
import PublicLayout from "./components/PublicLayout";

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Public routes with Navbar + Footer */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/services" element={<Services />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/get_started" element={<GetStarted />} />
            <Route path="/learn_more" element={<LearnMore />} />

            {/* add other public routes here */}
          </Route>

          {/* Dashboard routes with separate layout */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<Overview />} />
              <Route path="overview" element={<Overview />} />

              <Route path="gap-story" element={<GapStoryBuilder />}>
                <Route index element={<Navigate to="step-1" replace />} />
                <Route path="step-1" element={<StepOne />} />
                <Route path="step-2" element={<StepTwo />} />
                <Route path="step-3" element={<StepThree />} />
                <Route path="step-4" element={<StepFour />} />
                <Route path="step-5" element={<StepFive />} />
                <Route path="step-6" element={<StepSix />} />
              </Route>
              <Route path="planner" element={<ActionPlanner />} />
              <Route path="interview-tracker" element={<InterviewTracker />} />
              <Route path="resources" element={<Resources />} />
              <Route path="chat-bot" element={<ChatBot />} />
              {/* add other dashboard routes */}
            </Route>
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
