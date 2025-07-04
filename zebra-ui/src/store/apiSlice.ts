import { createApi } from "@reduxjs/toolkit/query/react";

// import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LeadQueryParamEnum } from "@/common/enum";
import {
  GetAllLeadsResponse,
  GetAllPropertiesResponse,
  GetAllUsersResponse,
  GetLeadByIdResponse,
  GetPropertiesToReverifyResponse,
  GetPropertiesToVerifyResponse,
  GetPropertyByIdResponse,
  GetUserByPhoneNoResponse,
  PostFlatmatesPropertyRequest,
  PostRentPropertyRequest,
  PostResalePropertyRequest,
} from "@/interfaces/api";

// import { RootState } from "./store";
import { baseQueryWithAuth } from "./baseQueryWithAuth";

// const baseUrl = process.env.NEXT_PUBLIC_HOUSECLAY_API_BASE_URL;

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
  // baseQuery: fetchBaseQuery({
  //   baseUrl:
  //     baseUrl ||
  //     "http://ec2-13-210-204-208.ap-southeast-2.compute.amazonaws.com:8080/api" ||
  //     "https://jsonplaceholder.typicode.com",
  //   prepareHeaders: (headers, { getState }) => {
  //     const token = (getState() as RootState).admin.token;
  //     if (token) {
  //       headers.set("Authorization", `Bearer ${token}`);
  //     }
  //     return headers;
  //   },
  // }),

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
      query: (data) => ({
        url: "/admin/login",
        method: "POST",
        body: data,
        responseHandler: (response) => response.text(),
      }),
    }),
    register: builder.mutation<
      string, // Response Type
      { username: string; password: string; name: string } // Request Body Type
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
      query: (data) => ({
        url: "/photo/admin/presigned-urls",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    // ──────────────── PROPERTY ────────────────
    propertyAddRent: builder.mutation<
      {
        message: string;
        propertyID: number;
      },
      { data: PostRentPropertyRequest; phoneNo: string }
    >({
      query: ({ data, phoneNo }) => ({
        url: `/property/admin/add?phoneNo=${phoneNo}`,
        method: "POST",
        body: { ...data },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (_, __, { phoneNo }) => [
        { type: "Properties", id: "LIST" },
        { type: "UserDetail", id: phoneNo },
      ],
    }),

    propertyAddResale: builder.mutation<
      {
        message: string;
        propertyID: number;
      },
      {
        data: PostResalePropertyRequest;
        phoneNo: string;
      }
    >({
      query: ({ data, phoneNo }) => ({
        url: `/property/admin/add?phoneNo=${phoneNo}`,
        method: "POST",
        body: { ...data },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (_, __, { phoneNo }) => [
        { type: "Properties", id: "LIST" },
        { type: "UserDetail", id: phoneNo },
      ],
    }),

    propertyAddFlatmates: builder.mutation<
      {
        message: string;
        propertyID: number;
      },
      {
        data: PostFlatmatesPropertyRequest;
        phoneNo: string;
      }
    >({
      query: ({ data, phoneNo }) => ({
        url: `/property/admin/add?phoneNo=${phoneNo}`,
        method: "POST",
        body: { ...data },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (_, __, { phoneNo }) => [
        { type: "Properties", id: "LIST" },
        { type: "UserDetail", id: phoneNo },
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
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetUsersQuery,
  useGetUserByPhoneNoQuery,
  useGetLeadsQuery,
  useGetLeadByIdQuery,
  useLeadStatusUpdateMutation,
  useLeadAddCommentMutation,
  usePresignedUrlsMutation,
  usePropertyAddRentMutation,
  usePropertyAddResaleMutation,
  usePropertyAddFlatmatesMutation,
  useGetPropertiesQuery,
  useGetPropertyByIdQuery,
  useGetPropertiesToVerifyQuery,
  useGetPropertiesToReverifyQuery,
} = apiSlice;
