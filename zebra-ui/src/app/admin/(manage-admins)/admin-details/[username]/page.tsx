"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import { dialogLabels } from "@/common/constants";
import { UserDetailsTabEnum } from "@/common/enums";
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
import { userDetailsTestIds } from "@/utils/testIds";

const DEACTIVATE_DIALOG_ID = "deactivate-admin-dialog";
const ACTIVATE_DIALOG_ID = "activate-admin-dialog";

const ProfilePage: React.FC = () => {
  const { username: adminUsername } = useParams() as { username: string };

  const {
    data: adminDetails,
    isLoading,
    isError,
    error,
  } = useGetAdminByUsernameQuery(
    { username: adminUsername },
    { skip: !adminUsername },
  );

  const [activateAdmin] = useActivateAdminMutation();
  const [deactivateAdmin] = useDeactivateAdminMutation();
  const { openDialog, isDialogOpen } = useDialog();

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (adminDetails) {
      setIsActive(adminDetails.active);
    }
  }, [adminDetails]);

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
  } = adminDetails;

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
    {
      label: "Active",
      value: isActive ? "The user is active" : "The user is inactive",
    },
  ];

  return (
    <div
      data-testid={userDetailsTestIds.getTabPageId(UserDetailsTabEnum.PROFILE)}
      className="px-16 py-8 bg-gray-100 h-full"
    >
      <div className="p-5 rounded-xl bg-white shadow-sm flex flex-col gap-4">
        <h2 className="text-3xl flex items-center w-full justify-between">
          Admin Details
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
            <div className="flex justify-end mt-2">
              <button
                type="button"
                data-testid={userDetailsTestIds.buttonId("activate-admin")}
                aria-label="activate-admin"
                onClick={() => !isActive && openDialog(ACTIVATE_DIALOG_ID)}
                disabled={isActive}
                className={`text-lg px-3 py-2 rounded-xl font-medium ${
                  isActive
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                Activate Admin
              </button>
              <button
                type="button"
                data-testid={userDetailsTestIds.buttonId("deactivate-admin")}
                aria-label="deactivate-admin"
                onClick={() => isActive && openDialog(DEACTIVATE_DIALOG_ID)}
                disabled={!isActive}
                className={`ml-3 text-lg px-3 py-2 rounded-xl font-medium ${
                  !isActive
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600 text-white"
                }`}
              >
                Deactivate Admin
              </button>
            </div>
          </form>
        </div>
      </div>

      {isDialogOpen(ACTIVATE_DIALOG_ID) && (
        <ActionDialog
          id={ACTIVATE_DIALOG_ID}
          {...dialogLabels.activateAdmin}
          onConfirm={handleActivateAdmin}
          onSuccess={() => setIsActive(true)}
        />
      )}

      {isDialogOpen(DEACTIVATE_DIALOG_ID) && (
        <ActionDialog
          id={DEACTIVATE_DIALOG_ID}
          {...dialogLabels.deactivateAdmin}
          onConfirm={handleDeactivateAdmin}
          onSuccess={() => setIsActive(false)}
        />
      )}
    </div>
  );
};

export default ProfilePage;
