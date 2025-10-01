import React, { createContext, useState, useEffect, useContext } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [username, setUsername] = useState(localStorage.getItem("user_name"));
  const [loginError, setLoginError] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });
  const [tasks, setTasks] = useState(() => {
    return JSON.parse(localStorage.getItem("tasks")) || [];
  });
  const [gapStoryStepsCompleted, setGapStoryStepsCompleted] = useState([]);
  const [gapStoryFormData, setGapStoryFormData] = useState({
    duration: "",
    reason: "",
    skills: [],
    growth: "",
    stayingCurrent: "",
    motivation: "",
  });
  const [overviewData, setOverviewData] = useState({
    gapStory: {
      completionPercent: 0,
    },
    jobTracker: {
      totalSent: 0,
      responses: 0,
    },
    actionPlanner: {
      completed: 0,
      total: 0,
    },
    nextMilestone: {
      title: "",
      dueIn: "",
    },
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const logActivity = (message) => {
    const newEntry = {
      message,
      timestamp: new Date().toISOString(),
    };
    const updated = [newEntry, ...recentActivity].slice(0, 10);
    setRecentActivity(updated);
    localStorage.setItem("recentActivity", JSON.stringify(updated));
  };
  const features = [
    {
      title: "Gap Story Builder",
      description:
        "Create a compelling and professional narrative of your career gap. Transform your story into a strength with guided prompts and templates.",
      path: "/gap-story",
      short_description: "Build Your Gap Story",
      img: "/career_gap.png",
    },
    {
      title: "Action Planner",
      description:
        "Set goals and track your comeback progress with smart reminders. Break down your journey into manageable steps with deadline tracking.",
      short_description: "Plan your weekly career goals here",
      path: "/planner",
      img: "/action_plan.png",
    },
    {
      title: "Job Application Tracker",
      description:
        "Keep track of all job applications and their statuses. Never lose track of opportunities with comprehensive application management",
      short_description: "Track Your Job Applications",
      path: "/job-tracker",
      img: "/job_tracker.png",
    },
    {
      title: "Career Returnee Resources",
      description:
        "Access curated resources like events, returnships, and communities designed specifically for career returnees. Connect with opportunities and support networks.",
      short_description: "Explore Resources",
      path: "/resources",
      img: "/resources.png",
    },
  ];
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
  // NEW: Load Action Planner data and compute next milestone

  useEffect(() => {
    // Persist tasks to localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));

    const completed = tasks.filter((t) => t.completed).length;
    const total = tasks.length;

    // Find earliest uncompleted task with a due date
    const upcoming = tasks
      .filter((t) => !t.completed)
      .sort((a, b) => new Date(a.reminder) - new Date(b.reminder))[0];

    let nextMilestone = { title: "", dueIn: "" };
    if (upcoming) {
      const daysLeft = Math.ceil(
        (new Date(upcoming.reminder) - new Date()) / (1000 * 60 * 60 * 24)
      );
      nextMilestone = {
        title: upcoming.title,
        dueIn: `${daysLeft} days`,
      };
    }

    setOverviewData((prev) => ({
      ...prev,
      actionPlanner: { completed, total },
      nextMilestone,
    }));
  }, [tasks]);

  return (
    <AppContext.Provider
      value={{
        username,
        setUsername,
        darkMode,
        setDarkMode,
        features,
        logActivity,
        overviewData,
        setOverviewData,
        gapStoryFormData,
        setGapStoryFormData,
        gapStoryStepsCompleted,
        setGapStoryStepsCompleted,
        tasks,
        setTasks,
        loginError,
        setLoginError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
