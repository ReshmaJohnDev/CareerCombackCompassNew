import React, { useState, useEffect, useRef, useContext } from "react";
import api from "../../api";
import { set } from "date-fns";
import { Trash2 } from "lucide-react";

import { AppContext } from "../../context/AppContext";

const STATUS_OPTIONS = [
  "Applied",
  "Interview Scheduled",
  "Interviewed",
  "Hired",
  "Rejected",
];

const statusColors = {
  Applied: "#4A90E2", // Blue
  Interviewed: "#F5A623", // Yellow
  Rejected: "#D0021B", // Red
  Hired: "#7ED321", // Green
  "Interview Scheduled": "#9B59B6", // Purple-ish
};

const getStatusBadgeColor = (status, darkMode) => {
  const base = darkMode ? "text-white" : "text-gray-900";
  switch (status) {
    case "Applied":
      return `bg-blue-600 ${base}`; // Deeper colors for dark mode background
    case "Interviewed":
      return `bg-yellow-600 ${base}`;
    case "Hired":
      return `bg-green-600 ${base}`;
    case "Rejected":
      return `bg-red-600 ${base}`;
    case "Interview Scheduled":
      return `bg-purple-600 ${base}`;
    default:
      return "bg-gray-400 text-gray-900";
  }
};

export default function InterviewTracker() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("");
  const [editingJobId, setEditingJobId] = useState(null);
  const { logActivity, overviewData, setOverviewData, darkMode } =
    useContext(AppContext);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    status: "Applied",
    notes: "",
    applied_date: "",
  });
  const formRef = useRef(null);
  const jobRefs = useRef({});

  const totalApplied = jobs.length;
  const rejectedCount = jobs.filter((job) => job.status === "Rejected").length;
  const offersCount = jobs.filter((job) => job.status === "Hired").length;

  useEffect(() => {
    if (showForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showForm]);

  // Fetch jobs on mount
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await api.get("/jobs/jobs");
        setJobs(response.data);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
        setError("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Filter jobs by title, company, status
  const filteredJobs = jobs.filter((job) =>
    `${job.title || ""} ${job.company || ""} ${job.status || ""}`
      .toLowerCase()
      .includes(filter.toLowerCase().trim())
  );

  // Handle form input changes (controlled form)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const totalSent = jobs.length;

    const responsesReceived = jobs.filter(
      (job) => job.status !== "Applied"
    ).length;

    setOverviewData((prev) => ({
      ...prev,
      jobTracker: {
        ...prev.jobTracker,
        totalSent,
        responsesReceived,
      },
    }));
  }, [jobs, setOverviewData]);

  // Reset form to empty or to a job's data if editing
  const resetForm = (job = null) => {
    if (job) {
      setFormData({
        title: job.title || "",
        company: job.company || "",
        status: job.status || "Applied",
        notes: job.notes || "",
        applied_date: job.applied_date ? job.applied_date.slice(0, 10) : "",
      });
    } else {
      setFormData({
        title: "",
        company: "",
        status: "Applied",
        notes: "",
        applied_date: "",
      });
    }
  };

  // Open form for adding a new job
  const openAddForm = () => {
    resetForm();
    setEditingJobId(null);
    setShowForm(true);
  };

  // Open form for editing an existing job
  const openEditForm = (job) => {
    resetForm(job);
    setEditingJobId(job.id);
    setShowForm(true);
  };

  // Close form and clear states
  const closeForm = () => {
    setShowForm(false);
    setEditingJobId(null);
    resetForm();
  };

  // Submit handler for both add and update
  const handleSubmit = async (e) => {
    e.preventDefault();

    const jobPayload = {
      title: formData.title,
      company: formData.company,
      status: formData.status,
      notes: formData.notes,
      applied_date: formData.applied_date,
      follow_up_date: null,
    };

    try {
      if (editingJobId) {
        // Update job
        const response = await api.put(
          `/jobs/jobs/${editingJobId}/`,
          jobPayload
        );
        const updatedJob = response.data;
        setJobs((prevJobs) =>
          prevJobs.map((job) => (job.id === editingJobId ? updatedJob : job))
        );
      } else {
        // Add new job
        const response = await api.post("/jobs/jobs/", jobPayload);
        setJobs((prevJobs) => [...prevJobs, response.data]);
        console.log(jobPayload.title);
        logActivity(
          `Added a new job application for the post of ${jobPayload.title} at ${jobPayload.company}`
        );
      }
      closeForm();

      // Scroll & focus only when editing
      if (editingJobId && jobRefs.current[editingJobId]) {
        setTimeout(() => {
          jobRefs.current[editingJobId].scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          jobRefs.current[editingJobId].focus();
        }, 100);
      }
    } catch (err) {
      console.error("Error submitting job:", err);
      setError("Failed to submit job");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDelete = async (jobId, e) => {
    e.stopPropagation(); // Prevent triggering onClick for opening form

    try {
      await api.delete(`/jobs/jobs/${jobId}`);
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
    } catch (err) {
      console.error("Error deleting job:", err);
      setError("Failed to delete job");
    }
  };
  const containerClasses = darkMode
    ? "bg-gray-800 text-gray-100" // Dark mode main container
    : "bg-gradient-to-r from-blue-300 to-gray-200"; // Light mode main container

  const headerWrapperClasses = darkMode
    ? "bg-gray-900 shadow-xl" // Dark mode inner header
    : "bg-gradient-to-r from-blue-300 to-gray-200 shadow-lg"; // Light mode inner header

  const controlsBoxClasses = darkMode
    ? "bg-gray-700 text-gray-100 shadow-lg" // Dark mode controls box
    : "bg-white shadow-md text-gray-700"; // Light mode controls box

  const inputClasses = darkMode
    ? "bg-gray-800 border-gray-600 text-white focus:ring-blue-400 focus:border-blue-400"
    : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500";

  return (
    <div
      className={`w-full max-w-7xl mx-auto shadow rounded p-6 flex flex-col min-h-[80vh] transition-colors duration-500 ${containerClasses}`}
    >
      <div className={`${headerWrapperClasses} rounded-lg p-6`}>
        <h2 className="text-2xl font-bold mb-2">Job Application Tracker</h2>
        <p className="mb-4 text-gray-600">
          Keep track of all your applications and their current status.
        </p>

        {/* Controls: Add + Search */}
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            {/* Left side: Counts */}
            <div className="flex space-x-12 text-sm font-semibold text-gray-700">
              <div className="text-blue-600">
                <span className="block text-xl font-bold">{totalApplied}</span>
                Total Applied
              </div>
              <div className="text-red-600">
                <span className="block text-xl font-bold">{rejectedCount}</span>
                Rejected
              </div>
              <div className="text-green-600">
                <span className="block text-xl font-bold">{offersCount}</span>
                Offers
              </div>
            </div>

            {/* Right side: Add button + Search */}
            <div className="flex items-center space-x-4">
              <button
                onClick={openAddForm}
                className="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                + Add Application
              </button>

              <input
                type="text"
                placeholder="Search jobs"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-64 px-4 py-3 rounded-xl border border-gray-300 shadow-md transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="mb-8 space-y-4 max-w-md"
          >
            <label className="block">
              Job Title:
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </label>

            <label className="block">
              Company:
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </label>

            <label className="block">
              Status:
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              Notes:
              <textarea
                name="notes"
                rows="3"
                value={formData.notes}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </label>

            <label className="block">
              Date Applied:
              <input
                type="date"
                name="applied_date"
                value={formData.applied_date}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </label>

            <div className="flex gap-4">
              <button
                type="submit"
                className={`px-4 py-2 rounded-md text-white ${
                  editingJobId
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-700"
                } transition`}
              >
                {editingJobId ? "Save Changes" : "Add Job"}
              </button>

              <button
                type="button"
                onClick={closeForm}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Job List */}
        <div>
          {loading ? (
            <p>Loading jobs...</p>
          ) : filteredJobs.length > 0 ? (
            <ul className="space-y-4 max-w-3xl">
              {filteredJobs.map((job) => (
                <li
                  key={job.id}
                  ref={(el) => {
                    if (el) {
                      jobRefs.current[job.id] = el;
                    }
                  }}
                  tabIndex={-1}
                  className={`relative w-full p-5 rounded-xl border shadow-md cursor-pointer hover:shadow-lg transition ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-100 hover:shadow-2xl"
                      : "bg-white border-gray-300"
                  }`}
                  onClick={() => openEditForm(job)}
                >
                  <div
                    className="absolute top-0 left-0 h-full w-1.5 rounded-l-xl"
                    style={{
                      backgroundColor: statusColors[job.status] || "#999",
                    }}
                  />
                  {/* Status badge */}
                  <div className="absolute top-3 right-10">
                    <span
                      className={`text-sm font-medium px-3 py-1 rounded-full ${getStatusBadgeColor(
                        job.status,
                        darkMode
                      )}`}
                    >
                      {job.status}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleDelete(job.id, e)}
                    className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1 rounded"
                    aria-label={`Delete job ${job.title}`}
                    title="Delete job"
                  >
                    <Trash2 size={18} />
                  </button>
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                  <p
                    className={`${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {job.company}
                  </p>
                  <p
                    className={`text-sm mt-2 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Notes: {job.notes || "—"}
                  </p>

                  <div
                    className={`absolute font-semibold right-5 bottom-3 text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-400"
                    }`}
                  >
                    Applied: {formatDate(job.applied_date)}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              No jobs found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
