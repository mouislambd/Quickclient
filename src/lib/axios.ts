import axios from "axios";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach token if present
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("quickserve_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 and capture X-Cache header
api.interceptors.response.use(
  (response) => {
    // Capture X-Cache header if present on response
    const xCache = response.headers["x-cache"];
    if (xCache && typeof window !== "undefined") {
      (response as any).xCache = xCache;
    }
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("quickserve_token");
          localStorage.removeItem("quickserve_user");
          if (window.location.pathname !== "/login") {
            toast.error("Session expired. Please login again.");
            window.location.href = "/login";
          }
        }
      }
    }
    return Promise.reject(error);
  }
);
