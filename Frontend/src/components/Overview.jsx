import React, { useState, useEffect, useContext } from "react";
import { formatDistanceToNow } from "date-fns";
import { AppContext } from "../context/AppContext";

export default function Overview() {
  const [tab, setTab] = useState("summary");
  const [recentActivity, setRecentActivity] = useState([]);
  const { overviewData } = useContext(AppContext);

  const {
    gapStory = {},
    actionPlanner = {},
    jobTracker = {},
    nextMilestone = {},
  } = overviewData || {};

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recentActivity")) || [];

    const normalized = stored
      .filter((item) => item?.message)
      .map((item) => {
        const rawTimestamp = item.timestamp || item.time || null;
        const validDate = rawTimestamp ? new Date(rawTimestamp) : null;
        const isValid = validDate instanceof Date && !isNaN(validDate);

        return {
          message: item.message,
          timestamp: isValid ? validDate : null,
        };
      });

    setRecentActivity(normalized);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto bg-gradient-to-r from-blue-300 to-gray-200 shadow rounded p-6 flex flex-col min-h-[80vh]">
      <h2 className="text-2xl font-bold">Overview</h2>

      {/* Tab buttons */}
      <div className="flex space-x-4">
        <button
          onClick={() => setTab("summary")}
          className={`px-3 py-2 rounded ${
            tab === "summary" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Summary
        </button>
        <button
          onClick={() => setTab("activity")}
          className={`px-3 py-2 rounded ${
            tab === "activity" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Recent Activity
        </button>
      </div>

      {/* Summary View */}
      {tab === "summary" && (
        <div className="grid md:grid-cols-2 gap-4">
          {/* Gap Story */}
          <div className="bg-white rounded-xl shadow p-4 border">
            <h3 className="text-lg font-semibold text-blue-600 mb-1">
              Gap Story
            </h3>
            <p>
              Completion:{" "}
              <strong>{Math.round(gapStory.completionPercent || 0)}%</strong>
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-4 border">
            <h3 className="text-lg font-semibold text-purple-600 mb-1">
              Applications
            </h3>
            <p>
              Sent: <strong>{jobTracker.totalSent || 0}</strong>
            </p>
            <p>
              Responses: <strong>{jobTracker.responses || 0}</strong>
            </p>
          </div>

          {/* Next Milestone */}
          <div className="bg-white rounded-xl shadow p-4 border">
            <h3 className="text-lg font-semibold text-pink-600 mb-1">
              Next Milestone
            </h3>
            {nextMilestone?.title ? (
              <>
                <p className="font-medium">{nextMilestone.title}</p>
                <p className="text-sm text-gray-500">
                  Due in {nextMilestone.dueIn}
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-500">No upcoming milestones</p>
            )}
          </div>
        </div>
      )}

      {/* Activity View */}
      {tab === "activity" && (
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-gray-500">No recent activity yet.</p>
          ) : (
            <ul className="space-y-2 text-sm text-gray-700">
              {recentActivity.map((item, index) => (
                <li key={index} className="flex justify-between">
                  <span>{item.message}</span>
                  <span className="text-xs text-gray-400">
                    {item.timestamp
                      ? formatDistanceToNow(item.timestamp, {
                          addSuffix: true,
                        })
                      : "unknown time"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
