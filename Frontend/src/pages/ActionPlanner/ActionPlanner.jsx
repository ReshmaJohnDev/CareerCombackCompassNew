import React from "react";
import TaskList from "./TaskList";
import Footer from "../Footer";

export default function ActionPlanner({ darkMode }) {
  return (
    <div>
      <TaskList darkMode={darkMode} />
      <Footer darkMode={darkMode} />
    </div>
  );
}
