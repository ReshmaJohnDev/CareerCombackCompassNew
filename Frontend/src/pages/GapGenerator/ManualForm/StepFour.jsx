import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

export default function StepFour() {
  const navigate = useNavigate();
  const { formData, setFormData } = useOutletContext();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Staying Current</h3>

      <div>
        <label className="block mb-1 font-medium">
          How did you stay current in your field during your break?
        </label>
        <textarea
          rows="4"
          className="w-full border rounded p-2"
          placeholder="e.g., completed online courses, attended webinars, volunteered, freelanced, read industry publications..."
          value={formData.stayingCurrent || ""}
          onChange={(e) =>
            setFormData({ ...formData, stayingCurrent: e.target.value })
          }
        />
      </div>

      <div className="bg-green-100 text-green-800 p-3 rounded text-sm">
        Great! Showing how you stayed engaged with your industry demonstrates
        commitment and initiative.
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => navigate("../step-3")}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
        >
          Previous
        </button>

        <button
          onClick={() => navigate("../step-5")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  );
}
