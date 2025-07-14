"use client";
import { useParams } from "next/navigation";
import React, { useState } from "react";

import { dialogLabels } from "@/common/constants";
import { Pill } from "@/components/Pill";
import { ActionDialog } from "@/dialogs/action-dialog";
import { useDialog } from "@/providers/DialogContextProvider";
import {
  useActivateUserMutation,
  useBlacklistUserMutation,
  useGetUserByPhoneNoQuery,
} from "@/store/apiSlice";
import { InitialsAvatar } from "@/components/InitialsAvatar";
// import { getInitials } from "@/utils/core";

const ProfilePage: React.FC = () => {
  const { userPhoneNo } = useParams() as { userPhoneNo: string };
  const { data } = useGetUserByPhoneNoQuery({ phoneNo: userPhoneNo });
  const [blacklistUser] = useBlacklistUserMutation();
  const [activateUser] = useActivateUserMutation();
  const { openDialog, isDialogOpen } = useDialog();

  const currentUser = data!.user;
  const [isBlacklisted, setIsBlacklisted] = useState<boolean>(
    currentUser.blacklisted,
  );
  const handleBlacklistConfirm = async (comment: string) => {
    await blacklistUser({ phoneNo: userPhoneNo, comment });
  };

  const handleActivateConfirm = async (comment: string) => {
    await activateUser({ phoneNo: userPhoneNo, comment });
  };
  const BLACKLIST_DIALOG_ID = "blacklist-user-dialog";
  const ACTIVATE_DIALOG_ID = "activate-user-dialog";

  const handleBlacklistClicked = () => {
    if (!isBlacklisted) openDialog(BLACKLIST_DIALOG_ID);
  };

  const handleActivateClicked = () => {
    if (isBlacklisted) openDialog(ACTIVATE_DIALOG_ID);
  };

  const { name, email, phoneNo, createdAt } = currentUser;
  // const userInitials = getInitials(name);

  const currentStatus = isBlacklisted
    ? "The user is blacklisted"
    : "The user is active";

  const profileFields = [
    { label: "Name", value: name },
    { label: "Phone", value: phoneNo },
    { label: "Email", value: email },
    {
      label: "Joined On",
      value: new Date(createdAt).toLocaleString(),
    },
    { label: "Blacklisted Status", value: currentStatus },
  ];

  return (
    <div className="px-16 py-8 bg-gray-100 h-full">
      <div className="p-5 rounded-xl bg-white shadow-sm flex flex-col gap-4">
        <h2 className="text-3xl flex items-center w-full justify-between">
          User Details
          <span className="text-xl">
            {currentUser.broker && <Pill color="yellow">BROKER</Pill>}
          </span>
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
                onClick={handleActivateClicked}
                className={`text-lg px-3 py-2 rounded-xl font-medium ${
                  isBlacklisted
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
              >
                Activate User
              </button>
              <button
                type="button"
                onClick={handleBlacklistClicked}
                className={`ml-3 text-lg px-3 py-2 rounded-xl font-medium ${
                  isBlacklisted
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600 text-white"
                }`}
              >
                Blacklist User
              </button>
            </div>
          </form>
        </div>
      </div>
      {isDialogOpen(BLACKLIST_DIALOG_ID) && (
        <ActionDialog
          id={BLACKLIST_DIALOG_ID}
          {...dialogLabels.blacklist}
          onConfirm={handleBlacklistConfirm}
          onSuccess={() => setIsBlacklisted(true)}
          requireComment
        />
      )}

      {isDialogOpen(ACTIVATE_DIALOG_ID) && (
        <ActionDialog
          id={ACTIVATE_DIALOG_ID}
          {...dialogLabels.activate}
          onConfirm={handleActivateConfirm}
          onSuccess={() => setIsBlacklisted(false)}
          requireComment
        />
      )}
    </div>
  );
};

export default ProfilePage;
