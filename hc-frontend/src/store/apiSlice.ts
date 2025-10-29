import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { BASE_API_URL } from "@/common/constants";
import { PropertyCategory } from "@/common/enums";
import { PropertyForm } from "@/interfaces/PropertyForm";
import { GetUserDetailResponse } from "@/interfaces/User";

export const USER_DETAIL_TAG = { type: "User", id: "DETAIL" } as const;
export const TAGS = [USER_DETAIL_TAG.type] as const;

export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: TAGS,
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_API_URL,
    credentials: "include", // Required for HTTP-only cookies
  }),
  endpoints: (builder) => ({
    login: builder.mutation<
      {
        name: string;
        emailID: string;
        connectBal: number;
        avatarUrl: string | null;
        phoneNo: string;
      },
      { phoneNo: string; otpCode: string } // Request body type
    >({
      query: (data) => {
        return {
          url: "/user/login",
          method: "POST",
          body: data,
          responseHandler: (response) => response.json(), // Convert response to text
        };
      },
    }),
    register: builder.mutation<
      {
        name: string;
        emailID: string;
        connectBal: number;
        avatarUrl: string | null;
        phoneNo: string;
      },
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
      query: ({ phoneNo }) => {
        return {
          url: `/user/check-user?phoneNo=${encodeURIComponent(phoneNo)}`,
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
      invalidatesTags: [USER_DETAIL_TAG],
    }),
    getUserDetail: builder.query<GetUserDetailResponse, void>({
      query: () => "/user/detail",
      providesTags: [USER_DETAIL_TAG],
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
      invalidatesTags: [USER_DETAIL_TAG],
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
      invalidatesTags: [USER_DETAIL_TAG],
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
        if (filters.exclusive === true)
          searchParams.append("exclusive", "true");
        if (filters.sortFields)
          searchParams.append("sortFields", filters.sortFields.toString());
        if (filters.sortOrder)
          searchParams.append("sortOrder", filters.sortOrder.toString());

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
    createOrder: builder.mutation<
      {
        amount: number;
        amount_paid: number;
        notes: string[];
        created_at: number;
        amount_due: number;
        currency: string;
        receipt: string;
        id: string;
        entity: string;
        offer_id: string | null;
        attempts: number;
        status: string;
      },
      { amount: number }
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
        amount: number;
        connects: number;
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
      invalidatesTags: [USER_DETAIL_TAG],
    }),
    contactOwner: builder.mutation<
      { phone: string; name: string; email: string; connectBal: number },
      { propertyID: string }
    >({
      query: ({ propertyID }) => ({
        url: `/property/user/contact/${propertyID}`,
        method: "GET",
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
  useGetUserDetailQuery,
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
  useCreateOrderMutation,
  useVerifyPaymentMutation,
  useContactOwnerMutation,
} = apiSlice;
