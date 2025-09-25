import api from "../../../api";
export async function generateGapHistoryFromForm(
  formData,
  setGapStory,
  setLoading,
  setError,
  setShowForm = null
) {
  setLoading(true);
  setError(null);
  setGapStory("");
  const prompt = `Write a professional and confident career gap summary based on the following info.

IMPORTANT:
- Output plain text only (no markdown, no bold, no headings).
- Do not include line breaks; return as a single paragraph.
- Write in one to two short paragraphs.
- Keep the tone professional, confident, and forward-looking.
- Do not include the phrase "Career Gap Summary" or any labels.

Info:
- Duration of break: ${formData.duration || "N/A"}
- Reason for the break: ${formData.reason || "N/A"}
- Skills developed or strengthened during the break: ${
    formData.skills?.join(", ") || "N/A"
  }
- Personal and professional growth during the break: ${formData.growth || "N/A"}
- How I stayed current in the industry: ${formData.current || "N/A"}
- Motivation to return to work: ${formData.motivation || "N/A"}
`;
  const cleanedPrompt = prompt.trim();

  if (!cleanedPrompt.trim() || cleanedPrompt.length < 50) {
    // ensure prompt has content
    setError("Please provide more detailed information.");
    setLoading(false);
    return;
  }

  try {
    // Call  backend endpoint
    const formDataObj = new FormData();
    formDataObj.append("text", cleanedPrompt);
    const response = await api.post("/gap/generate_gap_story", formDataObj, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("invoked backend");

    const summary = response.data?.parsed_data || "No summary returned.";
    setGapStory(summary);

    if (setShowForm) setShowForm(false);
  } catch (error) {
    console.error("Backend error:", error);
    setError(
      error.response?.data?.detail ||
        error.message ||
        "Failed to generate gap summary"
    );
  } finally {
    setLoading(false);
  }
}
