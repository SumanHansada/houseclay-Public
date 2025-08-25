"use client";

import { Formik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

import EmailVerificationDialog from "@/dialogs/email-verification";
import EmailVerificationSuccessDialog from "@/dialogs/email-verification-success";
import { MyProfileFormValues } from "@/interfaces/ManageAccount";
import { useDialog } from "@/providers/DialogContextProvider";
import { setHideStickyNavBar } from "@/store/appSlice";

import { userDummy } from "../dummy";
import { DesktopClient } from "./DesktopClient";
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
  const [editMode, setEditMode] = useState(false);
  const { isDialogOpen, openDialog, closeDialog } = useDialog();
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    name,
    phone,
    phoneVerified,
    onWhatsapp,
    email,
    emailVerified,
    connects,
  } = userDummy;

  const initialValues: MyProfileFormValues = {
    name,
    phoneNumber: phone,
    phoneVerified,
    onWhatsapp,
    email,
    emailVerified,
    connects,
  };
  const [savedValues, setSavedValues] =
    useState<MyProfileFormValues>(initialValues);

  const handleEmailVerification = () =>
    openDialog(EMAIL_VERIFICATION_DIALOG_ID);

  const closeVerificationDialog = () => {
    closeDialog(EMAIL_VERIFICATION_DIALOG_ID);
    dispatch(setHideStickyNavBar(false));
  };

  const onVerificationSuccess = () => {
    closeVerificationDialog();
    openDialog(EMAIL_VERIFICATION_SUCCESS_DIALOG_ID);
  };

  return (
    <>
      <Formik
        initialValues={savedValues}
        validationSchema={validationSchema}
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={(values) => {
          console.log("Submit all data:", values);
          setSavedValues(values);
          setEditMode(false);
        }}
      >
        {() => (
          <>
            {/* Desktop */}
            <section className="max-md:hidden">
              <DesktopClient
                savedValues={savedValues}
                editMode={editMode}
                setEditMode={setEditMode}
                onVerifyEmail={handleEmailVerification}
              />
            </section>

            {/* Mobile */}
            <section className="md:hidden">
              <MobileClient
                savedValues={savedValues}
                editMode={editMode}
                setEditMode={setEditMode}
                onBack={() => router.back()}
                onVerifyEmail={handleEmailVerification}
              />
            </section>
          </>
        )}
      </Formik>

      {isDialogOpen(EMAIL_VERIFICATION_DIALOG_ID) && (
        <EmailVerificationDialog
          id={EMAIL_VERIFICATION_DIALOG_ID}
          emailToVerify={email}
          onSuccess={onVerificationSuccess}
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
