import axios from "axios";
import { cookies } from "next/headers";

const baseUrl = process.env.NEXT_PUBLIC_HOUSECLAY_API_BASE_URL;

const serverAxiosInstance = axios.create({
  baseURL:
    baseUrl ||
    "http://ec2-3-107-183-183.ap-southeast-2.compute.amazonaws.com:8080/api",
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
