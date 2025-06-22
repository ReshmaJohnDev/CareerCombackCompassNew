import React, { useState } from "react";
import Navbar from "../Navbar";
import { FiDownload, FiEdit } from "react-icons/fi";
import ManualForm from "./ManualForm";
import UploadForm from "./UploadForm";

export default function GapStoryBuilder() {
  const [mode, setMode] = useState("");
  return (
    <div className="min-h-screen bg-black text-white px-4 py-10 flex flex-col items-center">
      <div className="text-center mb-10 animate-fade-in-up">
        <h1 className="text-4xl font-bold mb-2">Career Gap Story Builder</h1>
        <p className="text-gray-300 max-w-xl mx-auto">
          Generate a professional, confident summary to explain your career gap
          in interviews or resumes.
        </p>
      </div>
      <div className="flex space-x-4 justify-center mb-8">
        <button
          onClick={() => setMode("manual")}
          className="btn bg-gray-800 text-white hover:bg-gray-700"
        >
          Fill Manually
        </button>
        <button
          onClick={() => setMode("upload")}
          className="btn bg-gray-800 text-white hover:bg-gray-700"
        >
          Upload CV
        </button>
      </div>

      {mode === "manual" && <ManualForm />}
      {mode === "upload" && <UploadForm />}
    </div>
  );
}
