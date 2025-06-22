// src/utils/gapGenerator.js

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

  const prompt = `Write a professional and confident career gap summary based on the following info:
- Reason: ${formData.reason}
- Duration: ${formData.duration}
- Activities during the gap: ${formData.activities}
- Skills learned: ${formData.skills}
- Career goals: ${formData.career_goals}
- Past experience: ${formData.past_experience}
- Additional information:${formData.additional_info}`;

  if (prompt.length < 250) {
    setError(
      "Please provide more detailed information (at least 250 characters)."
    );
    setLoading(false);
    return;
  }

  try {
    const res = await fetch("https://api.cohere.ai/v1/summarize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_COHERE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: prompt,
        length: "medium",
        format: "paragraph",
        model: "summarize-xlarge",
        extractiveness: "auto",
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("API Error:", errorData);
      setError(errorData.message || "Unknown API error");
    } else {
      const data = await res.json();
      setGapStory(data.summary || "No summary returned.");
      if (setShowForm) setShowForm(false);
    }
  } catch (error) {
    console.error("Fetch error:", error);
    setError(error.message || "Network error");
  } finally {
    setLoading(false);
  }
}
