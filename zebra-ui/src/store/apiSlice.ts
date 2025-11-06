import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
import {
  baseQueryWithAuth,
  invalidateAllTags,
  listTag,
  TAGS,
} from "@/utils/rtkQueryHelpers";
import { BASE_API_URL } from "@/common/constants";

const safeDecode = (s: string) => {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
  tagTypes: TAGS,

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
      invalidatesTags: invalidateAllTags,
    }),

    // ──────────────── USERS ────────────────
    getUsersAuthCheck: builder.query<undefined, void>({
      query: () => "/admin/users",
    }),

    getUsers: builder.query<
      GetAllUsersResponse,
      { page: number; size: number }
    >({
      query: ({ page, size }) => ({
        url: `/admin/users?page=${page}&size=${size}`,
        method: "GET",
      }),
      providesTags: listTag("Users"),
    }),

    getUserByPhoneNo: builder.query<
      GetUserByPhoneNoResponse,
      { phoneNo: string }
    >({
      query: ({ phoneNo }) => {
        const raw = safeDecode(phoneNo).trim();
        return {
          url: "/admin/search-user",
          params: { phoneNo: raw },
          method: "GET",
        };
      },
      providesTags: (_r, _e, { phoneNo }) =>
        [{ type: "UserDetail", id: phoneNo }] as const,
    }),

    blacklistUser: builder.mutation<
      {
        blacklisted: boolean;
        message: string;
        userId: string;
      },
      { phoneNo: string; comment: string }
    >({
      query: ({ phoneNo, comment }) => ({
        url: `/admin/blacklist-user?phoneNo=${phoneNo}&comment=${comment}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (_r, _e, { phoneNo }) =>
        [{ type: "UserDetail", id: phoneNo }, ...listTag("Users")] as const,
    }),

    activateUser: builder.mutation<
      {
        blacklisted: boolean;
        message: string;
        userId: string;
      },
      { phoneNo: string; comment: string }
    >({
      query: ({ phoneNo, comment }) => ({
        url: `/admin/activate-user?phoneNo=${phoneNo}&comment=${comment}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (_r, _e, { phoneNo }) =>
        [{ type: "UserDetail", id: phoneNo }, ...listTag("Users")] as const,
    }),

    tagBroker: builder.mutation<
      {
        blacklisted: boolean;
        message: string;
        userId: string;
      },
      { phoneNo: string; comment: string }
    >({
      query: ({ phoneNo, comment }) => ({
        url: `/admin/tag-broker?phoneNo=${phoneNo}&comment=${comment}`,
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
              ...listTag("Leads"),
              ...result.content.map((lead) => ({
                type: "LeadDetail" as const,
                id: lead.leadId,
              })),
            ]
          : listTag("Leads"),
    }),

    getLeadById: builder.query<GetLeadByIdResponse, { id: number }>({
      query: ({ id }) => ({
        url: `/leads/${id}`,
        method: "GET",
      }),
      providesTags: (_r, _e, { id }) => [{ type: "LeadDetail", id }] as const,
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
      invalidatesTags: (_r, _e, { id }) =>
        [{ type: "LeadDetail", id }, ...listTag("Leads")] as const,
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
      invalidatesTags: (_r, _e, { id }) =>
        [{ type: "LeadDetail", id }, ...listTag("Leads")] as const,
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
        phoneNo: string;
      }
    >({
      query: ({ phoneNo, payload }) => ({
        url: `property/admin/add?phoneNo=${phoneNo}`,
        method: "POST",
        body: payload,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (_r, _e, { phoneNo }) =>
        [{ type: "UserDetail", id: phoneNo }, ...listTag("Users")] as const,
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
              ...listTag("Properties"),
              ...result.content.map((property) => ({
                type: "PropertyDetail" as const,
                id: property.propertyID,
              })),
            ]
          : listTag("Properties"),
    }),

    getPropertyById: builder.query<
      GetPropertyByIdResponse,
      { propertyID: string }
    >({
      query: ({ propertyID }) => ({
        url: `/property/admin/${propertyID}`,
        method: "GET",
      }),
      providesTags: (_r, _e, { propertyID }) =>
        [{ type: "PropertyDetail", id: propertyID }] as const,
    }),

    getPropertiesToVerify: builder.query<
      GetPropertiesToVerifyResponse,
      { page: number; size: number }
    >({
      query: ({ page, size }) => ({
        url: `/property/admin/properties-to-verify?page=${page}&size=${size}`,
        method: "GET",
      }),
      providesTags: listTag("PropertiesToVerify"),
    }),

    getPropertiesToReverify: builder.query<
      GetPropertiesToReverifyResponse,
      { page: number; size: number }
    >({
      query: ({ page, size }) => ({
        url: `/property/admin/properties-to-re-verify?page=${page}&size=${size}`,
        method: "GET",
      }),
      providesTags: listTag("PropertiesToReverify"),
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
      invalidatesTags: listTag("PropertiesToVerify"),
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
      invalidatesTags: listTag("PropertiesToReverify"),
    }),

    deactivateProperty: builder.mutation<
      { message: string },
      { propertyID: string; comment: string }
    >({
      query: ({ propertyID, comment }) => ({
        url: `/property/admin/deactivate?propertyID=${propertyID}&comment=${comment}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: () =>
        [
          ...listTag("Properties"),
          ...listTag("PropertiesToVerify"),
          ...listTag("PropertiesToReverify"),
        ] as const,
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetUsersAuthCheckQuery,
  useGetUsersQuery,
  useGetUserByPhoneNoQuery,
  useBlacklistUserMutation,
  useActivateUserMutation,
  useTagBrokerMutation,
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
  useVerifyPropertyMutation,
  useDeactivatePropertyMutation,
} = apiSlice;
