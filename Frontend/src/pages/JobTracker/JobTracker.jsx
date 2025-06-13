import React, { useState, useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import api from "../../api";
import NavBar from "../Navbar";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { KanbanColumn } from "./KanbanColumn";
import { Moon, Sun } from "lucide-react";

const columnsOrder = [
  "Wish List",
  "Applied",
  "Interviewing",
  "Offer",
  "Rejected",
];

export default function JobTracker() {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs/jobs");
        setJobs(res.data);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
        setJobs([]); // Fallback to empty state on error
      }
    };
    fetchJobs();
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const jobId = active.id;
    const newStatus = over.id;
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, status: newStatus } : job
      )
    );
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(filter.toLowerCase()) ||
      job.company.toLowerCase().includes(filter.toLowerCase())
  );

  const toggleTheme = () => setDarkMode(!darkMode);

  // Parent component
  const handleUpdateJob = async (job_id, updatedData) => {
    try {
      const response = await api.put(`/jobs/jobs/${job_id}`, updatedData);
      const updatedJob = response.data;

      setJobs((prevJobs) =>
        prevJobs.map((job) => (job.id === job_id ? updatedJob : job))
      );
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };
  const handleAddNewJob = async (newJob) => {
    try {
      console.log("reached add job");
      console.log(newJob);
      const response = await api.post("/jobs/jobs/", newJob);
      const createdJob = response.data;
      setJobs((prevJobs) => [...prevJobs, createdJob]);
      console.log("Jib added sucessfully");
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };
  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <NavBar />
      <div className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">Job Hunt 2024</h1>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search saved jobs"
            className="px-3 py-1 border rounded"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <button onClick={toggleTheme} className="p-2">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={columnsOrder}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex overflow-auto gap-4 p-4">
            {columnsOrder.map((column) => (
              <KanbanColumn
                key={column}
                id={column}
                title={column}
                jobs={filteredJobs.filter((job) => job.status === column)}
                onAddJob={handleAddNewJob}
                onUpdateJob={handleUpdateJob}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
