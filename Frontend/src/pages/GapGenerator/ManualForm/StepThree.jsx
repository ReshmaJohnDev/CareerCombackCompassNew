import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

export default function StepThree() {
  const navigate = useNavigate();
  const { formData, setFormData } = useOutletContext();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Challenges & Growth</h3>

      <div>
        <label className="block mb-1 font-medium">
          What challenges did you overcome during your break?
        </label>
        <textarea
          rows="4"
          className="w-full border rounded p-2"
          placeholder="e.g., managing multiple responsibilities, learning new technologies, adapting to change..."
          value={formData.challenges || ""}
          onChange={(e) =>
            setFormData({ ...formData, challenges: e.target.value })
          }
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">
          How did you grow personally and professionally during this time?
        </label>
        <textarea
          rows="4"
          className="w-full border rounded p-2"
          placeholder="e.g., developed better work-life balance, improved communication skills, gained new perspectives..."
          value={formData.growth || ""}
          onChange={(e) => setFormData({ ...formData, growth: e.target.value })}
        />
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => navigate("../step-2")}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
        >
          Previous
        </button>

        <button
          onClick={() => navigate("../step-4")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  );
}
