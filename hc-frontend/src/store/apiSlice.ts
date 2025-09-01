import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

import { PropertyCategory } from "@/common/enums";
import { sanitizePhoneNumber } from "@/common/utils";
import { PropertyForm } from "@/interfaces/PropertyForm";

const baseUrl = process.env.NEXT_PUBLIC_HOUSECLAY_API_BASE_URL;

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl:
      baseUrl ||
      "http://ec2-13-201-0-200.ap-south-1.compute.amazonaws.com:8080/api/" ||
      "https://jsonplaceholder.typicode.com",
    prepareHeaders: (headers, { getState }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const token = Cookies.get("token") || (getState() as any).auth?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<
      string, // Response type
      { phoneNo: string; otpCode: string } // Request body type
    >({
      query: (data) => {
        const phoneNoWithoutCountryCode = sanitizePhoneNumber(data.phoneNo);
        return {
          url: "/user/login",
          method: "POST",
          body: { ...data, phoneNo: phoneNoWithoutCountryCode },
          responseHandler: (response) => response.text(), // Convert response to text
        };
      },
    }),
    register: builder.mutation<
      string, // Response type
      { phoneNo: string; name: string; emailID: string; otpCode: string } // Request body type
    >({
      query: (data) => {
        const phoneNoWithoutCountryCode = sanitizePhoneNumber(data.phoneNo);
        return {
          url: "/user/register",
          method: "POST",
          body: { ...data, phoneNo: phoneNoWithoutCountryCode },
          responseHandler: (response) => response.text(),
        };
      },
    }),
    generateOtp: builder.mutation<
      { otpSent: boolean }, // Response type
      { phoneNo: string } // Request body type
    >({
      query: ({ phoneNo }) => {
        const phoneNoWithoutCountryCode = sanitizePhoneNumber(phoneNo);
        return {
          url: `/auth/generate-otp?phoneNo=${phoneNoWithoutCountryCode}`,
          method: "POST",
        };
      },
    }),
    checkUser: builder.query<
      { exists: boolean; message: string }, // Response type
      { phoneNo: string } // Query parameter type
    >({
      query: ({ phoneNo }) => {
        const phoneNoWithoutCountryCode = sanitizePhoneNumber(phoneNo);
        return {
          url: `/user/check-user?phoneNo=${phoneNoWithoutCountryCode}`,
          method: "GET",
        };
      },
    }),
    logout: builder.mutation<
      { message: string }, // Response type
      void // No request body
    >({
      query: () => ({
        url: "/user/logout",
        method: "POST",
      }),
    }),
    presignedUrls: builder.mutation<
      {
        propertyID: string;
        fileURLMap: Record<string, string>;
      }, // Response type
      { fileMap: Record<string, string> } // Request body type
    >({
      query: (data) => ({
        url: "photo/user/presigned-urls",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    propertyAdd: builder.mutation<
      {
        message: string;
        propertyID: number;
      },
      PropertyForm
    >({
      query: (data) => ({
        url: "property/user/add",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    propertyUpdate: builder.mutation<
      { message: string; propertyID: number },
      Partial<PropertyForm> & { propertyID: string }
    >({
      query: (data) => ({
        url: "property/user/update",
        method: "PUT",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    getMyPropertyById: builder.query<unknown, string>({
      query: (id) => `/property/user/${id}`,
    }),

    getPublicPropertyById: builder.query<unknown, string>({
      query: (id) => ({
        url: `/property/${id}`,
        headers: {
          // Explicitly exclude Authorization header for public endpoint
        },
      }),
    }),

    getPropertiesByLocation: builder.query<
      unknown,
      Record<string, string | number | boolean | string[] | PropertyCategory>
    >({
      query: (params) => {
        const { latitude, longitude, propertyCategory, ...filters } = params;
        const searchParams = new URLSearchParams({
          lat: latitude.toString(),
          lon: longitude.toString(),
          propertyCategory: propertyCategory.toString(),
        });

        // Add optional filters
        if (filters.propertyType)
          searchParams.append("propertyType", filters.propertyType.toString());
        if (filters.bhkType)
          searchParams.append("bhkType", filters.bhkType.toString());
        if (filters.preferredTenant)
          searchParams.append(
            "preferredTenant",
            filters.preferredTenant.toString(),
          );
        if (filters.furnishing)
          searchParams.append("furnishing", filters.furnishing.toString());
        if (filters.parking !== undefined)
          searchParams.append("parking", filters.parking.toString());
        if (
          filters.amenities &&
          Array.isArray(filters.amenities) &&
          filters.amenities.length > 0
        ) {
          searchParams.append("amenities", filters.amenities.join(","));
        }

        return `/property/search?${searchParams.toString()}`;
      },
    }),
    generateLead: builder.mutation<
      { message: string },
      { leadCategory: string }
    >({
      query: ({ leadCategory }) => ({
        url: `/user/generate-lead?leadCategory=${leadCategory}`,
        method: "POST",
      }),
    }),
    shortlistProperty: builder.mutation<
      { message: string },
      { propertyId: string }
    >({
      query: ({ propertyId }) => ({
        url: `/property/user/shortlist-property/${propertyId}`,
        method: "POST",
      }),
    }),
    removeShortlistedProperty: builder.mutation<
      { message: string },
      { propertyId: string }
    >({
      query: ({ propertyId }) => ({
        url: `/property/user/remove-shortlisted-property/${propertyId}`,
        method: "DELETE",
      }),
    }),
    getShortlistedProperties: builder.query<
      { shortlistedProperties: Array<{ propertyId: string }> },
      void
    >({
      query: () => `/property/user/shortlisted-properties`,
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGenerateOtpMutation,
  useCheckUserQuery,
  useLazyCheckUserQuery,
  useLogoutMutation,
  usePresignedUrlsMutation,
  usePropertyAddMutation,
  usePropertyUpdateMutation,
  useGetMyPropertyByIdQuery,
  useLazyGetMyPropertyByIdQuery,
  useGetPropertiesByLocationQuery,
  useLazyGetPropertiesByLocationQuery,
  useGenerateLeadMutation,
  useGetPublicPropertyByIdQuery,
  useLazyGetPublicPropertyByIdQuery,
  useShortlistPropertyMutation,
  useRemoveShortlistedPropertyMutation,
  useGetShortlistedPropertiesQuery,
  useLazyGetShortlistedPropertiesQuery,
} = apiSlice;
