import { createApi } from "@reduxjs/toolkit/query/react";

import { LeadQueryParamEnum } from "@/common/enums";
import {
  AddPropertyRequest,
  GetAllLeadsResponse,
  GetAllPropertiesResponse,
  GetAllUsersResponse,
  GetLeadByIdResponse,
  GetPropertiesToReverifyResponse,
  GetPropertiesToVerifyResponse,
  GetPropertyByIdResponse,
  GetUserByPhoneNoResponse,
} from "@/interfaces/api";

import { baseQueryWithAuth } from "./baseQueryWithAuth";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
  tagTypes: [
    "UserDetail",
    "Leads",
    "LeadDetail",
    "Properties",
    "PropertyDetail",
  ],

  endpoints: (builder) => ({
    // ──────────────── AUTH ────────────────
    login: builder.mutation<string, { username: string; password: string }>({
      query: (payload) => ({
        url: "/admin/login",
        method: "POST",
        body: payload,
        responseHandler: (response) => response.text(),
      }),
    }),
    register: builder.mutation<
      string, // Response Type
      { username: string; password: string; name: string } // Request Body Type
    >({
      query: (payload) => ({
        url: "/admin/register",
        method: "POST",
        body: payload,
        responseHandler: (response) => response.text(),
      }),
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/admin/logout",
        method: "POST",
      }),
      invalidatesTags: [
        "UserDetail",
        "Leads",
        "LeadDetail",
        "Properties",
        "PropertyDetail",
      ],
    }),

    // ──────────────── USERS ────────────────
    getUsers: builder.query<
      GetAllUsersResponse,
      { page: number; size: number }
    >({
      query: ({ page, size }) => ({
        url: `/admin/users?page=${page}&size=${size}`,
        method: "GET",
      }),
    }),

    getUserByPhoneNo: builder.query<
      GetUserByPhoneNoResponse,
      { phoneNo: string }
    >({
      query: ({ phoneNo }) => ({
        url: `/admin/search-user?phoneNo=${phoneNo}`,
        method: "GET",
      }),
      providesTags: (result, error, { phoneNo }) => [
        { type: "UserDetail", id: phoneNo },
      ],
    }),

    blacklistUser: builder.mutation<
      {
        blacklisted: boolean;
        message: string;
        userId: string;
      },
      { userPhoneNo: string; comment: string }
    >({
      query: ({ userPhoneNo, comment }) => ({
        url: `/admin/blacklist-user?phoneNo=${userPhoneNo}&comment=${comment}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    activateUser: builder.mutation<
      {
        blacklisted: boolean;
        message: string;
        userId: string;
      },
      { userPhoneNo: string; comment: string }
    >({
      query: ({ userPhoneNo, comment }) => ({
        url: `/admin/activate-user?phoneNo=${userPhoneNo}&comment=${comment}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    tagBroker: builder.mutation<
      {
        blacklisted: boolean;
        message: string;
        userId: string;
      },
      { userPhoneNo: string; comment: string }
    >({
      query: ({ userPhoneNo, comment }) => ({
        url: `/admin/tag-broker?phoneNo=${userPhoneNo}&comment=${comment}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    // ──────────────── LEADS ────────────────
    getLeads: builder.query<
      GetAllLeadsResponse,
      { type: LeadQueryParamEnum; page: number; size: number }
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

    getLeadById: builder.query<GetLeadByIdResponse, { id: number }>({
      query: ({ id }) => ({
        url: `/leads/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, { id }) => [{ type: "LeadDetail" as const, id }],
    }),

    leadStatusUpdate: builder.mutation<
      string,
      { id: number; newStatus: string }
    >({
      query: ({ id, newStatus }) => ({
        url: `/leads/${id}/status`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: newStatus,
      }),
      invalidatesTags: (_, __, { id }) => [
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
      invalidatesTags: (_, __, { id }) => [
        { type: "LeadDetail" as const, id },
        { type: "Leads" as const, id: "LIST" },
      ],
    }),

    // ──────────────── PHOTO ────────────────
    presignedUrls: builder.mutation<
      {
        propertyID: string;
        fileURLMap: Record<string, string>;
      },
      { fileMap: Record<string, string> }
    >({
      query: (payload) => ({
        url: "/photo/admin/presigned-urls",
        method: "POST",
        body: payload,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    // ──────────────── PROPERTY ────────────────
    propertyAdd: builder.mutation<
      {
        message: string;
        propertyID: number;
      },
      {
        payload: AddPropertyRequest;
        userPhoneNo: string;
      }
    >({
      query: ({ userPhoneNo, payload }) => ({
        url: `property/admin/add?phoneNo=${userPhoneNo}`,
        method: "POST",
        body: payload,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (_, __, { userPhoneNo }) => [
        { type: "Properties", id: "LIST" },
        { type: "UserDetail", id: userPhoneNo },
      ],
    }),

    getProperties: builder.query<
      GetAllPropertiesResponse,
      { page: number; size: number }
    >({
      query: ({ page, size }) => ({
        url: `/property/admin/all?page=${page}&size=${size}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "Properties" as const, id: "LIST" },
              ...result.content.map((property) => ({
                type: "PropertyDetail" as const,
                id: property.propertyID,
              })),
            ]
          : [{ type: "Properties", id: "LIST" }],
    }),

    getPropertyById: builder.query<GetPropertyByIdResponse, { id: string }>({
      query: ({ id }) => ({
        url: `/property/admin/${id}`,
        method: "GET",
      }),
    }),

    getPropertiesToVerify: builder.query<
      GetPropertiesToVerifyResponse,
      { page: number; size: number }
    >({
      query: ({ page, size }) => ({
        url: `/property/admin/properties-to-verify?page=${page}&size=${size}`,
        method: "GET",
      }),
    }),

    getPropertiesToReverify: builder.query<
      GetPropertiesToReverifyResponse,
      { page: number; size: number }
    >({
      query: ({ page, size }) => ({
        url: `/property/admin/properties-to-re-verify?page=${page}&size=${size}`,
        method: "GET",
      }),
    }),

    verifyProperty: builder.mutation<
      {
        message: string;
        verifiedBy: string;
        propertyId: string;
      },
      {
        propertyID: string;
        comment: string;
      }
    >({
      query: ({ propertyID, comment }) => ({
        url: `/property/admin/verify-property?propertyId=${propertyID}&comment=${comment}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    reverifyProperty: builder.mutation<
      {
        message: string;
        verifiedBy: string;
        propertyId: string;
      },
      {
        propertyID: string;
        comment: string;
      }
    >({
      query: ({ propertyID, comment }) => ({
        url: `/property/admin/re-verify-property?propertyId=${propertyID}&comment=${comment}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    deactivateProperty: builder.mutation<{}, {}>({
      query: ({}) => ({
        url: `/property/admin/deactivate`,
        method: "PUT",
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
  useLogoutMutation,
  useGetUsersQuery,
  useGetUserByPhoneNoQuery,
  useBlacklistUserMutation,
  useActivateUserMutation,
  useGetLeadsQuery,
  useGetLeadByIdQuery,
  useLeadStatusUpdateMutation,
  useLeadAddCommentMutation,
  usePresignedUrlsMutation,
  usePropertyAddMutation,
  useGetPropertiesQuery,
  useGetPropertyByIdQuery,
  useGetPropertiesToVerifyQuery,
  useGetPropertiesToReverifyQuery,
} = apiSlice;
