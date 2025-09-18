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

import { DesktopClient } from "./DesktopClient";
import { MobileClient } from "./MobileClient";
import { selectUserDetail, selectUserDetailLoading } from "@/store/userSlice";
import { RootState } from "@/store/store";
import Loading from "./loading";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  phoneNumber: Yup.string().required("Phone is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
});

const EMAIL_VERIFICATION_DIALOG_ID = "email-verification-dialog";
const EMAIL_VERIFICATION_SUCCESS_DIALOG_ID =
  "email-verification-success-dialog";

export default function MyProfilePage() {
  const _isUserDetailLoading = useSelector(selectUserDetailLoading);
  const auth = useSelector((state: RootState) => state.auth);
  const userDetail = useSelector(selectUserDetail);
  const { isDialogOpen, openDialog, closeDialog } = useDialog();
  const dispatch = useDispatch();

  const initialValues: MyProfileFormValues = useMemo(
    () => ({
      name: auth.name || "",
      phoneNumber: auth.phoneNo || "",
      email: auth.emailID || "",

      // backend not ready yet
      phoneVerified: true,
      onWhatsapp: true,
      emailVerified: false,
    }),
    [auth.name, auth.phoneNo, auth.emailID],
  );

  const [currentFormValues, setCurrentFormValues] =
    useState<MyProfileFormValues>(initialValues);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setCurrentFormValues(initialValues);
  }, [initialValues]);

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

  const handleSubmit = async (
    values: MyProfileFormValues,
    helpers: FormikHelpers<MyProfileFormValues>,
  ) => {
    try {
      console.log("Submit all data:", values);

      // TODO: Call API to update user profile
      // await updateUserProfile(values);

      setCurrentFormValues(values);
      helpers.resetForm({ values });
      setEditMode(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  if (_isUserDetailLoading || !userDetail) {
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
          emailToVerify={auth.emailID}
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
