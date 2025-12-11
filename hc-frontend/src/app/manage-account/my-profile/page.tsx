"use client";

import { Formik, FormikHelpers } from "formik";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
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
  useUpdateUserMutation,
  useVerifyEmailMutation,
} from "@/store/apiSlice";
import { RootState } from "@/store/store";
import { setEmailVerified, setUserDetail } from "@/store/userSlice";
import { getErrorMessage } from "@/utils/rtkQueryHelpers";

import { DesktopClient } from "./DesktopClient";
import Loading from "./loading";
import { MobileClient } from "./MobileClient";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  phoneNumber: Yup.string().required("Phone is required"),
  email: Yup.string()
    .email("Invalid email")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format",
    )
    .required("Email is required"),
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

  const [updateUser] = useUpdateUserMutation();
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
  const [profileLoading, setProfileLoading] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);

  useEffect(() => {
    setCurrentFormValues(initialValues);
  }, [initialValues]);

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
      toast.error(getErrorMessage(err));
    } finally {
      setVerificationLoading(false);
    }
  };

  const closeVerificationDialog = () => {
    closeDialog(EMAIL_VERIFICATION_DIALOG_ID);
  };

  const handleSubmit = async (
    values: MyProfileFormValues,
    helpers: FormikHelpers<MyProfileFormValues>,
  ) => {
    if (profileLoading) return;
    setProfileLoading(true);
    try {
      const updatedData = {
        name: values.name,
        email: values.email,
      };

      const result = await updateUser(updatedData).unwrap();
      console.warn("Update user result: ", result);
      dispatch(
        setUserDetail({
          name: values.name,
          emailID: values.email,
        }),
      );

      setCurrentFormValues(values);
      helpers.resetForm({ values });
      setEditMode(false);
      toast.success("Profile updated successfully!");
    } catch (err: unknown) {
      console.error("Failed to update profile:", err);
      toast.error(getErrorMessage(err));
      helpers.setStatus({ error: "Failed to update profile" });
    } finally {
      setProfileLoading(false);
    }
  };

  if (userDetailLoading || userDetailError) {
    return <Loading />;
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
        {({ isSubmitting, dirty }) => (
          <>
            {/* Desktop */}
            <section className="max-md:hidden">
              <DesktopClient
                editMode={editMode}
                setEditMode={setEditMode}
                onVerifyEmail={handleEmailOtpGeneration}
                updatingProfile={profileLoading || isSubmitting}
                noChanges={!dirty}
              />
            </section>

            {/* Mobile */}
            <section className="md:hidden">
              <MobileClient
                editMode={editMode}
                setEditMode={setEditMode}
                onVerifyEmail={handleEmailOtpGeneration}
                updatingProfile={profileLoading || isSubmitting}
                noChanges={!dirty}
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
