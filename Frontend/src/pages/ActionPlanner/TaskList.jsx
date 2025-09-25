// TaskList.jsx
import React, { useEffect, useState, useRef, useContext } from "react";
import TaskCard from "./TaskCard";
import { fetchTasks, createTasks, updateTask } from "./util/Task";
import TaskForm from "./TaskForm";
import EditTask from "./EditTask";
import { AppContext } from "../../context/AppContext";

export default function TaskList({ showForm, setShowForm, tasks, setTasks }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const taskRefMap = useRef({}); // Map of task ID -> DOM ref
  const lastEditedTaskId = useRef(null); // Track last edited task
  const { logActivity } = useContext(AppContext);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await fetchTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError("Failed to load tasks");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleSubmit = async (newTaskData) => {
    try {
      await createTasks(newTaskData);
      loadTasks();
      console.log(newTaskData.title);
      setShowForm(false);
      logActivity(`Added New Task ${newTaskData.title}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveEdit = async (updatedTask) => {
    try {
      lastEditedTaskId.current = updatedTask.id;
      await updateTask(updatedTask);
      logActivity(`Task ${updatedTask.title} updated`);
      await loadTasks();
      setEditingTask(null);

      // Focus and scroll into view after DOM updates
      setTimeout(() => {
        const el = taskRefMap.current[updatedTask.id];
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.focus?.();
        }
      }, 0);
    } catch (err) {
      console.error("Failed to update task", err);
    }
  };

  return (
    <div className="space-y-4">
      {showForm && (
        <TaskForm onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
      )}

      {!loading && !error && tasks.length > 0 && (
        <div className="flex flex-col gap-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={loadTasks}
              onEdit={() => setEditingTask(task)}
              ref={(el) => {
                taskRefMap.current[task.id] = el;
              }}
            />
          ))}
        </div>
      )}

      {!loading && !error && tasks.length === 0 && (
        <p className="text-gray-500 text-center">No tasks yet.</p>
      )}

      {editingTask && (
        <EditTask
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}
