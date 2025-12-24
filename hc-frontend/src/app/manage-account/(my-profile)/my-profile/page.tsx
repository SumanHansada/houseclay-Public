"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import {
  EmailVerificationDialog,
  EmailVerificationSuccessDialog,
} from "@/dialogs";
import { useEditMode } from "@/hooks/useEditMode";
import { useDialog } from "@/providers/DialogContextProvider";
import {
  useGenerateOtpEmailMutation,
  useLazyGetUserInfoQuery,
  useVerifyEmailMutation,
} from "@/store/apiSlice";
import { RootState } from "@/store/store";
import { setEmailVerified, setUserDetail } from "@/store/userSlice";
import { getErrorMessage } from "@/utils/rtkQueryHelpers";

import { DesktopClient } from "./DesktopClient";
import Loading from "./loading";
import { MobileClient } from "./MobileClient";

const EMAIL_VERIFICATION_DIALOG_ID = "email-verification-dialog";
const EMAIL_VERIFICATION_SUCCESS_DIALOG_ID =
  "email-verification-success-dialog";

export default function MyProfilePage() {
  const { isDialogOpen, openDialog, closeDialog } = useDialog();
  const dispatch = useDispatch();
  const { userDetail, userDetailLoading, userDetailError } = useSelector(
    (state: RootState) => state.user,
  );
  const { editMode, setEditMode } = useEditMode();
  const emailVerificationTokenRef = useRef("");

  const [getUserInfo] = useLazyGetUserInfoQuery();
  const [generateEmailOTP] = useGenerateOtpEmailMutation();
  const [verifyEmailOTP] = useVerifyEmailMutation();
  const [verificationLoading, setVerificationLoading] = useState(false);

  const handleEmailOtpGeneration = async () => {
    if (verificationLoading) return;
    setVerificationLoading(true);
    try {
      const response = await generateEmailOTP().unwrap();
      console.log("generate otp response: ", response);
      if (response) {
        emailVerificationTokenRef.current = response;
        console.log("Token set:", response);
        openDialog(EMAIL_VERIFICATION_DIALOG_ID);
      } else {
        console.warn("Empty token from API");
        toast.error("Failed to generate OTP. Please try again.");
      }
    } catch (err: unknown) {
      console.error("Error generating OTP:", err);
      toast.error(getErrorMessage(err));
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleEmailVerificationSubmit = async (otp: string) => {
    if (!emailVerificationTokenRef.current) {
      throw new Error("No token available. Please request a new OTP.");
    }
    if (verificationLoading) return;
    setVerificationLoading(true);
    try {
      const response = await verifyEmailOTP({
        token: emailVerificationTokenRef.current,
        otp,
      }).unwrap();
      console.log("verification response: ", response);
      emailVerificationTokenRef.current = "";
      closeVerificationDialog();
      dispatch(setEmailVerified(true));
      const userInfoResponse = await getUserInfo().unwrap();
      if (userInfoResponse) {
        dispatch(setUserDetail(userInfoResponse));
      }
      openDialog(EMAIL_VERIFICATION_SUCCESS_DIALOG_ID);
    } catch (err: unknown) {
      console.error("Failed to verify email:", err);
      toast.error("Wrong OTP Code!");
    } finally {
      setVerificationLoading(false);
    }
  };

  const closeVerificationDialog = () => {
    closeDialog(EMAIL_VERIFICATION_DIALOG_ID);
  };

  if (userDetailLoading || userDetailError) {
    return <Loading />;
  }

  return (
    <>
      {/* Desktop */}
      <section className="max-md:hidden">
        <DesktopClient
          editMode={editMode}
          setEditMode={setEditMode}
          onVerifyEmail={handleEmailOtpGeneration}
        />
      </section>

      {/* Mobile - Layout handles header/footer, we just render content */}
      <section className="md:hidden">
        <MobileClient
          editMode={editMode}
          onVerifyEmail={handleEmailOtpGeneration}
        />
      </section>

      {isDialogOpen(EMAIL_VERIFICATION_DIALOG_ID) && (
        <EmailVerificationDialog
          id={EMAIL_VERIFICATION_DIALOG_ID}
          emailToVerify={userDetail.emailID}
          onSubmit={handleEmailVerificationSubmit}
          onClose={closeVerificationDialog}
          verificationLoading={verificationLoading}
        />
      )}

      {isDialogOpen(EMAIL_VERIFICATION_SUCCESS_DIALOG_ID) && (
        <EmailVerificationSuccessDialog
          id={EMAIL_VERIFICATION_SUCCESS_DIALOG_ID}
          onClose={() => {
            closeDialog(EMAIL_VERIFICATION_SUCCESS_DIALOG_ID);
          }}
        />
      )}
    </>
  );
}
