import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

import { PropertyCategory } from "@/common/enums";
import { FlatmateForm } from "@/interfaces/FlatmateForm";
import { RentForm } from "@/interfaces/RentForm";
import { ResaleForm } from "@/interfaces/ResaleForm";

import { RootState } from "./store";

const baseUrl = process.env.NEXT_PUBLIC_HOUSECLAY_API_BASE_URL;

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl:
      baseUrl ||
      "http://ec2-3-107-183-183.ap-southeast-2.compute.amazonaws.com:8080/api" ||
      "https://jsonplaceholder.typicode.com",
    prepareHeaders: (headers, { getState }) => {
      const token =
        Cookies.get("token") || (getState() as RootState).auth.token;
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
        const phoneNoWithoutCountryCode = data.phoneNo
          .replace(/^\+91/, "")
          .replace(/\D/g, "");
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
        const phoneNoWithoutCountryCode = data.phoneNo
          .replace(/^\+91/, "")
          .replace(/\D/g, "");
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
        const phoneNoWithoutCountryCode = phoneNo
          .replace(/^\+91/, "")
          .replace(/\D/g, "");
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
        const phoneNoWithoutCountryCode = phoneNo
          .replace(/^\+91/, "")
          .replace(/\D/g, "");
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
      Partial<RentForm | ResaleForm | FlatmateForm> & {
        propertyID: string;
        propertyCategory: string;
      }
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
      Partial<RentForm | ResaleForm | FlatmateForm> & {
        propertyID: string;
        propertyCategory: string;
      }
    >({
      query: (data) => ({
        url: `property/user/update`,
        method: "PUT",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    getPropertyById: builder.query<unknown, string>({
      query: (id) => `/property/user/${id}`,
    }),
    getPropertyByIdNoAuth: builder.query<unknown, string>({
      query: (id) => `/property/${id}`,
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
  useGetPropertyByIdQuery,
  useLazyGetPropertyByIdQuery,
  useGetPropertiesByLocationQuery,
  useLazyGetPropertiesByLocationQuery,
  useGenerateLeadMutation,
  useGetPropertyByIdNoAuthQuery,
  useLazyGetPropertyByIdNoAuthQuery,
} = apiSlice;
