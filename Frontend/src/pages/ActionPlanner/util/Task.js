import api from "../../../api";

// Fetch all tasks
export const fetchTasks = async () => {
  const response = await api.get("/tasks/");
  return response.data;
};

// Create a new task
export const createTasks = async (taskData) => {
  const response = await api.post("/tasks/", taskData);
  return response.data;
};

// Fetch one task by ID
export const fetchTaskById = async (taskId) => {
  const response = await api.get(`/tasks/${taskId}`);
  return response.data;
};

//Update task completion status
export const updateTaskStatus = async (taskId, completed) => {
  const payload = {
    completed,
    completed_date: completed ? new Date().toISOString() : null,
  };
  const response = await api.patch(`/tasks/${taskId}/complete`, payload);
  return response.data;
};

//Update subtask completion status
export const updateSubTaskStatus = async (subtaskId, completed) => {
  const payload = {
    completed,
    completed_date: completed ? new Date().toISOString() : null,
  };
  const response = await api.patch(
    `/tasks/subtasks/${subtaskId}/complete`,
    payload
  );
  return response.data;
};

//delete task
export const deleteTask = async (taskId) => {
  const response = await api.delete(`/tasks/${taskId}`);
  return response.data;
};

export const updateTask = async (task) => {
  const response = await api.put(`/tasks/${task.id}`, task);
  return response.data;
};
