import React, { useEffect, useState, useContext } from "react";
import api from "../../api";
import { AppContext } from "../../context/AppContext";

export default function Resources() {
  const [groupedResources, setGroupedResources] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { darkMode } = useContext(AppContext);

  // Define dynamic classes outside the return for clarity
  const containerClasses = darkMode
    ? "bg-gray-800 text-gray-100"
    : "bg-gradient-to-r from-blue-300 to-gray-200 text-gray-900";

  const cardClasses = darkMode
    ? "bg-gray-700 border-gray-600 shadow-xl hover:shadow-2xl transition-all duration-300"
    : "bg-white border-gray-200 shadow hover:shadow-lg";

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const response = await api.get("/resources/grouped");
        setGroupedResources(response.data);
      } catch (err) {
        console.error("Failed to fetch Resources:", err);
        setError("Failed to load Resources");
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  return (
    <div
      className={`w-full max-w-7xl mx-auto shadow rounded p-6 flex flex-col min-h-[80vh] transition-colors duration-500 ${containerClasses}`}
    >
      {loading && (
        <p className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
          Loading resources...
        </p>
      )}
      {error && <p className="text-red-500">{error}</p>}
      {Object.entries(groupedResources).map(([category, resources]) => (
        <div key={category}>
          <h2 className="text-2xl font-bold mb-4">{category}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((r) => (
              <div
                key={r.id}
                className={`border rounded-lg p-4 ${cardClasses}`}
              >
                <h3 className="text-xl font-semibold">{r.title}</h3>
                <p
                  className={`mt-1 ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {r.short_description}
                </p>
                {r.location && (
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {r.location}
                  </p>
                )}
                <a
                  href={r.cta_link}
                  target="_blank"
                  rel="noopener noreferrer" //
                  className="mt-3 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  {r.cta_text || "Learn More"}
                </a>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
