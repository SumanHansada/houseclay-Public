"use client";

import { Formik, FormikHelpers } from "formik";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import EmailVerificationDialog from "@/dialogs/email-verification";
import EmailVerificationSuccessDialog from "@/dialogs/email-verification-success";
import { MyProfileFormValues } from "@/interfaces/ManageAccount";
import { useDialog } from "@/providers/DialogContextProvider";
import { setHideStickyNavBar } from "@/store/appSlice";
import { RootState } from "@/store/store";

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
  const { userDetail, userDetailLoading } = useSelector(
    (state: RootState) => state.user,
  );

  // RTK Query mutations
  // const [updateUserProfile, { isLoading: isUpdating }] =
  //   useUpdateUserProfileMutation();
  // const [sendEmailVerification] = useSendEmailVerificationMutation();
  // const [verifyEmailOTP] = useVerifyEmailOTPMutation();

  const initialValues: MyProfileFormValues = useMemo(
    () => ({
      name: userDetail?.name || "",
      phoneNumber: userDetail?.phoneNo || "",
      email: userDetail?.emailID || "",
      phoneVerified: true, //Already verified when a new user register, so always true
      onWhatsapp: userDetail?.onWhatsApp || false,
      emailVerified: userDetail?.emailVerified || false,
    }),
    [userDetail],
  );

  const [currentFormValues, setCurrentFormValues] =
    useState<MyProfileFormValues>(initialValues);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setCurrentFormValues(initialValues);
  }, [initialValues]);

  const handleEmailVerification = () =>
    openDialog(EMAIL_VERIFICATION_DIALOG_ID);

  const handleEmailVerificationSubmit = async (email: string, otp: string) => {
    try {
      console.log("email: " + email + ", otp: " + otp);
      // await verifyEmailOTP({ email, otp }).unwrap();

      // Update Redux state to reflect email verification
      // dispatch(updateUserInfo({ emailVerified: true }));

      closeVerificationDialog();
      openDialog(EMAIL_VERIFICATION_SUCCESS_DIALOG_ID);
    } catch (error) {
      console.error("Failed to verify email:", error);
      throw error; // Let the dialog handle the error
    }
  };

  const closeVerificationDialog = () => {
    closeDialog(EMAIL_VERIFICATION_DIALOG_ID);
    dispatch(setHideStickyNavBar(false));
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

  if (userDetailLoading || !userDetail) {
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
        {() => (
          <>
            {/* Desktop */}
            <section className="max-md:hidden">
              <DesktopClient
                editMode={editMode}
                setEditMode={setEditMode}
                onVerifyEmail={handleEmailVerification}
              />
            </section>

            {/* Mobile */}
            <section className="md:hidden">
              <MobileClient
                editMode={editMode}
                setEditMode={setEditMode}
                onVerifyEmail={handleEmailVerification}
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
            dispatch(setHideStickyNavBar(false));
          }}
        />
      )}
    </>
  );
}
