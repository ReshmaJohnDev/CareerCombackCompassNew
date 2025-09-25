import React, { useContext } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { AppContext } from "../../../context/AppContext";

export default function StepOne() {
  const navigate = useNavigate();
  const { formData, setFormData } = useOutletContext();
  const { gapStoryStepsCompleted, setGapStoryStepsCompleted } =
    useContext(AppContext);

  const markStepCompleteAndNext = () => {
    // Mark step 1 as completed (use 1, 2, 3... consistently)
    if (!gapStoryStepsCompleted.includes(1)) {
      setGapStoryStepsCompleted((prev) => [...new Set([...prev, 1])]);
    }

    navigate("../step-2");
  };

  return (
    <div className="space-y-6">
      {/* Duration */}
      <div>
        <label className="block mb-1 font-medium">
          How long was your career break?
        </label>
        <select
          className="w-full border rounded p-2"
          value={formData?.duration || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, duration: e.target.value }))
          }
        >
          <option value="">Select duration</option>
          <option value="Less than 6 months">Less than 6 months</option>
          <option value="6-12 months">6–12 months</option>
          <option value="1-2 years">1–2 years</option>
          <option value="2+ years">2+ years</option>
          <option value="5+ years">5+ years</option>
          <option value="10+ years">10+ years</option>
        </select>
      </div>

      {/* Reason */}
      <div>
        <label className="block mb-1 font-medium">
          Why did you take a career break?{" "}
          <span className="text-red-500">*</span>
        </label>
        <textarea
          className="w-full border rounded p-2"
          rows="4"
          value={formData?.reason || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, reason: e.target.value }))
          }
          placeholder="e.g., to care for family, pursue education, health reasons..."
        />
      </div>

      {/* Pro Tip */}
      <div className="bg-yellow-100 text-yellow-800 p-3 rounded text-sm">
        <strong>Pro Tip:</strong> Be honest and confident about your reasons.
      </div>

      {/* Next Button */}
      <div className="flex justify-end">
        <button
          onClick={markStepCompleteAndNext}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  );
}
