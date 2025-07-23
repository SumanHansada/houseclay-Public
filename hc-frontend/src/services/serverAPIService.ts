// src/services/serverApi.ts
import axios from "axios";

import serverAxiosInstance from "./serverAxiosInstance";

export class ServerAPIService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async fetchWithAuth(endpoint: string, options: any = {}) {
    try {
      const response = await serverAxiosInstance({
        url: endpoint,
        method: options.method || "GET",
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
  }

  // Property specific methods
  static async getPropertyByID(propertyID: string) {
    return this.fetchWithAuth(`/property/user/${propertyID}`);
  }

  // Public property method (no auth required)
  static async getPublicPropertyByID(propertyID: string) {
    try {
      const response = await serverAxiosInstance({
        url: `/property/${propertyID}`,
        method: "GET",
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
  }

  // Add more API methods as needed
  static async getPropertiesByType(type: string) {
    return this.fetchWithAuth(`/properties/${type}`);
  }
}
