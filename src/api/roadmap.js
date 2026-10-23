import api from "./axios";

export async function fetchRoadmap(userId) {
  try {
    const res = await api.get(`/roadmap/${userId}`);
    return res.data;
  } catch (err) {
    // fallback to generation if not found
    if (err.response?.status === 404) {
      const res = await api.post("/roadmap", { userId });
      return res.data;
    } else {
      throw err;
    }
  }
}


export async function fetchProgress(userId) {
  const res = await api.get(`/progress/${userId}`);
  return res.data; // Array of { step_id, status }
}

export async function updateProgress({ userId, stepId, status }) {
  await api.post("/progress/", { userId, stepId, status });
}