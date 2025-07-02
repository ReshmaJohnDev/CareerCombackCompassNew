import React from "react";

export default function Footer({ darkMode }) {
  return (
    <footer
      className="shadow-inner py-6 text-center"
      style={{
        background: darkMode
          ? "linear-gradient(to top right, #222222, #444444)"
          : "linear-gradient(to top right, #dddddd, #444343)",
        color: darkMode ? "#f0f0f0" : "#222222",
      }}
    >
      <p className="text-sm">
        &copy; {new Date().getFullYear()} Career Comeback. All rights reserved.
      </p>
    </footer>
  );
}
