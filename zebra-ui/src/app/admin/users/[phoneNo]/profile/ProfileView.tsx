"use client";

import { CircleSlash, Clock, ExternalLink, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/base-components";
import { dialogLabels } from "@/common/constants";
import { CorporateBenefitStatus, UserDetailsTabEnum } from "@/common/enums";
import { InitialsAvatar } from "@/components/InitialsAvatar";
import Spinner from "@/components/Spinner";
import { ActionDialog } from "@/dialogs/action-dialog";
import { useDialog } from "@/providers/DialogContextProvider";
import {
  useActivateUserMutation,
  useBlacklistUserMutation,
  useGetUserByPhoneNoQuery,
  useUpdateUserProfileMutation,
} from "@/store/apiSlice";
import { userDetailsTestIds } from "@/utils/testIds";

const BLACKLIST_DIALOG_ID = `blacklist-user-dialog`;
const ACTIVATE_DIALOG_ID = `activate-user-dialog`;

export const ProfileView = ({ userPhoneNo }: { userPhoneNo: string }) => {
  const router = useRouter();
  const { data } = useGetUserByPhoneNoQuery({ phoneNo: userPhoneNo });

  const [blacklistUser] = useBlacklistUserMutation();
  const [activateUser] = useActivateUserMutation();
  const { openDialog, isDialogOpen } = useDialog();

  const [updateUserProfile, { isLoading: isUpdating }] =
    useUpdateUserProfileMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [editedCompanyName, setEditedCompanyName] = useState("");
  const [editedJobTitle, setEditedJobTitle] = useState("");
  const [editedEmail, setEditedEmail] = useState("");

  const handleBlacklistConfirm = async (comment: string) => {
    await blacklistUser({ phoneNo: userPhoneNo, comment }).unwrap();
  };

  const handleActivateConfirm = async (comment: string) => {
    await activateUser({ phoneNo: userPhoneNo, comment }).unwrap();
  };

  // Sync state when data changes or when entering edit mode
  useEffect(() => {
    if (!isEditing && data?.user) {
      setEditedCompanyName(data.user.companyName || "");
      setEditedJobTitle(data.user.jobTitle || "");
      setEditedEmail(data.user.email || "");
    }
  }, [isEditing, data?.user]);

  const isDirty = useMemo(
    () =>
      editedEmail !== (data?.user?.email || "") ||
      editedCompanyName !== (data?.user?.companyName || "") ||
      editedJobTitle !== (data?.user?.jobTitle || ""),
    [
      editedEmail,
      editedCompanyName,
      editedJobTitle,
      data?.user?.email,
      data?.user?.companyName,
      data?.user?.jobTitle,
    ],
  );

  // parent layout already ensures data is present
  if (!data?.user) return null;

  const {
    name,
    email,
    emailVerified,
    phoneNo,
    createdAt,
    connectBal,
    corporateBenefitStatus,
    corporateEmailID,
    corporateEmailVerifiedAt,
    companyName,
    jobTitle,
    blacklisted,
    blacklistedAt,
  } = data.user;

  const handleSaveProfile = async () => {
    if (!isDirty) return;
    if (editedEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editedEmail)) {
        toast.error("Please enter a valid email address");
        return;
      }
    }

    try {
      await updateUserProfile({
        phoneNo: userPhoneNo,
        payload: {
          companyName: editedCompanyName,
          jobTitle: editedJobTitle,
          emailID: editedEmail,
        },
      }).unwrap();
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile", err);
      // optionally handle error display here
    }
  };

  const profileFields = [
    { label: "Phone", value: phoneNo },
    {
      label: "Joined On",
      value: new Date(createdAt).toLocaleString(),
    },
    {
      label: "Connect Balance",
      value: connectBal,
    },
    { label: "Email", value: email },
    {
      label: "Personal Email Verified",
      value: emailVerified ? "Verified" : "Not Verified",
    },
    {
      label: "Blacklisted Status",
      value: blacklisted ? "User is Blacklisted" : "User is Active",
    },
    {
      label: "Blacklisted On",
      value:
        blacklisted && blacklistedAt
          ? new Date(blacklistedAt).toLocaleString()
          : "N/A",
    },
    {
      label: "Corporate Email",
      value: corporateEmailID ?? "N/A",
    },
    {
      label: "Corporate Benefit Status",
      customRender: (
        <div
          className={`flex items-center justify-between border rounded-xl p-2 ${
            isEditing
              ? "border-gray-200 text-gray-500 bg-gray-50 cursor-not-allowed"
              : "border-gray-400 text-gray-700 bg-white"
          }`}
        >
          <div className="flex items-center gap-1">
            {corporateBenefitStatus === CorporateBenefitStatus.APPROVED && (
              <ShieldCheck className="text-white fill-red-500" />
            )}
            {corporateBenefitStatus ===
              CorporateBenefitStatus.PENDING_ADMIN_APPROVAL && (
              <Clock className="text-yellow-500" />
            )}
            {corporateBenefitStatus === CorporateBenefitStatus.REJECTED && (
              <CircleSlash className="text-red-500" />
            )}
            <span
              className={`text-xl font-medium ${
                isEditing ? "text-gray-500" : "text-gray-700"
              }`}
            >
              {corporateBenefitStatus || "NONE"}
            </span>
          </div>
          {corporateBenefitStatus ===
            CorporateBenefitStatus.PENDING_ADMIN_APPROVAL && (
            <Button
              size="custom"
              className="px-3 py-1 rounded-lg"
              rightIcon={<ExternalLink size={16} />}
              disabled={isEditing}
              onClick={(e) => {
                e.preventDefault(); // prevent form submit behavior if any
                router.push(
                  "/admin/users/corporate-domains?page=1&status=pending",
                );
              }}
            >
              Review domains
            </Button>
          )}
        </div>
      ),
    },
    {
      label: "Corporate Email Verified At",
      value: corporateEmailVerifiedAt
        ? new Date(corporateEmailVerifiedAt).toLocaleString()
        : "N/A",
    },
    {
      label: "Company Name",
      value: companyName ?? "N/A",
      isEditable: true,
      editValue: editedCompanyName,
      setEditValue: setEditedCompanyName,
    },
    {
      label: "Job Title",
      value: jobTitle ?? "N/A",
      isEditable: true,
      editValue: editedJobTitle,
      setEditValue: setEditedJobTitle,
    },
  ];

  return (
    <div
      data-testid={userDetailsTestIds.getTabPageId(UserDetailsTabEnum.PROFILE)}
      className="flex-1 flex flex-col bg-gray-100 overflow-hidden"
    >
      <div className="flex-1 flex flex-col p-8 rounded-xl bg-white shadow-sm overflow-hidden">
        {/* Content */}
        <div className="flex-1 flex w-full gap-5 overflow-hidden">
          {/* Left Side - Avatar and Name */}
          <div className="flex flex-col items-center w-1/6 h-fit rounded-xl shadow-sm border overflow-hidden min-w-48">
            <div className="p-2 bg-gray-100 w-full flex items-center justify-center">
              <InitialsAvatar name={name} size="xl" />
            </div>
            <h3 className="text-2xl font-medium text-gray-800 text-center border w-full p-2 flex-col items-center justify-center">
              {name || "N/A"}
              {corporateBenefitStatus === CorporateBenefitStatus.APPROVED && (
                <div className="flex items-center justify-around gap-1 text-sm w-fit mx-auto">
                  <ShieldCheck className="text-white fill-red-500 size-5" />
                  <span className="underline">Corporate Verified</span>
                </div>
              )}
            </h3>
          </div>

          {/* Right Side */}
          <div className="flex-1 flex flex-col justify-between border rounded-xl shadow-sm overflow-hidden">
            <form className="flex flex-col justify-between gap-4 px-5 py-3 overflow-auto min-h-0 scrollbar-thin">
              {profileFields.map(
                ({
                  label,
                  value,
                  customRender,
                  isEditable,
                  editValue,
                  setEditValue,
                }) => {
                  const isEmailField = label === "Email";
                  const canEditField =
                    isEditable || (isEmailField && !emailVerified);

                  return (
                    <div key={label} className="flex flex-col gap-1">
                      <label className="text-gray-600 text-lg font-medium">
                        {label}
                      </label>
                      {customRender ? (
                        customRender
                      ) : isEditing && canEditField ? (
                        <input
                          type="text"
                          value={isEmailField ? editedEmail : editValue}
                          onChange={(e) =>
                            isEmailField
                              ? setEditedEmail(e.target.value)
                              : setEditValue && setEditValue(e.target.value)
                          }
                          disabled={isUpdating}
                          className="border border-gray-400 rounded-xl p-2 text-gray-900 text-xl bg-white focus:ring-2 focus:ring-red-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      ) : (
                        <input
                          type="text"
                          value={value}
                          disabled
                          className={`border rounded-xl p-2 text-xl ${
                            isEditing
                              ? "border-gray-200 text-gray-500 bg-gray-50 cursor-not-allowed"
                              : "border-gray-400 text-gray-700 bg-white"
                          }`}
                        />
                      )}
                    </div>
                  );
                },
              )}
            </form>

            {/* Footer */}
            <div className="sticky bottom-0 flex justify-between items-center border-t border-gray-200 shadow-sm p-3 bg-gray-50">
              {/* Left Side */}
              <div>
                {!isEditing &&
                  (!blacklisted ? (
                    <Button
                      aria-label="Blacklist User"
                      onClick={() => openDialog(BLACKLIST_DIALOG_ID)}
                      className="rounded-lg"
                    >
                      Blacklist User
                    </Button>
                  ) : (
                    <button
                      type="button"
                      aria-label="Activate User"
                      onClick={() => openDialog(ACTIVATE_DIALOG_ID)}
                      className="rounded-lg px-4 py-2 text-base bg-green-600 text-white cursor-pointer hover:bg-green-700"
                    >
                      Activate User
                    </button>
                  ))}
              </div>

              {/* Right Side */}
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    {isUpdating && <Spinner size="sm" />}
                    <Button
                      variant="outline"
                      className="rounded-lg"
                      onClick={() => setIsEditing(false)}
                      disabled={isUpdating}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleSaveProfile}
                      isLoading={isUpdating}
                      disabled={!isDirty}
                    >
                      {isDirty ? "Save Changes" : "No Changes"}
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    className="rounded-lg"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                )}
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
          requireComment
        />
      )}

      {isDialogOpen(ACTIVATE_DIALOG_ID) && (
        <ActionDialog
          id={ACTIVATE_DIALOG_ID}
          {...dialogLabels.activate}
          onConfirm={handleActivateConfirm}
          requireComment
        />
      )}
    </div>
  );
};
