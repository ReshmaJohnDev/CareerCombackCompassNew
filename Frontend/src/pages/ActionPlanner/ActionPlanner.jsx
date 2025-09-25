import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TaskList from "./TaskList";
import { AppContext } from "../../context/AppContext";

export default function ActionPlanner() {
  const [showForm, setShowForm] = useState(false);
  const { tasks, setTasks } = useContext(AppContext);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const totalTaks = tasks.length;
  const completedTasks = tasks.filter((job) => job.completed).length;
  const taksToComplete = totalTaks - completedTasks;
  return (
    <div className="w-full max-w-7xl mx-auto bg-gradient-to-r from-blue-300 to-gray-200 shadow rounded p-6 flex flex-col min-h-[80vh]">
      <div className="bg-gradient-to-r from-blue-300 to-gray-200 shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Action Planner</h1>
        <p>
          Set goals, track progress, and stay motivated with smart reminders
        </p>
        <h2 className="font-bold mb-4">Your Comeback Goals</h2>

        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            {/* Left side: Counts */}
            <div className="flex space-x-12 text-sm font-semibold text-gray-700">
              <div className="text-blue-600">
                <span className="block text-xl font-bold">{totalTaks}</span>
                Total Tasks
              </div>
              <div className="text-red-600">
                <span className="block text-xl font-bold">
                  {completedTasks}
                </span>
                Completed Tasks
              </div>
              <div className="text-green-600">
                <span className="block text-xl font-bold">
                  {taksToComplete}
                </span>
                Taks To Complete
              </div>
            </div>

            {/* Right side: Add button + Search */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowForm(true)}
                className="mb-6 px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="mb-6 px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Add Task
        </button>

        <TaskList
          showForm={showForm}
          setShowForm={setShowForm}
          tasks={tasks}
          setTasks={setTasks}
        />
      </div>
    </div>
  );
}
