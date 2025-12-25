import { createApi } from "@reduxjs/toolkit/query/react";

import { PropertyCategory } from "@/common/enums";
import { ConnectsBundle } from "@/interfaces/ConnectsBundle";
import { PropertyForm } from "@/interfaces/PropertyForm";
import { PropertySearch } from "@/interfaces/PropertySearch";
import {
  AuthUserDetail,
  GetUserDetailResponse,
  PropertyCardWithImages,
} from "@/interfaces/User";
import { baseQueryWithAuth } from "@/utils/rtkQueryHelpers";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    login: builder.mutation<
      AuthUserDetail | string,
      { phoneNo: string; otpCode: string } // Request body type
    >({
      query: (data) => {
        return {
          url: "/user/login",
          method: "POST",
          body: data,
          responseHandler: async (response) => {
            const contentType = response.headers.get("content-type");
            if (contentType?.includes("application/json")) {
              return response.json();
            } else {
              return response.text();
            }
          },
        };
      },
    }),
    register: builder.mutation<
      AuthUserDetail,
      { phoneNo: string; name: string; emailID: string; otpCode: string } // Request body type
    >({
      query: (data) => {
        return {
          url: "/user/register",
          method: "POST",
          body: data,
          responseHandler: (response) => response.json(),
        };
      },
    }),
    generateOtp: builder.mutation<
      string, // Response type - plain text
      { phoneNo: string } // Request body type
    >({
      query: ({ phoneNo }) => {
        return {
          url: `/auth/generate-otp?phoneNo=${phoneNo}`,
          method: "POST",
          responseHandler: (response) => response.text(), // Handle plain text response
        };
      },
    }),
    checkUser: builder.query<
      { exists: boolean; message: string }, // Response type
      { phoneNo: string } // Query parameter type
    >({
      query: ({ phoneNo }) => ({
        url: `/user/check-user?phoneNo=${encodeURIComponent(phoneNo)}`,
        method: "GET",
      }),
    }),
    updateUser: builder.mutation<unknown, { name: string; email: string }>({
      query: (data) => ({
        url: "/user/update",
        method: "PUT",
        body: data,
      }),
    }),
    getUserInfo: builder.query<
      {
        name: string;
        emailID: string;
        connectBal: number;
        avatarUrl: string | null;
        phoneNo: string;
      },
      void
    >({
      query: () => "/user/info",
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
    getUserDetail: builder.query<GetUserDetailResponse, void>({
      query: () => "/user/detail",
      providesTags: ["User"],
    }),
    presignedUrls: builder.mutation<
      {
        fileURLMap: Record<string, string>;
      }, // Response type
      { propertyID: string; fileMap: Record<string, string> } // Request body type
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
    deletePresignedUrls: builder.mutation<
      {
        fileURLMap: Record<string, string>;
      }, // Response type
      { propertyID: string; fileMap: Record<string, string> } // Request body type
    >({
      query: (data) => ({
        url: "photo/user/delete-presigned-urls",
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
    getAuthenticatedPropertyById: builder.query<
      {
        property: {
          property: unknown;
          contactUserCount: number;
          viewUserCount: number;
          shortlistUserCount: number;
        };
        owner: { name: string; phoneNo: string; emailID: string };
        reported: boolean;
        propertyOwner: boolean;
      },
      string
    >({
      query: (id) => ({
        url: `/property/user/get-property/${id}`,
      }),
    }),

    getPropertiesByLocation: builder.query<
      {
        items: PropertySearch[];
        hasNext: boolean;
        page: number;
        totalElements: number;
      },
      Record<string, string | number | boolean | string[] | PropertyCategory>
    >({
      query: (params) => {
        const {
          latitude,
          longitude,
          propertyCategory,
          page = 0,
          // Default page size to 16
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
        if (filters.exclusive === true)
          searchParams.append("exclusive", "true");
        if (filters.sortFields)
          searchParams.append("sortFields", filters.sortFields.toString());
        if (filters.sortOrder)
          searchParams.append("sortOrder", filters.sortOrder.toString());

        return `/property/search?${searchParams.toString()}`;
      },

      // Only use the filters/location for the cache key, ignore the 'page' number.
      // This ensures page 0 and page 1 share the same Redux state entry.
      serializeQueryArgs: ({ queryArgs }) => {
        const { page: _page, ...newQueryArgs } = queryArgs;
        return newQueryArgs;
      },

      // Combine incoming data with existing data
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 0) {
          // If it's a fresh search (page 0), replace everything
          return newItems;
        }
        // Otherwise, append new items to the existing list
        currentCache.items.push(...newItems.items);
        // Update metadata
        currentCache.page = newItems.page;
        currentCache.hasNext = newItems.hasNext;
        currentCache.totalElements = newItems.totalElements;
      },

      // Refetch when the page arg changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
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
      { data: object; status: number },
      { propertyId: string }
    >({
      query: ({ propertyId }) => ({
        url: `/property/user/shortlist-property/${propertyId}`,
        method: "POST",
      }),
    }),
    removeShortlistedProperty: builder.mutation<
      { data: object; status: number },
      { propertyId: string }
    >({
      query: ({ propertyId }) => ({
        url: `/property/user/remove-shortlisted-property/${propertyId}`,
        method: "DELETE",
      }),
    }),
    getShortlistedProperties: builder.query<
      { shortlistedProperties: PropertyCardWithImages[] },
      void
    >({
      query: () => `/property/user/shortlisted-properties`,
    }),
    reportProperty: builder.mutation<
      { message: string },
      { propertyId: string; payload: { reportType: string; comment: string } }
    >({
      query: ({ propertyId, payload }) => ({
        url: `/property/user/report-property/${propertyId}`,
        method: "POST",
        body: payload,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    deactivateProperty: builder.mutation<
      { message: string },
      { propertyID: string }
    >({
      query: ({ propertyID }) => ({
        url: `/property/user/deactivate/${propertyID}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["User"],
    }),
    bundleInfo: builder.query<ConnectsBundle[], void>({
      query: () => "/bundle/info",
    }),
    createOrder: builder.mutation<
      {
        orderId: string;
        displayAmount: number;
        razorPayAmount: number;
      },
      { bundle: string; connects: number }
    >({
      query: (data) => ({
        url: "/payment/create-order",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    verifyPayment: builder.mutation<
      { message: string; connectBal: number },
      {
        paymentId: string;
        orderId: string;
        signature: string;
      }
    >({
      query: (data) => ({
        url: "/payment/verify",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    contactOwner: builder.mutation<
      {
        owner: { name: string; phoneNo: string; emailID: string };
        connectBal: number;
      },
      { propertyID: string }
    >({
      query: ({ propertyID }) => ({
        url: `/property/user/contact/${propertyID}`,
        method: "GET",
      }),
    }),
    standouts: builder.query<PropertyCardWithImages[], void>({
      query: () => "/property/standout",
    }),
    popularNeighbourhoods: builder.query<
      { name: string; imgURL: string }[],
      void
    >({
      query: () => "/property/neighbourhood",
    }),
    generateOtpEmail: builder.mutation<string, void>({
      query: () => ({
        url: "/user/generate-otp-email",
        method: "POST",
        responseHandler: "text",
      }),
    }),
    verifyEmail: builder.mutation<undefined, { otp: string; token: string }>({
      query: ({ otp, token }) => ({
        url: "/user/verifyEmail",
        params: { otp, token },
        method: "POST",
      }),
    }),
    contactUs: builder.mutation<
      undefined,
      {
        name: string;
        email: string;
        phone: string;
        subject: string;
        message: string;
      }
    >({
      query: (payload) => ({
        url: "/contact/add",
        body: payload,
        method: "POST",
        responseHandler: (response) => response.text(),
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
  useUpdateUserMutation,
  useGetUserInfoQuery,
  useLazyGetUserInfoQuery,
  useLogoutMutation,
  useGetUserDetailQuery,
  usePresignedUrlsMutation,
  useDeletePresignedUrlsMutation,
  usePropertyAddMutation,
  usePropertyUpdateMutation,
  useGetMyPropertyByIdQuery,
  useLazyGetMyPropertyByIdQuery,
  useGetPropertiesByLocationQuery,
  useLazyGetPropertiesByLocationQuery,
  useGenerateLeadMutation,
  useGetPublicPropertyByIdQuery,
  useLazyGetPublicPropertyByIdQuery,
  useGetAuthenticatedPropertyByIdQuery,
  useShortlistPropertyMutation,
  useRemoveShortlistedPropertyMutation,
  useGetShortlistedPropertiesQuery,
  useLazyGetShortlistedPropertiesQuery,
  useReportPropertyMutation,
  useDeactivatePropertyMutation,
  useBundleInfoQuery,
  useCreateOrderMutation,
  useVerifyPaymentMutation,
  useContactOwnerMutation,
  useStandoutsQuery,
  useLazyStandoutsQuery,
  usePopularNeighbourhoodsQuery,
  useLazyPopularNeighbourhoodsQuery,
  useGenerateOtpEmailMutation,
  useVerifyEmailMutation,
  useContactUsMutation,
} = apiSlice;
