import axios from "axios";
import { cookies } from "next/headers";

import { BASE_API_URL } from "@/common/constants";

const serverAxiosInstance = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor for server-side
serverAxiosInstance.interceptors.request.use(
  async (config) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default serverAxiosInstance;

// Add a response interceptor to surface 401s distinctly on the server
serverAxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // On the server we cannot redirect directly; let callers decide.
      const unauthorizedError = new Error("UNAUTHORIZED_401");
      // Preserve axios error for debugging while signaling 401 clearly
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (unauthorizedError as any).cause = error;
      throw unauthorizedError;
    }
    return Promise.reject(error);
  },
);
