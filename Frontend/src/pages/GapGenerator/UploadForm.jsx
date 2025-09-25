import React, { useEffect, useRef, useState } from "react";
import api from "../../api";
import { generateGapHistoryFromForm } from "./util/generateGenerator";
import { FiDownload, FiEdit } from "react-icons/fi";
import LoadingMessage from "./util/LoadingMessage";

export default function UploadForm({ onCancel }) {
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
    setFile(event.target.files[0]);
    setFormData(null);
    setGapStory("");
    setError("");
  };

  const uploadFileToBackend = async () => {
    if (!file) return;
    setLoading(true);
    console.log("reached this");
    const form = new FormData();
    form.append("file", file);
    try {
      const response = await api.post("/gap/upload_and_parse_resume", form);
      setFormData(response.data.parsed_data);
      setShowUpload(false);
      setShowForm(true);
    } catch (error) {
      const backendMessage =
        error.response?.data?.detail || "Error uploading or parsing file";
      setError(backendMessage);
    } finally {
      setLoading(false);
      setFileToUploadAlert(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
    <main className="w-full text-white px-4 py-10 flex flex-col items-center">
      <section className="w-full max-w-5xl bg-gradient-to-r from-gray-600 to-gray-400 rounded-2xl shadow-lg p-6">
        {/* Cancel button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={onCancel}
            className="btn bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>

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
              disabled={!file}
              onClick={() => setFileToUploadAlert(true)}
              className={`btn rounded-lg font-semibold text-white px-6 py-2 ${
                file
                  ? "bg-gradient-to-r from-gray-600 to-black hover:from-black hover:to-gray cursor-pointer"
                  : "bg-gray-700 cursor-not-allowed opacity-50"
              }`}
            >
              Upload
            </button>
          </div>
        )}

        {file && (
          <p className="mt-2 text-sm text-gray-200">
            Selected File: <strong>{file.name}</strong>
          </p>
        )}

        {showFileToUploadAlert && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <section className="bg-gray-900 p-6 rounded-xl max-w-sm w-full shadow-lg text-white">
              <p className="mb-4">{`Upload the file: ${file.name} ?`}</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={uploadFileToBackend}
                  disabled={loading}
                  className="bg-gray-900 hover:bg-gray-700 px-4 py-2 rounded-lg font-semibold"
                >
                  {loading ? <LoadingMessage /> : "OK"}
                </button>
                <button
                  onClick={() => setFileToUploadAlert(false)}
                  disabled={loading}
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            </section>
          </div>
        )}

        {showForm && formData && (
          <form
            onSubmit={handleGenerateGapHistory}
            className="space-y-4 animate-fade-in mt-6 p-4 bg-gray-800 rounded-lg"
          >
            <h3 className="text-xl font-semibold mb-4 text-white">
              Edit Resume Details
            </h3>
            {Object.entries(formData).map(([key, value]) => (
              <div key={key}>
                <label className="block font-medium capitalize mb-1 text-sm text-gray-300">
                  {key.replace(/_/g, " ")}:
                </label>
                <textarea
                  rows={value?.length > 80 ? 4 : 2}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray placeholder-black-500"
                  value={value}
                  onChange={(e) => handleFieldChange(key, e.target.value)}
                />
              </div>
            ))}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="btn bg-gradient-to-r from-gray-600 to-black hover:from-black hover:to-gray text-white"
              >
                {loading ? (
                  <span className="loading loading-spinner text-white mr-2"></span>
                ) : (
                  "Generate Gap History"
                )}
              </button>
              {loading && <LoadingMessage />}
            </div>
          </form>
        )}

        {showResult && gapStory && (
          <section className="mt-6 p-4 bg-black rounded-lg text-white animate-fade-in">
            <textarea
              className="w-full h-80 bg-black text-white px-4 py-2 border border-gray-300 rounded-lg resize-none"
              value={gapStory}
              readOnly
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={() => {
                  setShowForm(true);
                  setShowResult(false);
                }}
                className="btn flex items-center gap-2 bg-gray-800 hover:bg-gray-700"
              >
                <FiEdit /> Edit Inputs
              </button>
              <button
                onClick={handleDownload}
                className="btn flex items-center gap-2 text-white bg-gray-800 hover:bg-gray-700"
              >
                <FiDownload /> Download
              </button>
            </div>
          </section>
        )}

        {error && (
          <p
            ref={errorRef}
            className="text-red-400 mt-4 text-center font-semibold"
          >
            {error}
          </p>
        )}
      </section>
    </main>
  );
}
