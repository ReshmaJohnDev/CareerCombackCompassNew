import React, { useState, useContext } from "react";
import { FiDownload, FiEdit } from "react-icons/fi";
import { generateGapHistoryFromForm } from "./util/generateGenerator";
import LoadingMessage from "./util/LoadingMessage";
import { AppContext } from "../../context/AppContext";

export default function ManualForm({ onUploadClick }) {
  const { darkMode } = useContext(AppContext);
  const [showForm, setShowForm] = useState(true);
  const [formData, setFormData] = useState({
    reason: "",
    duration: "",
    activities: "",
    skills: "",
    career_goals: "",
    past_experience: "",
    additional_info: "",
  });
  const [gapStory, setGapStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateGapHistory = (event) => {
    event.preventDefault();
    generateGapHistoryFromForm(
      formData,
      setGapStory,
      setLoading,
      setError,
      setShowForm
    );
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([gapStory], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "gap_story.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <main className="w-full text-white px-4 py-10 flex flex-col items-center">
      <section className="w-full max-w-3xl bg-gradient-to-r from-gray-600 to-gray-400 rounded-2xl shadow-lg p-6">
        {showForm ? (
          <form
            onSubmit={handleGenerateGapHistory}
            className="space-y-4 animate-fade-in"
          >
            <input
              type="text"
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-black placeholder-black-500"
              placeholder="Reason for career gap"
              required
            />
            <input
              type="text"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-black placeholder-black-500"
              placeholder="Duration of the gap"
              required
            />
            <textarea
              value={formData.activities}
              onChange={(e) =>
                setFormData({ ...formData, activities: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-black placeholder-black-500"
              placeholder="Activities during the gap"
              required
            />
            <textarea
              value={formData.skills}
              onChange={(e) =>
                setFormData({ ...formData, skills: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-black placeholder-black-500"
              placeholder="Skills learned"
              required
            />
            <textarea
              value={formData.career_goals}
              onChange={(e) =>
                setFormData({ ...formData, career_goals: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-black placeholder-black-500"
              placeholder="Career goals"
              required
            />
            <textarea
              value={formData.past_experience}
              onChange={(e) =>
                setFormData({ ...formData, past_experience: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-black placeholder-black-500"
              placeholder="Past experiences"
              required
            />
            <textarea
              value={formData.additional_info}
              onChange={(e) =>
                setFormData({ ...formData, additional_info: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-black placeholder-black-500"
              placeholder="Additional information if any"
              required
            />

            <div className="flex justify-center space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="btn bg-gradient-to-r from-gray-600 to-black hover:from-black hover:to-gray text-white"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner text-white mr-2"></span>
                    <LoadingMessage />
                  </>
                ) : (
                  "Generate Gap History"
                )}
              </button>

              <button
                type="button"
                onClick={onUploadClick}
                className={`btn ${
                  darkMode
                    ? "bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 text-black"
                    : "bg-gradient-to-r from-gray-700 via-gray-900 to-black text-white"
                }`}
              >
                Upload CV
              </button>
            </div>

            {error && <p className="text-red-200 text-center mt-2">{error}</p>}
          </form>
        ) : (
          <>
            <textarea
              className="w-full h-80 bg-black text-white px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-300 resize-none"
              value={gapStory}
              onChange={(e) => setGapStory(e.target.value)}
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowForm(true)}
                className="btn flex items-center gap-2 bg-gray-800 text-white hover:bg-gray-700"
              >
                <FiEdit /> Edit Inputs
              </button>
              <button
                onClick={handleDownload}
                className="btn flex items-center gap-2 text-white bg-gray-800 hover:bg-gray-700"
              >
                <FiDownload /> Download
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
