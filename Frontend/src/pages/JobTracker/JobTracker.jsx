import React, { useState, useEffect, useContext } from "react";
import api from "../../api";
import { KanbanColumn } from "./KanbanColumn";
import Footer from "../Footer";
import { AppContext } from "../../context/AppContext";

const columnsOrder = [
  "Wish List",
  "Applied",
  "Interviewing",
  "Offer",
  "Rejected",
];

export default function JobTracker() {
  const { darkMode } = useContext(AppContext);
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch jobs
  useEffect(() => {
    setError(null);
    setLoading(true);
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs/jobs");
        setJobs(res.data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load jobs");
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) =>
    `${job.title || ""} ${job.company || ""}`
      .toLowerCase()
      .includes(filter.toLowerCase().trim())
  );

  const handleUpdateJob = async (job_id, updatedData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/jobs/jobs/${job_id}`, updatedData);
      const updatedJob = response.data;
      setJobs((prev) =>
        prev.map((job) => (job.id === job_id ? updatedJob : job))
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "Network error! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewJob = async (newJob) => {
    try {
      const res = await api.post("/jobs/jobs/", newJob);
      setJobs((prev) => [...prev, res.data]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteJob = async (job_id) => {
    try {
      await api.delete(`/jobs/jobs/${job_id}`);
      setJobs((prev) => prev.filter((job) => job.id !== job_id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className={`relative min-h-screen w-full ${
        darkMode
          ? "bg-gray-900 text-gray-100"
          : "bg-gradient-to-r from-blue-300 to-gray-200 text-black"
      } flex justify-center items-start p-6`}
    >
      {/* Content Card */}
      <div className="relative z-10 w-full max-w-7xl flex flex-col gap-6 min-h-[80vh]">
        {/* Header */}
        <div className="bg-white/10 dark:bg-gray-800 rounded-xl shadow-lg p-6 backdrop-blur-md transition-colors">
          <h1 className="text-2xl font-bold mb-2">Job Application Tracker</h1>
          <p className="mb-4">
            Keep track of all your applications and their current status
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mb-6 px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            + Add Application
          </button>

          {/* Filter Input */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h2
              className={`text-4xl font-extrabold tracking-tight ${
                darkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Job Hunt Tracker
            </h2>
            <input
              type="text"
              placeholder="Search jobs"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={`w-full sm:w-64 px-4 py-3 rounded-xl shadow-md transition focus:outline-none focus:ring-2 ${
                darkMode
                  ? "bg-gray-800 text-white placeholder-gray-400 focus:ring-blue-400"
                  : "bg-white/30 text-black placeholder-gray-600 focus:ring-blue-600"
              }`}
            />
          </div>

          {/* Loading & Error */}
          {loading && (
            <p
              className={`text-center mt-4 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Loading jobs...
            </p>
          )}
          {error && <p className="text-center text-red-500 mt-4">{error}</p>}
        </div>

        {/* Kanban Columns */}
        <div className="flex gap-6 overflow-x-auto pb-6">
          {columnsOrder.map((column) => (
            <KanbanColumn
              key={column}
              id={column}
              title={column}
              jobs={filteredJobs.filter((job) => job.status === column)}
              onAddJob={handleAddNewJob}
              onUpdateJob={handleUpdateJob}
              onDeleteJob={handleDeleteJob}
              loading={loading}
              darkMode={darkMode}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
