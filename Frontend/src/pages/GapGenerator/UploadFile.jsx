import React, { useState, useContext } from "react";
import { FiUpload } from "react-icons/fi";
import api from "../../api";
import { AppContext } from "../../context/AppContext";
import jsPDF from "jspdf";
import LoadingMessage from "./util/LoadingMessage";

export default function UploadFile() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");
  const [copied, setCopied] = useState(false);
  const { logActivity } = useContext(AppContext);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setError("");
      setSummary("");
    }
  };

  const handleGenerateSummary = async () => {
    if (!file) return;
    setLoading(true);
    const form = new FormData();
    console.log("Appending file:", file);
    form.append("file", file);
    try {
      const response = await api.post("/gap/upload_and_parse_resume", form);

      console.log("after API call, response:", response);
      const generatedSummary =
        response.data.parsed_data || "No summary returned.";
      setSummary(generatedSummary);
      logActivity("Generated a Resume summary fromt the uploaded file");
    } catch (error) {
      console.error("Upload error:", error);
      const backendMessage =
        error.response?.data?.detail || "Error uploading or parsing file";
      setError(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Failed to copy to clipboard.");
    }
  };

  const handleDownloadPDF = () => {
    if (!summary) return;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    doc.setFontSize(14);
    doc.text("Career Gap Story", 10, 20);
    doc.setFontSize(12);

    // Split long text into lines to avoid overflowing the page
    const lines = doc.splitTextToSize(summary, 180); // 180mm width to fit A4 with padding
    doc.text(lines, 10, 30); // Start text at 10mm x, 30mm y

    doc.save("gap-story.pdf");
    logActivity("Downloaded the summary from Uploaded resume PDF");
  };

  return (
    <div className="space-y-4 pt-6 border-t border-gray-200">
      <h3 className="text-lg font-semibold">Upload Resume</h3>
      <p className="text-sm text-gray-600">
        Upload your current resume to get a summary
      </p>
      {/* Upload UI */}
      <label
        htmlFor="resume-upload"
        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500"
      >
        <input
          id="resume-upload"
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={handleFileChange}
        />
        <FiUpload size={24} className="text-gray-500 mb-2" />
        <p className="text-sm text-gray-700 font-medium">
          Click to upload or drag and drop
        </p>
        <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX up to 10MB</p>
      </label>
      {file && (
        <div className="flex items-center justify-between text-sm text-gray-800">
          <span>
            <strong>Selected file:</strong> {file.name}
          </span>
          <button
            className="text-blue-600 hover:underline text-xs ml-4"
            onClick={() => {
              setFile(null);
              setSummary("");
              setError("");
            }}
          >
            Remove
          </button>
        </div>
      )}
      {/* Generate Summary Button */}
      {file && (
        <button
          onClick={handleGenerateSummary}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <span className="loading loading-spinner text-white mr-2"></span>
          ) : (
            "Generate Summary"
          )}
        </button>
      )}
      {loading && <LoadingMessage />}
      {summary && (
        <>
          <div className="mt-6 p-4 bg-gray-100 rounded border border-gray-300">
            <h3 className="text-lg font-semibold mb-2">Resume Summary</h3>
            <textarea
              className="w-full h-40 p-2 border rounded resize-none text-sm text-gray-800"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
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
          </div>
        </>
      )}

      {/* Error */}
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}
