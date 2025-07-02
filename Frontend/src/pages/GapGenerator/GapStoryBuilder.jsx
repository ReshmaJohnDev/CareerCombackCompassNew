import React, { useState } from "react";
import Navbar from "../Navbar";
import { FiDownload, FiEdit } from "react-icons/fi";
import ManualForm from "./ManualForm";
import UploadForm from "./UploadForm";
import Footer from "../Footer";

export default function GapStoryBuilder({ darkMode }) {
  const [mode, setMode] = useState("");
  return (
    <div className="flex flex-col min-h-screen">
      <div
        className={`p-4 flex flex-col items-center min-h-screen transition-colors duration-500 ${
          darkMode
            ? "bg-black text-gray-100"
            : "bg-light-gradient text-gray-900"
        }`}
      >
        <div className="text-center mb-10 animate-fade-in-up">
          <h1 className="text-4xl font-bold mb-2">Career Gap Story Builder</h1>
          <p
            className={`text-sm font-medium mb-1 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Generate a professional, confident summary to explain your career
            gap in interviews or resumes.
          </p>
        </div>
        <div className="flex space-x-4 justify-center mb-8">
          <button
            onClick={() => setMode("manual")}
            className={`btn bg-gray-800  hover:bg-gray-700 ${
              darkMode
                ? "bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 text-black"
                : "bg-gradient-to-r from-gray-700 via-gray-900 to-black text-white"
            }`}
          >
            Fill Manually
          </button>
          <button
            onClick={() => setMode("upload")}
            className={`btn bg-gray-800  hover:bg-gray-700 ${
              darkMode
                ? "bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 text-black"
                : "bg-gradient-to-r from-gray-700 via-gray-900 to-black text-white"
            }`}
          >
            Upload CV
          </button>
        </div>

        {mode === "manual" && <ManualForm />}
        {mode === "upload" && <UploadForm />}
      </div>
      <Footer darkMode={darkMode} />

      <style>{`
              .fade-in {
                opacity: 0;
                animation: fadeIn 0.8s forwards ease-in-out;
              }
              @keyframes fadeIn {
                to {
                  opacity: 1;
                }
              }
            `}</style>
    </div>
  );
}
