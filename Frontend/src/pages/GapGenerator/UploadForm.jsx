import React, { useEffect, useRef, useState } from "react";
import Navbar from "../Navbar";
import api from "../../api";
import { generateGapHistoryFromForm } from "./util/generateGenerator";
import { FiDownload, FiEdit } from "react-icons/fi";
import LoadingMessage from "./util/LoadingMessage";

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [showFileToUploadAlert, setFileToUploadAlert] = useState(false);
  const [formData, setFormData] = useState(null);
  const [gapStory, setGapStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showUpload, setShowUpload] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const errorRef = useRef(null);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [error]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setFormData(null);
    setGapStory("");
    setError("");
  };

  const uploadFileToBackend = async () => {
    if (!file) return;
    setLoading(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const response = await api.post("/gap/upload_and_parse_resume", form);
      const data = response.data;
      setFormData(data.parsed_data);
      setShowUpload(false);
      setShowForm(true);
    } catch (error) {
      console.error("Upload failed:", error);
      const backendMessage =
        error.response?.data?.detail || "Error uploading or parsing file";
      setError(backendMessage);
    } finally {
      setLoading(false);
      setFileToUploadAlert(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGenerateGapHistory = async (e) => {
    e.preventDefault();
    if (!formData) return;
    await generateGapHistoryFromForm(
      formData,
      setGapStory,
      setLoading,
      setError
    );
    setShowForm(false);
    setShowResult(true);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([gapStory], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "gap_story.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10 flex flex-col items-center">
      <div className="w-full max-w-5xl bg-gradient-to-r from-gray-600 to-gray-400 rounded-2xl shadow-lg p-6">
        {/* Upload Section */}
        {showUpload && (
          <div className="flex items-center gap-4 mt-4">
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-block px-4 py-2 bg-gradient-to-r from-gray-600 to-black hover:from-black hover:to-gray text-white rounded-lg font-semibold"
            >
              Choose File
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              className={`btn rounded-lg font-semibold text-white px-6 py-2
      ${
        file
          ? "bg-gradient-to-r from-gray-600 to-black hover:from-black hover:to-gray cursor-pointer"
          : "bg-gray-700 cursor-not-allowed opacity-50"
      }`}
              disabled={!file}
              onClick={() => setFileToUploadAlert(true)}
            >
              Upload
            </button>
          </div>
        )}
        {file && (
          <div className="mt-2 text-sm text-gray-200">
            Selected File: <strong>{file.name}</strong>
          </div>
        )}
        {/* Confirmation Dialog */}
        {showFileToUploadAlert && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="bg-gray-900 p-6 rounded-xl max-w-sm w-full shadow-lg text-white">
              <p className="mb-4">{`Upload the file: ${file.name} ?`}</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={uploadFileToBackend}
                  className="bg-gray-900  hover:bg-gray-700 px-4 py-2 rounded-lg font-semibold"
                >
                  {loading ? <LoadingMessage /> : "OK"}
                </button>
                <button
                  onClick={() => setFileToUploadAlert(false)}
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-semibold"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Form Section */}
        {showForm && formData && (
          <form
            onSubmit={handleGenerateGapHistory}
            className="space-y-4 animate-fade-in mt-6 p-4 bg-gray-800 rounded-lg"
          >
            <h3 className="text-xl font-semibold mb-4 text-white">
              Edit Resume Details
            </h3>
            {Object.entries(formData).map(([key, value]) => {
              return (
                <div key={key}>
                  <label className="block font-medium capitalize mb-1 text-sm text-gray-300">
                    {key.replace(/_/g, " ")}:
                  </label>
                  <textarea
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray placeholder-black-500"
                    rows={value?.length > 80 ? 4 : 2}
                    value={value}
                    onChange={(e) => handleFieldChange(key, e.target.value)}
                  />
                </div>
              );
            })}

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="btn bg-gradient-to-r from-gray-600 to-black hover:from-black hover:to-gray text-white"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner text-white mr-2"></span>
                    <LoadingMessage />
                  </>
                ) : (
                  "Generate Gap History"
                )}
              </button>
            </div>
          </form>
        )}

        {/* Result Section */}
        {showResult && gapStory && (
          <div className="mt-6 p-4 bg-black rounded-lg text-white animate-fade-in space-y-4">
            <h3 className="text-xl font-semibold mb-2">
              Generated Gap History
            </h3>
            <textarea
              className="w-full h-80 bg-black text-white px-4 py-2 border border-gray-300 rounded-lg placeholder-black-500 resize-none"
              value={gapStory}
              onChange={(e) => setGapStory(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleDownload}
                className="btn flex items-center gap-2 text-white bg-gray-800 hover:bg-gray-700"
              >
                <FiDownload /> Download
              </button>
              <button
                onClick={() => {
                  setShowForm(true);
                  setShowResult(false);
                }}
                className="btn bg-gray-600 hover:bg-gray-500 text-white flex items-center gap-2"
              >
                <FiEdit /> Edit
              </button>
            </div>
          </div>
        )}

        {/* Error Section */}
        {error && (
          <p
            ref={errorRef}
            className="text-red-400 mt-4 text-center animate-fade-in"
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
