"use client";
import { useParams } from "next/navigation";
import React, { useState } from "react";

import { Button } from "@/base-components";
import { dialogLabels } from "@/common/constants";
import { UserDetailsTabEnum } from "@/common/enums";
import { InitialsAvatar } from "@/components/InitialsAvatar";
import { Pill } from "@/components/Pill";
import { ActionDialog } from "@/dialogs/action-dialog";
import { useDialog } from "@/providers/DialogContextProvider";
import {
  useActivateUserMutation,
  useBlacklistUserMutation,
  useGetUserByPhoneNoQuery,
} from "@/store/apiSlice";
import { userDetailsTestIds } from "@/utils/testIds";

const BLACKLIST_DIALOG_ID = `blacklist-user-dialog`;
const ACTIVATE_DIALOG_ID = `activate-user-dialog`;

const ProfilePage: React.FC = () => {
  const { userPhoneNo } = useParams() as { userPhoneNo: string };
  const { data } = useGetUserByPhoneNoQuery({ phoneNo: userPhoneNo });
  const currentUser = data!.user;

  const [isBlacklisted, setIsBlacklisted] = useState<boolean>(
    currentUser.blacklisted,
  );

  const [blacklistUser] = useBlacklistUserMutation();
  const [activateUser] = useActivateUserMutation();

  const { openDialog, isDialogOpen } = useDialog();

  const handleBlacklistConfirm = async (comment: string) => {
    await blacklistUser({ phoneNo: userPhoneNo, comment });
    setIsBlacklisted(true);
  };

  const handleActivateConfirm = async (comment: string) => {
    await activateUser({ phoneNo: userPhoneNo, comment });
    setIsBlacklisted(false);
  };

  const handleBlacklistClicked = () => {
    if (!isBlacklisted) openDialog(BLACKLIST_DIALOG_ID);
  };

  const handleActivateClicked = () => {
    if (isBlacklisted) openDialog(ACTIVATE_DIALOG_ID);
  };

  const { name, email, phoneNo, createdAt, connectBal, blacklistedAt } =
    currentUser;

  const profileFields = [
    { label: "Email", value: email },
    { label: "Phone", value: phoneNo },
    {
      label: "Joined On",
      value: new Date(createdAt).toLocaleString(),
    },
    {
      label: "Blacklisted Status",
      value: isBlacklisted ? "The user is blacklisted" : "The user is active",
    },
    ...(isBlacklisted && blacklistedAt
      ? [
          {
            label: "Blacklisted On",
            value: new Date(blacklistedAt).toLocaleString(),
          },
        ]
      : []),
    {
      label: "Connect Balance",
      value: connectBal,
    },
  ];

  return (
    <div
      data-testid={userDetailsTestIds.getTabPageId(UserDetailsTabEnum.PROFILE)}
      className="flex-1 flex flex-col p-8 bg-gray-100 overflow-hidden"
    >
      <div className="flex-1 flex flex-col rounded-xl bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <h2 className="bg-white border-b border-gray-100 shadow-sm text-3xl flex items-center justify-between w-full px-8 py-4">
          User Profile
          <span className="text-xl">
            {currentUser.broker && <Pill color="yellow">BROKER</Pill>}
          </span>
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
              <div className="flex gap-3 items-center justify-center">
                <Button
                  aria-label="Blacklist User"
                  onClick={handleBlacklistClicked}
                  disabled={isBlacklisted}
                  className="rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Blacklist User
                </Button>
                <button
                  type="button"
                  aria-label="Activate User"
                  onClick={handleActivateClicked}
                  disabled={!isBlacklisted}
                  className="rounded-lg px-4 py-2 text-base bg-green-600 text-white cursor-pointer hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Activate User
                </button>
              </div>
            </div>
          </div>
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
