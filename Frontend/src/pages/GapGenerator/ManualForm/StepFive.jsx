import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

export default function StepFive() {
  const navigate = useNavigate();
  const { formData, setFormData } = useOutletContext();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Motivation to Return</h3>

      <div>
        <label className="block mb-1 font-medium">
          What motivates you to return to work now?
        </label>
        <textarea
          rows="4"
          className="w-full border rounded p-2"
          placeholder="e.g., Ready for new challenges, excited to apply new skills, children are more independent now, eager to apply new skills, financial goals ..."
          value={formData.motivation || ""}
          onChange={(e) =>
            setFormData({ ...formData, motivation: e.target.value })
          }
        />
      </div>

      <div className="bg-blue-100 text-blue-800 p-3 rounded text-sm">
        Employers appreciate clarity and purpose. Share your genuine motivation
        to rejoin the workforce!
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => navigate("../step-4")}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
        >
          Previous
        </button>
        <button
          onClick={() => navigate("../step-6")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  );
}
