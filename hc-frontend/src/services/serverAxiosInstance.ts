import axios from "axios";

import { BASE_API_URL } from "@/common/constants";

const serverAxiosInstance = axios.create({
  baseURL: BASE_API_URL,
});

export default serverAxiosInstance;

// Add a request interceptor to log URL, add cookies, and generate cURL
serverAxiosInstance.interceptors.request.use(
  async (config) => {
    const fullUrl = `${config.baseURL || ""}${config.url || ""}`;
    const method = config.method?.toUpperCase() || "GET";

    // Build cURL command
    let curlCommand = `curl -X ${method}`;

    // Add headers
    if (config.headers) {
      Object.entries(config.headers).forEach(([key, value]) => {
        if (value && typeof value === "string") {
          curlCommand += ` \\\n  -H "${key}: ${value}"`;
        }
      });
    }

    // Add body for POST/PUT/PATCH requests
    if (config.data && ["POST", "PUT", "PATCH"].includes(method)) {
      const body =
        typeof config.data === "string"
          ? config.data
          : JSON.stringify(config.data);
      curlCommand += ` \\\n  -d '${body}'`;
    }

    // Add URL
    curlCommand += ` \\\n  "${fullUrl}"`;

    console.log("=== API Request Debug ===");
    console.log("Full URL:", fullUrl);
    console.log("Method:", method);
    console.log("Headers:", config.headers);
    console.log("\n=== cURL Command ===");
    console.log(curlCommand);
    console.log("========================\n");
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add a response interceptor - errors are handled in serverAPIService
// No transformation needed here, let serverAPIService handle all error cases
serverAxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Pass through errors unchanged - serverAPIService will handle them
    return Promise.reject(error);
  },
);
