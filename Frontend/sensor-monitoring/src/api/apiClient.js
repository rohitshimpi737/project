import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Inject token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Optional: Automatically handle 401s
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Token is invalid or expired. Clearing localStorage.");
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
