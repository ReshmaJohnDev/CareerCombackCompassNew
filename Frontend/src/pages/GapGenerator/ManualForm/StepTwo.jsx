import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

const skillsOptions = [
  "Project Management",
  "Time Management",
  "Crisis Resolution",
  "Digital Marketing",
  "Communication",
  "Leadership",
  "Problem Solving",
  "Adaptability",
  "Organization",
  "Multitasking",
  "Budget Management",
  "Team Coordination",
  "Customer Service",
  "Technology Skills",
  "Creative Thinking",
];

export default function StepTwo() {
  const navigate = useNavigate();
  const { formData, setFormData } = useOutletContext();

  const [customSkill, setCustomSkill] = useState("");

  const toggleSkill = (skill) => {
    const currentSkills = formData.skills || [];
    if (currentSkills.includes(skill)) {
      // Remove skill
      setFormData({
        ...formData,
        skills: currentSkills.filter((s) => s !== skill),
      });
    } else {
      // Add skill
      setFormData({
        ...formData,
        skills: [...currentSkills, skill],
      });
    }
  };

  const addCustomSkill = () => {
    const trimmedSkill = customSkill.trim();
    if (
      trimmedSkill &&
      !(formData.skills || []).includes(trimmedSkill) &&
      !skillsOptions.includes(trimmedSkill)
    ) {
      setFormData({
        ...formData,
        skills: [...(formData.skills || []), trimmedSkill],
      });
      setCustomSkill("");
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">
        Select skills you developed or strengthened during your break:
      </h3>

      <div className="flex flex-wrap gap-3">
        {skillsOptions.map((skill) => (
          <button
            key={skill}
            type="button"
            onClick={() => toggleSkill(skill)}
            className={`px-4 py-2 rounded border ${
              formData.skills?.includes(skill)
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            {skill}
          </button>
        ))}
      </div>

      {/* Custom Skill Input */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Enter a skill not listed above"
          value={customSkill}
          onChange={(e) => setCustomSkill(e.target.value)}
          className="flex-grow border rounded px-3 py-2"
        />
        <button
          type="button"
          onClick={addCustomSkill}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          disabled={!customSkill.trim()}
        >
          Add
        </button>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => navigate("../step-1")}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
        >
          Previous
        </button>

        <button
          onClick={() => navigate("../step-3")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  );
}
