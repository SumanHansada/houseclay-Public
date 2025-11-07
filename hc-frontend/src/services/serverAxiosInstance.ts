import axios from "axios";
import { cookies } from "next/headers";

import { BASE_API_URL } from "@/common/constants";

const serverAxiosInstance = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default serverAxiosInstance;

// Add a request interceptor to log URL, add cookies, and generate cURL
serverAxiosInstance.interceptors.request.use(
  async (config) => {
    const fullUrl = `${config.baseURL || ""}${config.url || ""}`;

    // Read cookies from Next.js only when credentials are required
    let cookieHeader = "";
    if (config.withCredentials) {
      try {
        const cookieStore = await cookies();
        const allCookies = cookieStore.getAll();

        if (allCookies.length > 0) {
          cookieHeader = allCookies
            .map((cookie) => `${cookie.name}=${cookie.value}`)
            .join("; ");

          // Add Cookie header to the request
          if (config.headers) {
            config.headers.Cookie = cookieHeader;
          }
        }
      } catch (error) {
        // cookies() only works in Server Components/Actions
        // If called from client-side, this will fail (which is expected)
        console.error(
          "Note: cookies() not available in this context (client-side?)",
          error,
        );
      }
    }

    console.log("=== API Request Debug ===");
    console.log("Full URL:", fullUrl);
    console.log("Method:", config.method?.toUpperCase());
    console.log("Cookies:", cookieHeader || "(none)");
    console.log("Headers:", config.headers);
    console.log("\n=== cURL Command ===");
    console.log("========================\n");
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

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
