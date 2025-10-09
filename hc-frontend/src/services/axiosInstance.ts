// src/services/axiosInstance.ts
import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_HOUSECLAY_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Required for HTTP-only cookies
});

export default axiosInstance;

// Add a response interceptor to handle 401 errors globally on the client
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      if (typeof window !== "undefined") {
        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  },
);
