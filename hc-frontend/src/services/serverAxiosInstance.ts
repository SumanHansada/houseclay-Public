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
