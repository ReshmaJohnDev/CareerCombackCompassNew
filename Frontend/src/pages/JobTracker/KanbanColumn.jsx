import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";

export const KanbanColumn = ({ id, title, jobs = [], onAddJob }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    applied_date: "",
    application_link: "",
    notes: "",
    follow_up_date: "",
  });
  const [editingJobId, setEditingJobId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [saveEditedJob, setSaveEditedJob] = useState(false);

  const handleAddSubmit = (event, status) => {
    event.preventDefault();

    const newJob = {
      title: formData.title,
      company: formData.company,
      status: id,
      applied_date: formData.applied_date,
      application_link: formData.application_link || null,
      notes: formData.notes || null,
      follow_up_date: formData.follow_up_date || null,
    };
    onAddJob(newJob);
    setFormData({
      title: "",
      company: "",
      applied_date: "",
      application_link: "",
      notes: "",
      follow_up_date: "",
    });
    setShowForm(false);
  };

  const handleEditSubmit = (event, status) => {
    event.preventDefault();
    const updatedData = {
      title: editFormData.title,
      company: editFormData.company,
      status: status,
      applied_date: editFormData.applied_date,
      application_link: editFormData.application_link || null,
      notes: editFormData.notes || null,
      follow_up_date: editFormData.follow_up_date || null,
    };
    onUpdateJob(editingJobId, updatedData);
    setEditingJobId(null);
    setEditFormData({});
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  return (
    <div className="w-72 min-w-72 bg-white dark:bg-gray-800 rounded-lg shadow p-3 flex flex-col">
      <h2 className="text-lg font-semibold mb-3 text-center">{title}</h2>

      <div className="flex flex-col gap-3 flex-1">
        {jobs.map((job) =>
          editingJobId === job.id ? (
            <form
              key={job.id}
              onSubmit={(event) => handleEditSubmit(event, job.status)}
              className="bg-gray-100 dark:bg-gray-700 p-3 rounded shadow space-y-2 text-sm"
            >
              {/* Edit form fields */}
              <input
                type="text"
                value={editFormData.title}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, title: e.target.value })
                }
                className="w-full px-2 py-1 border rounded"
                required
                placeholder="Title"
              />
              <input
                type="text"
                value={editFormData.company}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, company: e.target.value })
                }
                className="w-full px-2 py-1 border rounded"
                required
                placeholder="Company"
              />
              <input
                type="date"
                value={editFormData.applied_date}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    applied_date: e.target.value,
                  })
                }
                className="w-full px-2 py-1 border rounded"
                required
              />
              <input
                type="url"
                value={editFormData.application_link || ""}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    application_link: e.target.value,
                  })
                }
                className="w-full px-2 py-1 border rounded"
                placeholder="Application Link"
              />
              <textarea
                value={editFormData.notes || ""}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, notes: e.target.value })
                }
                className="w-full px-2 py-1 border rounded"
                placeholder="Notes"
              />
              <input
                type="date"
                value={editFormData.follow_up_date || ""}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    follow_up_date: e.target.value,
                  })
                }
                className="w-full px-2 py-1 border rounded"
                placeholder="Follow Up Date"
              />

              <div className="flex gap-2">
                <button type="submit" className="text-blue-500 hover:underline">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingJobId(null);
                    setEditFormData({});
                  }}
                  className="text-red-500 hover:underline"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div
              key={job.id}
              className="bg-gray-100 dark:bg-gray-700 p-3 rounded shadow cursor-pointer"
              onClick={() =>
                setExpandedJobId(expandedJobId === job.id ? null : job.id)
              }
            >
              <h3 className="font-semibold">{job.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                {job.company}
              </p>
              <p className="text-xs text-gray-400">
                Applied Date{job.applied_date}
              </p>

              {/* Expanded View */}
              {expandedJobId === job.id && editingJobId !== job.id && (
                <div className="mt-2 text-sm space-y-1">
                  {job.application_link && (
                    <p>
                      <strong>Link:</strong>{" "}
                      <a
                        href={job.application_link}
                        className="text-blue-500 underline"
                      >
                        {job.application_link}
                      </a>
                    </p>
                  )}
                  {job.notes && (
                    <p>
                      <strong>Notes:</strong> {job.notes}
                    </p>
                  )}
                  {job.follow_up_date && (
                    <p>
                      <strong>Follow Up:</strong> {job.follow_up_date}
                    </p>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingJobId(job.id);
                      setEditFormData({
                        title: job.title,
                        company: job.company,
                        applied_date: job.applied_date || "",
                        application_link: job.application_link || "",
                        notes: job.notes || "",
                        follow_up_date: job.follow_up_date || "",
                      });
                    }}
                    className="text-blue-500 hover:underline mt-2"
                  >
                    ✎ Edit
                  </button>
                </div>
              )}

              {/* Edit Form */}
              {editingJobId === job.id && (
                <form
                  onSubmit={handleEditSubmit}
                  className="mt-2 bg-gray-200 p-2 rounded text-sm space-y-2"
                >
                  <input
                    type="text"
                    value={editFormData.title}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-2 py-1 border rounded"
                    required
                  />
                  <input
                    type="text"
                    value={editFormData.company}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        company: e.target.value,
                      })
                    }
                    className="w-full px-2 py-1 border rounded"
                    required
                  />
                  <input
                    type="date"
                    value={editFormData.applied_date}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        applied_date: e.target.value,
                      })
                    }
                    className="w-full px-2 py-1 border rounded"
                    required
                  />
                  <input
                    type="text"
                    value={editFormData.application_link}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        application_link: e.target.value,
                      })
                    }
                    className="w-full px-2 py-1 border rounded"
                  />
                  <textarea
                    value={editFormData.notes}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        notes: e.target.value,
                      })
                    }
                    className="w-full px-2 py-1 border rounded"
                    placeholder="Notes"
                  />
                  <input
                    type="date"
                    value={editFormData.follow_up_date}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        follow_up_date: e.target.value,
                      })
                    }
                    className="w-full px-2 py-1 border rounded"
                  />

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="text-blue-500 hover:underline"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="text-red-500 hover:underline"
                      onClick={() => setEditingJobId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )
        )}
      </div>

      {/* Add new job form */}
      {showForm ? (
        <form className="mt-3 space-y-2 text-sm">
          <input
            type="text"
            placeholder="Job Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-2 py-1 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Company"
            value={formData.company}
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
            className="w-full px-2 py-1 border rounded"
            required
          />
          <input
            type="date"
            placeholder="Applied Date"
            value={formData.applied_date}
            onChange={(e) =>
              setFormData({ ...formData, applied_date: e.target.value })
            }
            className="w-full px-2 py-1 border rounded"
            required
          />
          <input
            type="url"
            placeholder="Application Link"
            value={formData.application_link}
            onChange={(e) =>
              setFormData({ ...formData, application_link: e.target.value })
            }
            className="w-full px-2 py-1 border rounded"
          />
          <textarea
            placeholder="Notes"
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            className="w-full px-2 py-1 border rounded"
          />
          <input
            type="date"
            placeholder="Follow Up Date"
            value={formData.follow_up_date}
            onChange={(e) =>
              setFormData({ ...formData, follow_up_date: e.target.value })
            }
            className="w-full px-2 py-1 border rounded"
          />

          <div className="flex gap-2">
            <button
              onClick={(event) => handleAddSubmit(event, id)}
              type="submit"
              className="text-blue-500 hover:underline"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-red-500 hover:underline"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 text-sm text-blue-500 hover:underline text-center"
        >
          + Add Job
        </button>
      )}
    </div>
  );
};
