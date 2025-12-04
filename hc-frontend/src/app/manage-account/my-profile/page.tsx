"use client";

import { Formik, FormikHelpers } from "formik";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import {
  EmailVerificationDialog,
  EmailVerificationSuccessDialog,
} from "@/dialogs";
import { MyProfileFormValues } from "@/interfaces/ManageAccount";
import { useDialog } from "@/providers/DialogContextProvider";
import {
  useGenerateOtpEmailMutation,
  useLazyGetUserInfoQuery,
  useVerifyEmailMutation,
} from "@/store/apiSlice";
import { RootState } from "@/store/store";
import { setConnectBal, setEmailVerified } from "@/store/userSlice";

import { DesktopClient } from "./DesktopClient";
import Loading from "./loading";
import { MobileClient } from "./MobileClient";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  phoneNumber: Yup.string().required("Phone is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
});

const EMAIL_VERIFICATION_DIALOG_ID = "email-verification-dialog";
const EMAIL_VERIFICATION_SUCCESS_DIALOG_ID =
  "email-verification-success-dialog";

export default function MyProfilePage() {
  const { isDialogOpen, openDialog, closeDialog } = useDialog();
  const dispatch = useDispatch();
  const { userDetail, userDetailLoading, userDetailError } = useSelector(
    (state: RootState) => state.user,
  );
  const emailVerificationTokenRef = useRef("");

  const [getUserInfo] = useLazyGetUserInfoQuery();
  const [generateEmailOTP] = useGenerateOtpEmailMutation();
  const [verifyEmailOTP] = useVerifyEmailMutation();

  const initialValues: MyProfileFormValues = useMemo(
    () => ({
      name: userDetail.name,
      phoneNumber: userDetail.phoneNo,
      email: userDetail.emailID,
      phoneVerified: true, //Already verified when a new user register, so always true
      onWhatsapp: userDetail.onWhatsApp,
      emailVerified: userDetail.emailVerified,
    }),
    [userDetail],
  );

  const [currentFormValues, setCurrentFormValues] =
    useState<MyProfileFormValues>(initialValues);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setCurrentFormValues(initialValues);
  }, [initialValues]);

  const handleEmailOtpGeneration = async () => {
    try {
      const response = await generateEmailOTP().unwrap();
      console.log("generate otp response: ", response);
      if (response) {
        emailVerificationTokenRef.current = response;
        console.log("Token set:", response);
        openDialog(EMAIL_VERIFICATION_DIALOG_ID);
      } else {
        console.warn("Empty token from API");
      }
    } catch (err) {
      console.error("Error generating OTP:", err);
    }
  };

  const handleEmailVerificationSubmit = async (otp: string) => {
    if (!emailVerificationTokenRef.current) {
      throw new Error("No token available. Please request a new OTP.");
    }
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
        dispatch(setConnectBal(userInfoResponse?.connectBal));
      }
      openDialog(EMAIL_VERIFICATION_SUCCESS_DIALOG_ID);
    } catch (error) {
      console.error("Failed to verify email:", error);
      throw error;
    }
  };

  const closeVerificationDialog = () => {
    closeDialog(EMAIL_VERIFICATION_DIALOG_ID);
  };

  const handleSubmit = async (
    values: MyProfileFormValues,
    helpers: FormikHelpers<MyProfileFormValues>,
  ) => {
    try {
      // const updatedData = {
      //   name: values.name,
      //   phoneNo: values.phoneNumber,
      //   email: values.email,
      //   onWhatsApp: values.onWhatsapp,
      // };

      // TODO: Call API to update user profile
      // const result = await updateUserProfile(updatedData).unwrap();
      // dispatch(updateUserInfo({
      //   name: result.name,
      //   phoneNo: result.phoneNo,
      //   emailID: result.email,
      //   onWhatsApp: result.onWhatsApp,
      // }));

      setCurrentFormValues(values);
      helpers.resetForm({ values });
      setEditMode(false);
      console.log("Profile updated successfully: " + currentFormValues);
    } catch (error) {
      console.error("Failed to update profile:", error);
      helpers.setStatus({ error: "Failed to update profile" });
    }
  };

  if (userDetailLoading) {
    return <Loading />;
  }

  if (userDetailError) {
    return <div>Error loading profile: {userDetailError}</div>;
  }

  return (
    <>
      <Formik
        initialValues={currentFormValues}
        validationSchema={validationSchema}
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={handleSubmit}
        enableReinitialize={true}
        key={`${currentFormValues.name}-${currentFormValues.email}-${currentFormValues.phoneNumber}`} // Force re-render when values change
      >
        {() => (
          <>
            {/* Desktop */}
            <section className="max-md:hidden">
              <DesktopClient
                editMode={editMode}
                setEditMode={setEditMode}
                onVerifyEmail={handleEmailOtpGeneration}
              />
            </section>

            {/* Mobile */}
            <section className="md:hidden">
              <MobileClient
                editMode={editMode}
                setEditMode={setEditMode}
                onVerifyEmail={handleEmailOtpGeneration}
              />
            </section>
          </>
        )}
      </Formik>

      {isDialogOpen(EMAIL_VERIFICATION_DIALOG_ID) && (
        <EmailVerificationDialog
          id={EMAIL_VERIFICATION_DIALOG_ID}
          emailToVerify={userDetail.emailID}
          onSubmit={handleEmailVerificationSubmit}
          onClose={closeVerificationDialog}
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
