import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { RootState } from "./store";

const baseUrl = process.env.NEXT_PUBLIC_HOUSECLAY_API_BASE_URL;

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl:
      baseUrl ||
      "http://ec2-3-27-226-168.ap-southeast-2.compute.amazonaws.com:8080/api" ||
      "https://jsonplaceholder.typicode.com",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
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
      query: (data) => ({
        url: "/user/login",
        method: "POST",
        body: data,
        responseHandler: (response) => response.text(), // Convert response to text
      }),
    }),
    register: builder.mutation<
      string, // Response type
      { phoneNo: string; name: string; emailID: string; otpCode: string } // Request body type
    >({
      query: (data) => ({
        url: "/user/register",
        method: "POST",
        body: data,
        responseHandler: (response) => response.text(),
      }),
    }),
    generateOtp: builder.mutation<
      { otpSent: boolean }, // Response type
      { phoneNo: string } // Request body type
    >({
      query: ({ phoneNo }) => ({
        url: `/auth/generate-otp?phoneNo=${phoneNo}`,
        method: "POST",
      }),
    }),
    checkUser: builder.query<
      { exists: boolean; message: string }, // Response type
      { phoneNo: string } // Query parameter type
    >({
      query: ({ phoneNo }) => `/user/check-user?phoneNo=${phoneNo}`,
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
        url: "photo/presigned-urls",
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
      {
        propertyID: string;
        propertyCategory: string;
        builtUpArea: number;
        facing: string;
        bhkType: string;
        ownershipType: string;
        propertyAge: string;
        floor: string;
        totalFloor: string;
        floorType: string;
        description: string;
        city: string;
        location: string;
        landmark: string;
        latitude: number;
        longitude: number;
        images: string[];
        whoWillShowProperty?: string;
        secondaryPhoneNumber?: string;
        khataCertificate?: string;
        saleDeed?: boolean;
        propertyTax?: boolean;
        [key: string]: string | number | boolean | string[] | undefined;
      }
    >({
      query: (data) => ({
        url: "property/add",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
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
} = apiSlice;
