import React, { useState, useEffect } from "react";
import api from "../../api";
import NavBar from "../Navbar";
import { KanbanColumn } from "./KanbanColumn";
import Footer from "../Footer";

const columnsOrder = [
  "Wish List",
  "Applied",
  "Interviewing",
  "Offer",
  "Rejected",
];

export default function JobTracker({ darkMode }) {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    setLoading(true);
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs/jobs");
        setJobs(res.data);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
        setJobs([]);
        setError(error.message || "Failed to load jobs");
        // fallback to empty on error
      } finally {
        setLoading(false); // hide loading message
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
      setJobs((prevJobs) =>
        prevJobs.map((job) => (job.id === job_id ? updatedJob : job))
      );
    } catch (error) {
      console.error("Error updating job:", error);
      setError(error.message || "Network error!.Please try after sometime");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewJob = async (newJob) => {
    try {
      const response = await api.post("/jobs/jobs/", newJob);
      const createdJob = response.data;
      setJobs((prevJobs) => [...prevJobs, createdJob]);
    } catch (error) {
      console.error("Error adding job:", error);
    }
  };

  const handleDeleteJob = async (job_id) => {
    try {
      await api.delete(`/jobs/jobs/${job_id}`);
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== job_id));
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  return (
    <div>
      <div
        className={`p-4 flex flex-col items-center min-h-screen transition-colors duration-500 ${
          darkMode
            ? "bg-black text-gray-100"
            : "bg-light-gradient text-gray-900"
        }`}
      >
        {/* <NavBar /> */}
        <main className="flex-1 p-6 max-w-full overflow-x-auto">
          <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
            <h1
              className={`text-4xl font-extrabold tracking-tight ${
                darkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Job Hunt Tracker
            </h1>
            <input
              type="text"
              placeholder="Search jobs"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={`w-full sm:w-64 px-4 py-3 rounded-xl shadow-md transition focus:outline-none focus:ring-2 ${
                darkMode
                  ? "bg-gray-800 text-white placeholder-gray-400 focus:ring-blue-400"
                  : "bg-white text-black placeholder-gray-500 focus:ring-blue-600"
              }`}
            />
          </header>

          {loading && (
            <p
              className={`text-center mb-4 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Loading jobs...
            </p>
          )}
          {error && <p className="text-center text-red-500 mb-4">{error}</p>}

          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900">
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
        </main>
      </div>
      <Footer />
    </div>
  );
}
