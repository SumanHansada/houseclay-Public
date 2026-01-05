// src/services/serverApi.ts
import axios from "axios";
import { cookies } from "next/headers";
import { cache } from "react";

import { BASE_API_URL } from "@/common/constants";

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

  // Property specific methods with Next.js caching
  // Note: This endpoint allows any authenticated user to view property details
  // For owner-only access, use a different endpoint
  static async getPropertyByID(propertyID: string) {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    const cookieHeader = allCookies
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    const headers: Record<string, string> = {};
    if (cookieHeader) {
      headers["Cookie"] = cookieHeader;
    }

    const response = await fetch(
      `${BASE_API_URL}/property/user/get-property/${propertyID}`,
      {
        headers,
        next: {
          revalidate: 60,
          tags: [`property-${propertyID}`],
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch property: ${response.statusText}`);
    }

    return response.json();
  }

  // Public property method (no auth required) with Next.js caching
  static async getPublicPropertyByID(propertyID: string) {
    const response = await fetch(`${BASE_API_URL}/property/${propertyID}`, {
      next: {
        revalidate: 60,
        tags: [`property-${propertyID}`],
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch property: ${response.statusText}`);
    }

    return response.json();
  }

  // Get properties by location (public endpoint, no auth required)
  static async getPropertiesByLocation(params: {
    latitude: number;
    longitude: number;
    propertyCategory: string;
    page?: number;
    size?: number;
    [key: string]: string | number | boolean | string[] | undefined;
  }) {
    const {
      latitude,
      longitude,
      propertyCategory,
      page = 0,
      size = 16,
      ...filters
    } = params;

    const searchParams = new URLSearchParams({
      lat: latitude.toString(),
      lon: longitude.toString(),
      propertyCategory: propertyCategory.toString(),
      page: page.toString(),
      size: size.toString(),
    });

    // Add optional filters
    if (filters.minPrice !== undefined && filters.minPrice !== null)
      searchParams.append("minPrice", filters.minPrice.toString());
    if (filters.maxPrice)
      searchParams.append("maxPrice", filters.maxPrice.toString());
    if (filters.propertyType)
      searchParams.append("propertyType", filters.propertyType.toString());
    if (filters.bhkType)
      searchParams.append("bhkType", filters.bhkType.toString());
    if (filters.tenantType)
      searchParams.append("tenantType", filters.tenantType.toString());
    if (filters.nonVegAllowed !== undefined) {
      searchParams.append(
        "nonVegAllowed",
        filters.nonVegAllowed ? "true" : "false",
      );
    }
    if (filters.roomType)
      searchParams.append("roomType", filters.roomType.toString());
    if (filters.bathroomType)
      searchParams.append("bathroomType", filters.bathroomType.toString());
    if (filters.balconyType)
      searchParams.append("balconyType", filters.balconyType.toString());
    if (filters.preferredTenants)
      searchParams.append(
        "preferredTenants",
        filters.preferredTenants.toString(),
      );
    if (filters.furnishing)
      searchParams.append("furnishing", filters.furnishing.toString());
    if (filters.parking)
      searchParams.append("parking", filters.parking.toString());
    if (
      filters.amenities &&
      Array.isArray(filters.amenities) &&
      filters.amenities.length > 0
    ) {
      searchParams.append("amenities", filters.amenities.join(","));
    }
    if (filters.availability) {
      searchParams.append(
        "propertyAvailability",
        filters.availability.toString(),
      );
    }
    if (filters.exclusive === true) searchParams.append("exclusive", "true");
    if (filters.sortFields)
      searchParams.append("sortFields", filters.sortFields.toString());
    if (filters.sortOrder)
      searchParams.append("sortOrder", filters.sortOrder.toString());

    return this.fetchWithoutAuth(`/property/search?${searchParams.toString()}`);
  }
}
