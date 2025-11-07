// src/services/serverApi.ts
import axios from "axios";
import { cache } from "react";

import serverAxiosInstance from "./serverAxiosInstance";

export class ServerAPIService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async fetchWithAuth(endpoint: string, options: any = {}) {
    try {
      const response = await serverAxiosInstance({
        url: endpoint,
        method: options.method || "GET",
        withCredentials: true,
        ...options,
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("error", error);
        throw new Error(
          `API call failed: ${error.response?.statusText || error.message}`,
        );
      }
      throw error;
    }
  }

  static fetchWithoutAuth = cache(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (endpoint: string, options: any = {}) => {
      try {
        const response = await serverAxiosInstance({
          url: endpoint,
          method: options.method || "GET",
          withCredentials: false,
          ...options,
        });

        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new Error(
            `API call failed: ${error.response?.statusText || error.message}`,
          );
        }
        throw error;
      }
    },
  );

  // Property specific methods
  static async getPropertyByID(propertyID: string) {
    return this.fetchWithAuth(`/property/user/${propertyID}`);
  }

  // Public property method (no auth required)
  static async getPublicPropertyByID(propertyID: string) {
    return this.fetchWithoutAuth(`/property/${propertyID}`);
  }

  // Add more API methods as needed
  static async getPropertiesByType(type: string) {
    return this.fetchWithAuth(`/properties/${type}`);
  }
}
