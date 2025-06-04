import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { RootState } from "./store";
import { TUsersResponse } from "@/interfaces/User";
import {
  TLeadByIdResponse,
  LeadParamType,
  TLeadsResponse,
  LeadActions,
} from "@/interfaces/Lead";

const baseUrl = process.env.NEXT_PUBLIC_HOUSECLAY_API_BASE_URL;

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl:
      baseUrl ||
      "http://ec2-3-107-183-183.ap-southeast-2.compute.amazonaws.com:8080/api" ||
      "https://jsonplaceholder.typicode.com",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).admin.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  tagTypes: ["Leads", "LeadDetail"],

  endpoints: (builder) => ({
    // ──────────────── AUTH ────────────────
    login: builder.mutation<string, { username: string; password: string }>({
      query: (data) => ({
        url: "/admin/login",
        method: "POST",
        body: data,
        responseHandler: (response) => response.text(),
      }),
    }),
    register: builder.mutation<
      string,
      { username: string; password: string; name: string }
    >({
      query: (data) => ({
        url: "/admin/register",
        method: "POST",
        body: data,
        responseHandler: (response) => response.text(),
      }),
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/admin/logout",
        method: "POST",
      }),
      invalidatesTags: ["Leads", "LeadDetail"],
    }),

    // ──────────────── USERS ────────────────
    getUsers: builder.query<TUsersResponse, { page: number; size: number }>({
      query: ({ page, size }) => ({
        url: `/admin/users?page=${page}&size=${size}`,
        method: "GET",
      }),
    }),

    // ──────────────── LEADS ────────────────
    getLeads: builder.query<
      TLeadsResponse,
      { type: LeadParamType; page: number; size: number }
    >({
      query: ({ type, page, size }) => ({
        url: `/leads?leadCategory=${type}&page=${page}&size=${size}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "Leads" as const, id: "LIST" },
              ...result.content.map((lead) => ({
                type: "LeadDetail" as const,
                id: lead.leadId,
              })),
            ]
          : [{ type: "Leads" as const, id: "LIST" }],
    }),
    getLeadById: builder.query<TLeadByIdResponse, { id: number }>({
      query: ({ id }) => ({
        url: `/leads/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, { id }) => [
        { type: "LeadDetail" as const, id },
      ],
    }),
    leadStatusUpdate: builder.mutation<
      string,
      { id: number; newStatus: string }
    >({
      query: ({ id, newStatus }) => ({
        url: `/leads/${id}/status`,
        method: "PUT",
        headers: {
          "Content-Type": "text/plain",
        },
        body: newStatus,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "LeadDetail" as const, id },
        { type: "Leads" as const, id: "LIST" },
      ],
    }),
    leadAddComment: builder.mutation<
      string,
      { id: number; newComment: string }
    >({
      query: ({ id, newComment }) => ({
        url: `/leads/${id}/comments`,
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: newComment,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "LeadDetail" as const, id },
        { type: "Leads" as const, id: "LIST" },
      ],
    }),
    checkUser: builder.query<
      { exists: boolean; message: string }, // Response type
      { phoneNo: string } // Query parameter type
    >({
      query: ({ phoneNo }) => `/user/check-user?phoneNo=${phoneNo}`,
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
    propertyAddRent: builder.mutation<
      {
        message: string;
        propertyID: number;
      },
      {
        propertyID: string;
        propertyCategory: string;
        propertyType: string;
        builtUpArea: number;
        facing: string;
        bhkType: string;
        propertyAge: string;
        ownershipType: string;
        floor: number;
        totalFloor: number;
        floorType: string;
        description: string;
        city: string;
        locationOrSocietyName: string;
        landmark: string;
        latitude: number;
        longitude: number;
        rent: number;
        deposit: number;
        maintenanceCharges: number;
        rentNegotiable: boolean;
        availableFrom: string;
        preferredTenants: string[];
        waterSupply: string;
        powerBackup: string;
        furnishing: string;
        parking: boolean;
        nonVegAllowed: boolean;
        amenities: string[];
        images: string[];
        whoWillShowProperty?: string;
        secondaryPhoneNumber?: string;
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
    propertyAddResale: builder.mutation<
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
        floor: number;
        totalFloor: number;
        floorType: string;
        description: string;
        city: string;
        locationOrSocietyName: string;
        landmark: string;
        latitude: number;
        longitude: number;
        price: number;
        availableFrom: string;
        bathrooms: number;
        balcony: number;
        priceNegotiable: boolean;
        underLoan: boolean;
        waterSupply: string;
        powerBackup: string;
        furnishing: string;
        parking: boolean;
        amenities: string[];
        images: string[];
        khataCertificate?: string;
        saleDeed?: boolean;
        propertyTax?: boolean;
        secondaryPhoneNumber?: string;
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
    propertyAddFlatmates: builder.mutation<
      {
        message: string;
        propertyID: number;
      },
      {
        propertyID: string;
        propertyCategory: string;
        builtUpArea: number;
        bhkType: string;
        floor: number;
        totalFloor: number;
        description: string;
        city: string;
        locationOrSocietyName: string;
        landmark: string;
        latitude: number;
        longitude: number;
        rent: number;
        maintenanceCharges: number;
        deposit: number;
        availableFrom: string;
        furnishing: string;
        waterSupply: string;
        powerBackup: string;
        parking: boolean;
        nonVegAllowed: boolean;
        amenities: string[];
        tenantType: string;
        attachedBathroom: boolean;
        bathroomType: string;
        smokingPreference: string;
        drinkingPreference: string;
        images: string[];
        whoWillShowProperty?: string;
        secondaryPhoneNumber?: string;
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
  useGetUsersQuery,
  useGetLeadsQuery,
  useGetLeadByIdQuery,
  useLeadStatusUpdateMutation,
  useLeadAddCommentMutation,
  useCheckUserQuery,
  useLazyCheckUserQuery,
  useLogoutMutation,
  usePresignedUrlsMutation,
  usePropertyAddRentMutation,
  usePropertyAddResaleMutation,
  usePropertyAddFlatmatesMutation,
} = apiSlice;
