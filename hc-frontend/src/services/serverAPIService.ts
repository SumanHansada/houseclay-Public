// src/services/serverApi.ts
import axios from "axios";
import { cookies } from "next/headers";

import serverAxiosInstance from "./serverAxiosInstance";

export class ServerAPIService {
  private static getBaseUrl() {
    return process.env.NEXT_PUBLIC_HOUSECLAY_API_BASE_URL;
  }

  private static async getAuthHeaders() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    return {
      Authorization: token ? `Bearer ${token}` : "",
    };
  }

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

  // Add more API methods as needed
  static async getPropertiesByType(type: string) {
    return this.fetchWithAuth(`/properties/${type}`);
  }
}
