"use client";

import { useSelector } from "react-redux";

import AsyncFallback from "@/components/AsyncFallback";
import { InitialsAvatar } from "@/components/InitialsAvatar";
import { useGetAdminByUsernameQuery } from "@/store/apiSlice";
import { RootState } from "@/store/store";
import { formatDateVerbose } from "@/utils/core";

export default function MyProfilePage() {
  const adminUsername = useSelector(
    (state: RootState) => state.adminAuth.username,
  );
  const {
    data: adminData,
    isLoading,
    isError,
    error,
  } = useGetAdminByUsernameQuery(
    { username: adminUsername! },
    {
      skip: !adminUsername,
    },
  );

  // Initial Hard Loading State
  if (isLoading) {
    return (
      <AsyncFallback
        isLoading={isLoading}
        isError={false}
        loadingMessage="Loading admin details..."
      />
    );
  }

  // Error State
  if (isError || !adminData) {
    return (
      <AsyncFallback
        isLoading={false}
        isError={true}
        error={error}
        errorMessage="Failed to fetch Admin details."
      />
    );
  }

  const {
    name,
    personalEmail,
    phoneNo,
    dateOfBirth,
    dateOfJoining,
    role,
    secondaryPhoneNo,
    address,
    username,
  } = adminData;

  const profileFields = [
    { label: "Username", value: username },
    { label: "Phone", value: phoneNo },
    ...(secondaryPhoneNo
      ? [{ label: "Secondary PhoneNo", value: secondaryPhoneNo }]
      : []),
    {
      label: "Role",
      value: role,
    },
    { label: "Personal Email", value: personalEmail },
    {
      label: "Joined On",
      value: formatDateVerbose(dateOfJoining),
    },
    {
      label: "Date of Birth",
      value: formatDateVerbose(dateOfBirth),
    },
    { label: "Address", value: address },
  ];

  return (
    <div className="flex-1 flex flex-col p-8 bg-gray-100 overflow-hidden">
      <div className="flex-1 flex flex-col rounded-xl bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <h2 className="bg-white border-b border-gray-100 shadow-sm text-3xl flex items-center justify-between px-8 py-4 w-full">
          My Profile
        </h2>
        {/* Content */}
        <div className="flex-1 flex px-8 py-4 w-full gap-5 overflow-hidden">
          {/* Left Side - Avatar and Name */}
          <div className="flex flex-col items-center w-1/6 h-fit rounded-xl shadow-sm border overflow-hidden min-w-48">
            <div className="p-2 bg-gray-100 w-full flex items-center justify-center">
              <InitialsAvatar name={name} size="xl" />
            </div>
            {name && (
              <h3 className="text-2xl font-medium text-gray-800 text-center border w-full p-2">
                {name}
              </h3>
            )}
          </div>

          {/* Right Side - Admin Details */}
          <div className="flex-1 flex flex-col border rounded-xl shadow-sm overflow-hidden">
            <form className="flex flex-col gap-4 min-h-0 overflow-auto p-3">
              {profileFields.map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-1">
                  <label className="text-gray-600 text-lg font-medium">
                    {label}
                  </label>
                  <input
                    type="text"
                    value={value}
                    disabled
                    className="border border-gray-400 rounded-xl p-2 text-gray-700 text-xl bg-white"
                  />
                </div>
              ))}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
