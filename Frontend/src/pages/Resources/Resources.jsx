import React, { useEffect, useState } from "react";
import api from "../../api";

export default function Resources() {
  const [groupedResources, setGroupedResources] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    <div className="w-full max-w-7xl mx-auto bg-gradient-to-r from-blue-300 to-gray-200 shadow rounded p-6 flex flex-col min-h-[80vh]">
      {Object.entries(groupedResources).map(([category, resources]) => (
        <div key={category}>
          <h2 className="text-2xl font-bold mb-4">{category}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((r) => (
              <div
                key={r.id}
                className="border rounded-lg p-4 shadow hover:shadow-lg"
              >
                <h3 className="text-xl font-semibold">{r.title}</h3>
                <p className="text-gray-600 mt-1">{r.short_description}</p>
                {r.location && (
                  <p className="text-sm text-gray-500">{r.location}</p>
                )}
                <a
                  href={r.cta_link}
                  target="_blank"
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
