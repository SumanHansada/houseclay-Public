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
    { label: "Name", value: name },
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
    <div className="px-16 py-8 bg-gray-100 h-full">
      <div className="p-5 rounded-xl bg-white shadow-sm flex flex-col gap-4">
        <h2 className="text-3xl flex items-center w-full justify-between">
          My Profile
        </h2>
        <div className="flex gap-16 h-full">
          <InitialsAvatar name={name} size="xl" />
          <form className="flex flex-col justify-between flex-1 gap-3">
            {profileFields.map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-2 text-lg">
                <label>{label}</label>
                <input
                  type="text"
                  value={value}
                  disabled
                  className="border border-gray-400 rounded-xl p-3 text-gray-600 bg-white"
                />
              </div>
            ))}
          </form>
        </div>
      </div>
    </div>
  );
}
