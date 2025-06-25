import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import {
  updateSubTaskStatus,
  updateTaskStatus,
  fetchTaskById,
  deleteTask,
} from "./util/Task";

const TaskCard = ({ task, onUpdate }) => {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const completedSubtasksCount = task.subtasks.filter(
    (st) => st.completed
  ).length;

  const handleSubtaskToggle = async (subtaskId, currentStatus) => {
    try {
      await updateSubTaskStatus(subtaskId, !currentStatus);
      const updatedTask = await fetchTaskById(task.id);
      const allCompleted = updatedTask.subtasks.every((st) => st.completed);
      await updateTaskStatus(task.id, allCompleted);
      onUpdate?.();
    } catch (err) {
      console.error("Error toggling subtask:", err);
    }
  };

  const handleTaskToggle = async () => {
    try {
      const newStatus = !task.completed;
      await updateTaskStatus(task.id, newStatus);
      onUpdate?.();
    } catch (err) {
      console.error("Error toggling task status:", err);
    }
  };

  const handleDeleteSubtask = async (taskId) => {
    try {
      await deleteTask(taskId);
      onUpdate?.();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  return (
    <div className="w-80 bg-gradient-to-r from-gray-700 via-gray-900 to-black p-5 rounded-2xl shadow-lg flex flex-col border border-gray-700 transition-transform hover:scale-[1.03]">
      <button
        className="absolute top-3 right-3 text-white-500 hover:text-red-500"
        onClick={() => setShowDeleteAlert(true)}
        title="Delete Task"
      >
        <Trash2 className="w-5 h-5" />
      </button>

      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-white-900">{task.title}</h2>
          {task.subtasks.length === 0 ? (
            <button
              onClick={handleTaskToggle}
              className={`mt-1 text-xs px-2 py-1 rounded-full font-medium ${
                task.completed
                  ? "bg-green-600 text-white"
                  : "bg-yellow-400 text-gray-800 animate-pulse"
              }`}
            >
              {task.completed ? "Completed" : "Mark as Done"}
            </button>
          ) : (
            <>
              <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden mt-2">
                <div
                  className={`h-full transition-all duration-300 ${
                    task.completed
                      ? "bg-green-500"
                      : "bg-yellow-400 animate-pulse"
                  }`}
                  style={{
                    width: `${
                      (completedSubtasksCount / task.subtasks.length) * 100
                    }%`,
                  }}
                />
              </div>
              <p className="text-xs text-right text-white-500 mt-1">
                {task.completed ? "Completed" : "In Progress"}
              </p>
            </>
          )}
        </div>
      </div>

      {task.description && (
        <p className="text-gray-700 text-sm mt-1">{task.description}</p>
      )}

      <div className="mt-4">
        <p className="text-sm font-medium text-white-800 mb-1">
          Subtasks ({completedSubtasksCount}/{task.subtasks.length})
        </p>
        <ul className="space-y-2 text-gray-800 text-sm">
          {task.subtasks.map((subtask) => (
            <li key={subtask.id} className="flex items-center">
              <input
                type="checkbox"
                checked={subtask.completed}
                onChange={() =>
                  handleSubtaskToggle(subtask.id, subtask.completed)
                }
                className="mr-2 accent-gray-500"
              />
              <span
                className={
                  subtask.completed ? "line-through text-gray-400" : ""
                }
              >
                {subtask.title}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {showDeleteAlert && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-white p-6 rounded-xl max-w-sm w-full shadow-lg text-gray-800">
            <p className="mb-4">Are you sure you want to delete this task?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  handleDeleteSubtask(task.id);
                  setShowDeleteAlert(false);
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteAlert(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
