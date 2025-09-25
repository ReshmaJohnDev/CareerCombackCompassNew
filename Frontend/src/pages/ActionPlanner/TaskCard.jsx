import React, {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useContext,
} from "react";
import { updateTaskStatus, updateSubTaskStatus, deleteTask } from "./util/Task";
import { Trash2 } from "lucide-react";

const TaskCard = forwardRef(({ task, onEdit, onUpdate }, cardRef) => {
  const {
    title,
    description,
    completed,
    reminder,
    reminder_email,
    reminder_enabled,
    completed_date,
    subtasks = [],
  } = task;

  const checkboxRefs = useRef({});
  const lastToggledSubtaskId = useRef(null);

  const totalSubtasks = subtasks.length;
  const [localSubtasks, setLocalSubtasks] = useState(subtasks);
  const [updatingSubtaskId, setUpdatingSubtaskId] = useState(null);

  // Calculate progress based on localSubtasks state
  const completedSubtasks = localSubtasks.filter((s) => s.completed).length;
  const progress =
    totalSubtasks > 0
      ? Math.round((completedSubtasks / totalSubtasks) * 100)
      : completed
      ? 100
      : 0;

  // Focus the checkbox of the last toggled subtask after localSubtasks changes
  useEffect(() => {
    if (
      lastToggledSubtaskId.current &&
      checkboxRefs.current[lastToggledSubtaskId.current]
    ) {
      checkboxRefs.current[lastToggledSubtaskId.current].focus({
        preventScroll: true,
      });
      lastToggledSubtaskId.current = null;
    }
  }, [localSubtasks]);

  // Sync localSubtasks if subtasks prop changes
  useEffect(() => {
    setLocalSubtasks(subtasks);
  }, [subtasks]);

  const handleToggleComplete = async (e) => {
    e.stopPropagation(); // Prevent triggering onEdit
    try {
      await updateTaskStatus(task.id, !completed);
      onUpdate();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleToggleSubtaskComplete = async (subtask, e) => {
    e.stopPropagation();

    lastToggledSubtaskId.current = subtask.id;
    setUpdatingSubtaskId(subtask.id);

    try {
      await updateSubTaskStatus(subtask.id, !subtask.completed);

      setLocalSubtasks((prev) =>
        prev.map((s) =>
          s.id === subtask.id ? { ...s, completed: !s.completed } : s
        )
      );
    } catch (err) {
      console.error("Failed to update subtask status", err);
    } finally {
      setUpdatingSubtaskId(null);
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
    <>
      <div
        ref={cardRef}
        tabIndex={-1}
        className="relative w-full p-5 mb-4 rounded-xl border border-gray-300 shadow-md bg-white cursor-pointer"
      >
        {/* Left vertical colored strip */}
        <div
          className="absolute top-0 left-0 h-full w-1.5 rounded-l-xl"
          style={{ backgroundColor: completed ? "#16a34a" : "#facc15" }}
        />

        {/* Header: Title & Status */}
        <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
          <h2
            className={`text-xl font-semibold ${
              completed ? "text-green-700" : "text-gray-800"
            }`}
          >
            {title}
          </h2>

          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleComplete}
              className={`text-xs px-3 py-1 rounded-full font-semibold ${
                completed
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {completed ? "Completed" : "Mark Completed"}
            </button>
          </div>
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-700 mb-2">{description}</p>
        )}

        {/* Dates & Reminder */}
        <div className="text-xs text-gray-600 space-y-1 mb-3">
          {reminder && (
            <p>
              <strong>Due:</strong> {new Date(reminder).toLocaleDateString()}
            </p>
          )}
          {reminder_email && reminder_enabled && (
            <p>
              <strong>Reminder to:</strong>{" "}
              <span className="text-blue-600">{reminder_email}</span>
            </p>
          )}
        </div>

        {/* Subtasks List */}
        {totalSubtasks > 0 && (
          <div className="mb-3">
            <p className="font-semibold mb-1">Subtasks:</p>
            <ul>
              {localSubtasks.map((sub) => (
                <li
                  key={sub.id}
                  className="flex justify-between items-center mb-1"
                  onClick={(e) => e.stopPropagation()} // prevent task edit on subtask click
                >
                  <label className="flex items-center gap-2 cursor-default">
                    <input
                      type="checkbox"
                      checked={sub.completed}
                      onChange={(e) => handleToggleSubtaskComplete(sub, e)}
                      onClick={(e) => e.stopPropagation()} // prevent task edit on checkbox click
                      className="cursor-pointer"
                      ref={(el) => (checkboxRefs.current[sub.id] = el)}
                      disabled={updatingSubtaskId === sub.id}
                    />
                    <span
                      className={`select-none ${
                        sub.completed ? " text-green-600" : ""
                      }`}
                    >
                      {sub.title}
                    </span>
                  </label>

                  <div className="flex items-center gap-2">
                    {sub.completed_date && (
                      <span className="text-xs text-green-700">
                        {new Date(sub.completed_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {/* Overall Progress Bar */}
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mt-2">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(to right, #3b82f6, #6b21a8)", // blue to purple gradient
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{progress}% Complete</p>
          </div>
        )}

        <div className="flex gap-4 text-sm mt-2">
          <button
            onClick={() => onEdit(task)}
            className="text-blue-600 hover:text-blue-800 font-semibold"
            title="Edit Task"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteSubtask(task.id)}
            className="text-red-600 hover:text-red-800 font-semibold"
            title="Delete Task"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        {/* Completed date badge */}
        {completed && completed_date && (
          <div
            className="absolute bottom-2 right-3 text-xs text-gray-700 font-semibold px-2 py-0.5 rounded-full"
            style={{ zIndex: 10 }}
          >
            Completed on: {new Date(completed_date).toLocaleString()}
          </div>
        )}

        {/* Reminder date badge - only if not completed */}
        {reminder && !completed && (
          <div
            className="absolute bottom-2 right-3 text-xs text-blue-700 font-semibold px-2 py-0.5 rounded-full"
            style={{ zIndex: 10 }}
          >
            Reminder set for{" "}
            {new Date(reminder).toLocaleDateString(undefined, {
              month: "long",
              day: "numeric",
            })}
          </div>
        )}
      </div>
    </>
  );
});
export default TaskCard;
