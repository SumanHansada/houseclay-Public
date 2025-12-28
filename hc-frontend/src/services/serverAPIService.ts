// src/services/serverApi.ts
import axios from "axios";
import { cookies } from "next/headers";
import { cache } from "react";

import serverAxiosInstance from "./serverAxiosInstance";

export class ServerAPIService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async fetchWithAuth(endpoint: string, options: any = {}) {
    const cookieStore = await cookies();

    // Forward ALL cookies from the request to the backend
    // This ensures the backend receives cookies in the same format it expects
    const allCookies = cookieStore.getAll();
    const cookieHeader = allCookies
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    // Debug logging (remove in production if needed)
    if (process.env.NODE_ENV === "development") {
      console.log("Server API Request:", {
        endpoint,
        cookieCount: allCookies.length,
        hasToken: !!cookieStore.get("token"),
        cookieNames: allCookies.map((c) => c.name),
      });
    }

    const headers: Record<string, string> = {
      ...options.headers,
    };

    // Set Cookie header for server-to-server requests
    // Note: withCredentials doesn't work server-side, so we manually set the Cookie header
    if (cookieHeader) {
      headers["Cookie"] = cookieHeader;
    } else {
      console.warn("No cookies found for server-side request to:", endpoint);
    }

    try {
      const response = await serverAxiosInstance({
        url: endpoint,
        method: options.method || "GET",
        // Remove withCredentials - it doesn't work for server-side requests
        headers: headers,
        ...options,
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const statusText = error.response?.statusText;
        const data = error.response?.data;

        console.error("Server API Error:", {
          endpoint,
          status,
          statusText,
          data,
          headers: error.config?.headers,
        });

        // Provide more detailed error messages
        if (status === 403) {
          const errorMessage =
            typeof data === "object" && data !== null && "error" in data
              ? data.error
              : "Forbidden: Access denied";
          throw new Error(`403 Forbidden: ${errorMessage}`);
        }

        if (status === 401) {
          throw new Error(
            "401 Unauthorized: Missing or invalid authentication",
          );
        }

        throw new Error(
          `API call failed: ${statusText || error.message} (${status || "unknown status"})`,
        );
      }
      throw error;
    }
  }

  static fetchWithoutAuth = cache(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (endpoint: string, options: any = {}) => {
      // Debug logging (remove in production if needed)
      if (process.env.NODE_ENV === "development") {
        console.log("Server API Request (Public):", {
          endpoint,
          method: options.method || "GET",
        });
      }

      const headers: Record<string, string> = {
        ...options.headers,
      };

      try {
        const response = await serverAxiosInstance({
          url: endpoint,
          method: options.method || "GET",
          headers: headers,
          ...options,
        });

        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          const statusText = error.response?.statusText;
          const data = error.response?.data;

          console.error("Server API Error (Public):", {
            endpoint,
            status,
            statusText,
            data,
            headers: error.config?.headers,
          });

          // Provide more detailed error messages
          if (status === 403) {
            const errorMessage =
              typeof data === "object" && data !== null && "error" in data
                ? data.error
                : "Forbidden: Access denied";
            throw new Error(`403 Forbidden: ${errorMessage}`);
          }

          if (status === 401) {
            throw new Error(
              "401 Unauthorized: Missing or invalid authentication",
            );
          }

          throw new Error(
            `API call failed: ${statusText || error.message} (${status || "unknown status"})`,
          );
        }
        throw error;
      }
    },
  );

  // Property specific methods
  // Note: This endpoint allows any authenticated user to view property details
  // For owner-only access, use a different endpoint
  static async getPropertyByID(propertyID: string) {
    return this.fetchWithAuth(`/property/user/get-property/${propertyID}`);
  }

  // Public property method (no auth required)
  static async getPublicPropertyByID(propertyID: string) {
    return this.fetchWithoutAuth(`/property/${propertyID}`);
  }
}
