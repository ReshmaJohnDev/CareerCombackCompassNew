import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function Footer() {
  const { darkMode } = useContext(AppContext);
  return (
    <footer
      className={`shadow-inner py-4 text-center 
    ${
      darkMode
        ? "bg-gradient-to-r from-gray-900 to-gray-700 text-gray-200"
        : "bg-gradient-to-r from-blue-400 to-gray-700 text-white"
    }`}
    >
      <p className="text-sm">
        &copy; {new Date().getFullYear()} Career Comeback. All rights reserved.
      </p>
    </footer>
  );
}
