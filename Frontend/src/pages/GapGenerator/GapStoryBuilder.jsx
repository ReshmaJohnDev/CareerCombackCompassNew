import React, { useState, useEffect, useContext } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import UploadFile from "./UploadFile";
import { AppContext } from "../../context/AppContext";

export default function GapStoryBuilder() {
  const location = useLocation();
  const [resumeSummary, setResumeSummary] = useState("");
  const { gapStoryFormData, setGapStoryFormData, setOverviewData } =
    useContext(AppContext);

  const stepMatch = location.pathname.match(/step-(\d)/);
  const step = stepMatch ? parseInt(stepMatch[1]) : 1;

  const [gapStory, setGapStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Calculate completion percent and update AppContext
  useEffect(() => {
    const { duration, reason, skills, growth, stayingCurrent, motivation } =
      gapStoryFormData;

    let completed = 0;
    if (duration) completed++;
    if (reason) completed++;
    if (skills && skills.length > 0) completed++;
    if (growth) completed++;
    if (stayingCurrent) completed++;
    if (motivation) completed++;

    const percent = Math.round((completed / 6) * 100);

    setOverviewData((prev) => ({
      ...prev,
      gapStory: {
        ...prev.gapStory,
        completionPercent: percent,
      },
    }));
  }, [gapStoryFormData, setOverviewData]);

  return (
    <div className="w-full max-w-7xl mx-auto bg-gradient-to-r from-blue-300 to-gray-200 shadow rounded p-6 flex flex-col min-h-[80vh]">
      <Link
        to="/dashboard/overview"
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        ← Back to Dashboard
      </Link>

      <h2 className="text-2xl font-bold">Gap Story Builder</h2>
      <p className="text-gray-700">
        Transform your career break into a compelling professional narrative
      </p>

      <div>
        <div className="flex justify-between text-sm text-gray-500 mb-1">
          <span>Step {step} of 6</span>
          <span>{Math.round((step / 6) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>
      </div>

      <Outlet
        context={{
          formData: gapStoryFormData,
          setFormData: setGapStoryFormData,
          gapStory,
          setGapStory,
          loading,
          setLoading,
          error,
          setError,
        }}
      />

      <UploadFile />

      {resumeSummary && (
        <div className="mt-6 p-4 bg-gray-100 rounded border border-gray-300">
          <h3 className="text-lg font-semibold mb-2">Resume Summary</h3>
          <p className="text-sm text-gray-800 whitespace-pre-line">
            {resumeSummary}
          </p>
        </div>
      )}
    </div>
  );
}
