// src/pages/StepSix.jsx

import React, { useState, useContext } from "react";
import { useOutletContext } from "react-router-dom";
import { generateGapHistoryFromForm } from "../util/generateGenerator";
import LoadingMessage from "../util/LoadingMessage";
import jsPDF from "jspdf";
import { AppContext } from "../../../context/AppContext";

export default function StepSix() {
  const {
    formData,
    gapStory,
    setGapStory,
    loading,
    setLoading,
    error,
    setError,
  } = useOutletContext();

  const { logActivity } = useContext(AppContext);
  const [copied, setCopied] = useState(false);
  const [originalStory, setOriginalStory] = useState("");

  const handleGenerate = async () => {
    await generateGapHistoryFromForm(
      formData,
      (generated) => {
        setGapStory(generated);
        setOriginalStory(generated); // Store unedited version
      },
      setLoading,
      setError
    );
    logActivity("Generated a gap story");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(gapStory);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Failed to copy to clipboard.");
    }
  };

  const handleDownloadPDF = () => {
    if (!gapStory) return;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    doc.setFontSize(14);
    doc.text("Career Gap Story", 10, 20);
    doc.setFontSize(12);

    // Split long text into lines to avoid overflowing the page
    const lines = doc.splitTextToSize(gapStory, 180); // 180mm width to fit A4 with padding
    doc.text(lines, 10, 30); // Start text at 10mm x, 30mm y

    doc.save("gap-story.pdf");
    logActivity("Downloaded PDF");
  };

  const handleReset = () => {
    setGapStory(originalStory);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Review Your Information</h3>

      <div className="space-y-2 text-gray-800 text-sm">
        <p>
          <strong>Duration:</strong> {formData.duration}
        </p>
        <p>
          <strong>Reason:</strong> {formData.reason}
        </p>
        <p>
          <strong>Skills Gained:</strong> {formData.skills?.join(", ")}
        </p>
        <p>
          <strong>Growth:</strong> {formData.growth}
        </p>
        <p>
          <strong>Staying Current:</strong> {formData.stayingCurrent}
        </p>
        <p>
          <strong>Motivation:</strong> {formData.motivation}
        </p>
      </div>

      <button
        onClick={handleGenerate}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate My Story"}
      </button>

      {loading && <LoadingMessage />}
      {error && <p className="text-red-500">{error}</p>}

      {gapStory && (
        <div className="mt-6 space-y-4">
          <div className="bg-green-50 border border-green-200 p-4 rounded">
            <h4 className="font-bold text-lg mb-2">Your Career Gap Story:</h4>
            <textarea
              className="w-full p-3 text-sm border rounded resize-y min-h-[200px] text-gray-800"
              value={gapStory}
              onChange={(e) => setGapStory(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleCopy}
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
            >
              {copied ? "✅ Copied" : "Copy Story"}
            </button>

            <button
              onClick={handleDownloadPDF}
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
            >
              Download PDF
            </button>

            <button
              onClick={handleReset}
              className="bg-red-100 hover:bg-red-200 px-4 py-2 rounded text-red-700"
            >
              Reset to Original
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
