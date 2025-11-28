import axios from "axios";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL || "https://parker-app.onrender.com/api"
    : "http://localhost:5000/api";

console.log("[API] Initializing with base URL:", API_BASE);

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000
});

// Add request interceptor for logging
api.interceptors.request.use(
  config => {
    console.log("[API] Request:", config.method.toUpperCase(), config.url);
    return config;
  },
  error => {
    console.error("[API] Request error:", error);
    return Promise.reject(error);
  }
);

export async function sendAnnounce(payload) {
  console.log("[API] Calling announce with payload:", payload);
  return api.post("/peers/announce", payload);
}

export async function sendHeartbeat(peerId) {
  console.log("[API] Calling heartbeat for peer:", peerId);
  return api.put("/peers/heartbeat", { peerId });
}

export async function search(q) {
  console.log("[API] Calling search with query:", q);
  console.log("[API] Base URL:", api.defaults.baseURL);
  try {
    const result = await api.get("/peers/search", { params: { q } });
    console.log("[API] Search response:", result);
    return result;
  } catch (err) {
    console.error("[API] Search failed:", err.message);
    if (err.response) {
      console.error("[API] Response status:", err.response.status);
      console.error("[API] Response data:", err.response.data);
    } else if (err.request) {
      console.error("[API] No response received, request details:", err.request);
    }
    throw err;
  }
}
