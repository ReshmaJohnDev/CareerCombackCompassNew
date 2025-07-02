import React, { useContext } from "react";
import TaskList from "./TaskList";
import Footer from "../Footer";
import { AppContext } from "../../context/AppContext";

export default function ActionPlanner() {
  const { darkMode } = useContext(AppContext);
  return (
    <div>
      <TaskList darkMode={darkMode} />
      <Footer darkMode={darkMode} />
    </div>
  );
}
