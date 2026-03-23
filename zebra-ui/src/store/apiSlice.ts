import { createApi } from "@reduxjs/toolkit/query/react";

import { AdminDetails } from "@/interfaces/Admin";
import {
  GetAllLeadsResponse,
  GetAllPropertiesResponse,
  GetAllUsersResponse,
  GetCorporateDomainsResponse,
  GetLeadByIdResponse,
  GetPropertyByIdResponse,
  GetUserByPhoneNoResponse,
} from "@/interfaces/api";
import { GetAllAdminsResponse } from "@/interfaces/api/admins";
import { LeadQueryParam } from "@/interfaces/Lead";
import { PropertyForm } from "@/interfaces/PropertyForm";
import { safeUrlDecode } from "@/utils/core";
import {
  baseQueryWithAuth,
  invalidateAllTags,
  listTag,
  TAGS,
} from "@/utils/rtkQueryHelpers";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
  tagTypes: TAGS,

  endpoints: (builder) => ({
    // ──────────────── AUTH ────────────────
    login: builder.mutation<
      { name: string; role: string; username: string },
      { username: string; password: string }
    >({
      query: (payload) => ({
        url: "/admin/login",
        method: "POST",
        body: payload,
      }),
    }),
    register: builder.mutation<
      string, // Response Type
      {
        username: string;
        password: string;
        name: string;
        phoneNo: string;
        secondaryPhoneNo?: string;
        personalEmail: string;
        address: string;
        role: string;
        dateOfBirth: string;
        dateOfJoining: string;
      } // Request Body Type
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
        return {
          url: "/admin/search-user",
          params: { phoneNo },
          method: "GET",
        };
      },
      providesTags: (_r, _e, { phoneNo }) =>
        [{ type: "UserDetail", id: phoneNo }] as const,
    }),

    createHouseclayUser: builder.mutation<
      string,
      { phoneNo: string; email: string; name: string; blacklisted: boolean }
    >({
      query: (payload) => ({
        url: `/admin/user/create`,
        method: "POST",
        body: payload,
        responseHandler: (response) => response.text(),
      }),
      invalidatesTags: listTag("Users"),
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
        url: "/admin/blacklist-user",
        method: "POST",
        params: { phoneNo, comment },
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
        url: "/admin/activate-user",
        method: "POST",
        params: { phoneNo, comment },
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
      query: ({ phoneNo, comment }) => {
        return {
          url: "/admin/tag-broker",
          params: { phoneNo, comment },
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
    }),

    updateUserProfile: builder.mutation<
      { message: string; userId: string },
      {
        phoneNo: string;
        payload: { companyName?: string; jobTitle?: string; emailID?: string };
      }
    >({
      query: ({ phoneNo, payload }) => ({
        url: `/admin/update-user-profile`,
        method: "POST",
        params: { phoneNo },
        body: payload,
      }),
      invalidatesTags: (_r, _e, { phoneNo }) => [
        { type: "UserDetail", id: phoneNo },
      ],
    }),

    // ──────────────── CORPORATE DOMAINS ────────────────
    getCorporateDomains: builder.query<
      GetCorporateDomainsResponse,
      { status: string; page: number; size: number }
    >({
      query: ({ status, page, size }) => ({
        url: `/admin/corporate-domains`,
        params: { status, page, size },
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...listTag("CorporateDomains"),
              ...result.content.map((domain) => ({
                type: "CorporateDomainDetail" as const,
                id: domain.id,
              })),
            ]
          : listTag("CorporateDomains"),
    }),

    approveCorporateDomain: builder.mutation<string, { id: number }>({
      query: ({ id }) => ({
        url: `/admin/corporate-domains/${id}/approve`,
        method: "PUT",
      }),
      invalidatesTags: (_r, _e, { id }) =>
        [
          { type: "CorporateDomainDetail", id },
          ...listTag("CorporateDomains"),
        ] as const,
    }),

    denyCorporateDomain: builder.mutation<string, { id: number }>({
      query: ({ id }) => ({
        url: `/admin/corporate-domains/${id}/deny`,
        method: "PUT",
      }),
      invalidatesTags: (_r, _e, { id }) =>
        [
          { type: "CorporateDomainDetail", id },
          ...listTag("CorporateDomains"),
        ] as const,
    }),

    // ──────────────── Admins ────────────────
    getAdminInfo: builder.query<
      { name: string; role: string; username: string },
      void
    >({
      query: () => "/admin/info",
      keepUnusedDataFor: 0,
    }),

    getAdmins: builder.query<
      GetAllAdminsResponse,
      { page: number; size: number }
    >({
      query: ({ page, size }) => ({
        url: `/admin/list-admins?page=${page}&size=${size}`,
        method: "GET",
      }),
      providesTags: listTag("Admins"),
    }),

    getAdminByUsername: builder.query<AdminDetails, { username: string }>({
      query: ({ username }) => ({
        url: `/admin/${username}`,
        method: "GET",
      }),
      providesTags: (_r, _e, { username }) =>
        [{ type: "AdminDetail", username }] as const,
    }),

    activateAdmin: builder.mutation<string, { username: string }>({
      query: ({ username }) => ({
        url: `/admin/${username}/activate`,
        method: "PUT",
      }),
      invalidatesTags: (_r, _e, { username }) =>
        [{ type: "AdminDetail", username }, ...listTag("Admins")] as const,
    }),

    deactivateAdmin: builder.mutation<string, { username: string }>({
      query: ({ username }) => ({
        url: `/admin/${username}/deactivate`,
        method: "PUT",
      }),
      invalidatesTags: (_r, _e, { username }) =>
        [{ type: "AdminDetail", username }, ...listTag("Admins")] as const,
    }),

    // ──────────────── LEADS ────────────────
    getLeads: builder.query<
      GetAllLeadsResponse,
      { type: LeadQueryParam; page: number; size: number }
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
        fileURLMap: Record<string, string>;
      },
      { propertyID: string; fileMap: Record<string, string> }
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
    deletePresignedUrls: builder.mutation<
      {
        fileURLMap: Record<string, string>;
      },
      { propertyID: string; fileMap: Record<string, string> }
    >({
      query: (payload) => ({
        url: "photo/admin/delete-presigned-urls",
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
        payload: PropertyForm;
        phoneNo: string;
      }
    >({
      query: ({ phoneNo, payload }) => {
        const rawPhoneNo = safeUrlDecode(phoneNo);
        return {
          url: "property/admin/add",
          params: { phoneNo: rawPhoneNo },
          method: "POST",
          body: payload,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: (_r, _e, { phoneNo }) =>
        [{ type: "UserDetail", id: phoneNo }, ...listTag("Users")] as const,
    }),
    propertyUpdate: builder.mutation<
      { message: string; propertyID: number },
      {
        payload: Partial<PropertyForm> & { propertyID: string };
        phoneNo: string;
      }
    >({
      query: ({ phoneNo, payload }) => {
        const rawPhoneNo = safeUrlDecode(phoneNo);
        return {
          url: "property/admin/update",
          params: { phoneNo: rawPhoneNo },
          method: "PUT",
          body: payload,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
    }),

    getProperties: builder.query<
      GetAllPropertiesResponse,
      { page: number; size: number; state?: string; sortOrder?: string }
    >({
      query: ({ page, size, state, sortOrder }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          size: size.toString(),
        });
        if (state) params.append("state", state);
        if (sortOrder) params.append("sortOrder", sortOrder);

        return {
          url: `/property/admin/properties?${params.toString()}`,
          method: "GET",
        };
      },
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

    verifyProperty: builder.mutation<
      {
        message: string;
        verifiedBy: string;
        propertyId: string;
      },
      {
        propertyID: string;
        comment: string;
        score: number;
      }
    >({
      query: ({ propertyID, comment, score }) => ({
        url: `/property/admin/verify-property?propertyId=${propertyID}&comment=${comment}&score=${score}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: listTag("Properties"),
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
      invalidatesTags: listTag("Properties"),
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
      invalidatesTags: () => [...listTag("Properties")] as const,
    }),

    addConnects: builder.mutation<
      { message: string },
      {
        connectCount: number;
        phoneNo: string;
      }
    >({
      query: ({ connectCount, phoneNo }) => {
        return {
          url: "/admin/add-connects",
          params: { connectCount, phoneNo },
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetUsersQuery,
  useGetUserByPhoneNoQuery,
  useCreateHouseclayUserMutation,
  useBlacklistUserMutation,
  useActivateUserMutation,
  useTagBrokerMutation,
  useUpdateUserProfileMutation,
  useGetAdminInfoQuery,
  useGetAdminsQuery,
  useGetAdminByUsernameQuery,
  useActivateAdminMutation,
  useDeactivateAdminMutation,
  useGetCorporateDomainsQuery,
  useApproveCorporateDomainMutation,
  useDenyCorporateDomainMutation,
  useGetLeadsQuery,
  useGetLeadByIdQuery,
  useLeadStatusUpdateMutation,
  useLeadAddCommentMutation,
  usePresignedUrlsMutation,
  useDeletePresignedUrlsMutation,
  usePropertyAddMutation,
  usePropertyUpdateMutation,
  useGetPropertiesQuery,
  useGetPropertyByIdQuery,
  useVerifyPropertyMutation,
  useDeactivatePropertyMutation,
  useAddConnectsMutation,
} = apiSlice;
