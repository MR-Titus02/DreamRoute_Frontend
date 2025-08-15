import api from "axios";

export async function fetchRoadmap(userId) {
  try {
    const res = await api.get(`https://api.dreamroute.edu.lk/api/roadmap/${userId}`);
    return res.data;
  } catch (err) {
    // fallback to generation if not found
    if (err.response?.status === 404) {
      const res = await api.post("https://api.dreamroute.edu.lk/api/roadmap", { userId });
      return res.data;
    } else {
      throw err;
    }
  }
}


export async function fetchProgress(userId) {
  const res = await api.get(`https://api.dreamroute.edu.lk/api/progress/${userId}`);
  return res.data; // Array of { step_id, status }
}

export async function updateProgress({ userId, stepId, status }) {
  await api.post("https://api.dreamroute.edu.lk/api/progress/", { userId, stepId, status });
}