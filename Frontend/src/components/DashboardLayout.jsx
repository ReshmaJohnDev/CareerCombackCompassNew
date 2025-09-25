import React from "react";
import Navbar from "../pages/Navbar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* Background layer — add gradient similar to landing */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-gray-700 z-0" />

      {/* Optional dark overlay if you want a frosted effect */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md z-0" />

      {/* Content layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
