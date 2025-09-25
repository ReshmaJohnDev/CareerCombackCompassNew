import React, { useState, useContext } from "react";

export default function TaskForm({ onSubmit, onCancel, initialData = {} }) {
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    reminder: initialData.reminder || "",
    completed_date: initialData.completed_date || "",
    reminder_email: initialData.reminder_email || "",
    reminder_enabled: initialData.reminder_enabled || false,
    subtasks: initialData.subtasks || [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAddSubtask = () => {
    setFormData({
      ...formData,
      subtasks: [...formData.subtasks, { title: "", completed: false }],
    });
  };

  const handleSubtaskChange = (index, value) => {
    const updated = [...formData.subtasks];
    updated[index].title = value;
    setFormData({ ...formData, subtasks: updated });
  };

  const handleRemoveSubtask = (index) => {
    const updated = formData.subtasks.filter((_, i) => i !== index);
    setFormData({ ...formData, subtasks: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert datetime-local strings to ISO strings, or null if empty
    const reminderIso = formData.reminder
      ? new Date(formData.reminder).toISOString()
      : null;

    const completedDateIso = formData.completed_date
      ? new Date(formData.completed_date).toISOString()
      : null;

    const newTask = {
      ...formData,
      reminder: reminderIso,
      completed_date: completedDateIso,
      completed: !!completedDateIso, // completed = true if completed_date set
    };
    onSubmit(newTask);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 border p-4 rounded shadow"
    >
      <input
        name="title"
        placeholder="Task Title"
        value={formData.title}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      <label>
        Reminder:
        <input
          type="datetime-local"
          name="reminder"
          value={formData.reminder}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </label>

      <label>
        Completed Date:
        <input
          type="datetime-local"
          name="completed_date"
          value={formData.completed_date}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </label>

      <input
        type="email"
        name="reminder_email"
        placeholder="Reminder Email"
        value={formData.reminder_email}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="reminder_enabled"
          checked={formData.reminder_enabled}
          onChange={handleChange}
        />
        Enable Email Reminder
      </label>

      <div className="space-y-2">
        <p className="font-semibold">Subtasks</p>
        {formData.subtasks.map((subtask, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              value={subtask.title}
              onChange={(e) => handleSubtaskChange(i, e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <button
              type="button"
              onClick={() => handleRemoveSubtask(i)}
              className="text-red-500 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddSubtask}
          className="text-blue-500 text-sm"
        >
          + Add Subtask
        </button>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
