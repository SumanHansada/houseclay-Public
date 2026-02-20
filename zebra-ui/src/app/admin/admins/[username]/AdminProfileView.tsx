"use client";

import React from "react";

import { Button } from "@/base-components";
import { dialogLabels } from "@/common/constants";
import AsyncFallback from "@/components/AsyncFallback";
import { InitialsAvatar } from "@/components/InitialsAvatar";
import { ActionDialog } from "@/dialogs/action-dialog";
import { useDialog } from "@/providers/DialogContextProvider";
import {
  useActivateAdminMutation,
  useDeactivateAdminMutation,
  useGetAdminByUsernameQuery,
} from "@/store/apiSlice";
import { formatDateVerbose } from "@/utils/core";

const DEACTIVATE_DIALOG_ID = "deactivate-admin-dialog";
const ACTIVATE_DIALOG_ID = "activate-admin-dialog";

export const AdminProfileView = ({
  adminUsername,
}: {
  adminUsername: string;
}) => {
  const {
    data: adminDetails,
    isLoading,
    isError,
    error,
  } = useGetAdminByUsernameQuery({ username: adminUsername });

  const [activateAdmin] = useActivateAdminMutation();
  const [deactivateAdmin] = useDeactivateAdminMutation();
  const { openDialog, isDialogOpen } = useDialog();

  const handleActivateAdmin = async () => {
    await activateAdmin({ username: adminUsername }).unwrap();
  };

  const handleDeactivateAdmin = async () => {
    await deactivateAdmin({ username: adminUsername }).unwrap();
  };

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
  if (isError || !adminDetails) {
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
    active,
  } = adminDetails;

  const profileFields = [
    { label: "Username", value: username ?? "N/A" },
    { label: "Phone", value: phoneNo ?? "N/A" },
    ...(secondaryPhoneNo
      ? [{ label: "Secondary PhoneNo", value: secondaryPhoneNo ?? "N/A" }]
      : []),
    {
      label: "Role",
      value: role ?? "N/A",
    },
    {
      label: "Active",
      value: active ? "The admin is active" : "The admin is inactive",
    },
    { label: "Personal Email", value: personalEmail ?? "N/A" },
    {
      label: "Joined On",
      value: dateOfJoining ? formatDateVerbose(dateOfJoining) : "N/A",
    },
    {
      label: "Date of Birth",
      value: dateOfBirth ? formatDateVerbose(dateOfBirth) : "N/A",
    },
    { label: "Address", value: address ?? "N/A" },
  ];

  return (
    <div className="flex-1 flex flex-col bg-gray-100 overflow-hidden">
      <div className="flex-1 flex flex-col rounded-xl bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <h2 className="bg-white border-b border-gray-100 shadow-sm text-3xl flex items-center justify-between w-full px-8 py-4">
          Admin Profile
        </h2>

        {/* Content */}
        <div className="flex-1 flex p-8 w-full gap-5 overflow-hidden">
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

          {/* Right Side - User Details */}
          <div className="flex-1 flex flex-col justify-between border rounded-xl shadow-sm overflow-hidden">
            <form className="flex flex-col justify-between gap-4 px-5 py-3 overflow-auto min-h-0 scrollbar-thin">
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

            {/* Footer */}
            <div className="sticky bottom-0 flex justify-end border-t border-gray-200 shadow-sm p-2 bg-gray-50">
              {active ? (
                <Button
                  aria-label="deactivate-admin"
                  onClick={() => openDialog(DEACTIVATE_DIALOG_ID)}
                  className="rounded-lg"
                >
                  Deactivate Admin
                </Button>
              ) : (
                <button
                  type="button"
                  aria-label="activate-admin"
                  onClick={() => openDialog(ACTIVATE_DIALOG_ID)}
                  className="rounded-lg px-4 py-2 text-base bg-green-600 text-white cursor-pointer hover:bg-green-700"
                >
                  Activate Admin
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {isDialogOpen(ACTIVATE_DIALOG_ID) && (
        <ActionDialog
          id={ACTIVATE_DIALOG_ID}
          {...dialogLabels.activateAdmin}
          onConfirm={handleActivateAdmin}
        />
      )}

      {isDialogOpen(DEACTIVATE_DIALOG_ID) && (
        <ActionDialog
          id={DEACTIVATE_DIALOG_ID}
          {...dialogLabels.deactivateAdmin}
          onConfirm={handleDeactivateAdmin}
        />
      )}
    </div>
  );
};
