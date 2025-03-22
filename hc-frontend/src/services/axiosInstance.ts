// src/services/axiosInstance.ts
import axios from "axios";

import { store } from "@/store/store";

const baseUrl = process.env.NEXT_PUBLIC_HOUSECLAY_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: baseUrl || "https://jsonplaceholder.typicode.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
