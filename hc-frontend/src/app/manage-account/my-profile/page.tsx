"use client";

import { useEffect, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useDialog } from "@/providers/DialogContextProvider";
import { setHideStickyNavBar } from "@/store/appSlice";
import { useDeviceContext } from "@/providers/DeviceContextProvider";

import EmailVerificationDialog from "@/dialogs/email-verification";
import EmailVerificationSuccessDialog from "@/dialogs/email-verification-success";
import CoinEggIconSvg from "public/icons/coin-egg.svg";

// dummy user for now
import { userDummy } from "../dummy";
import { DesktopClient } from "./DesktopClient";
import { MobileClient } from "./MobileClient";

const CoinEggIcon = CoinEggIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;

export interface MyProfileFormValues {
  name: string;
  phoneNumber: string;
  phoneVerified: boolean;
  onWhatsapp: boolean;
  email: string;
  emailVerified: boolean;
  connects: number;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  phoneNumber: Yup.string().required("Phone is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export function EmailVerifyIncentive({ onVerify }: { onVerify: () => void }) {
  return (
    <div className="mt-2 p-3 bg-red-50 rounded-lg flex flex-col justify-between w-full gap-2">
      <div className="flex gap-2 items-center w-full">
        <CoinEggIcon />
        <span className="px-1 w-4/5">
          Verify your email address and earn <b>1 Connect</b> instantly!
        </span>
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          className="font-medium text-red-500 hover:text-red-600 underline text-nowrap"
          onClick={onVerify}
        >
          Verify Email Address
        </button>
      </div>
    </div>
  );
}

const EMAIL_VERIFICATION_DIALOG_ID = "email-verification-dialog";
const EMAIL_VERIFICATION_SUCCESS_DIALOG_ID =
  "email-verification-success-dialog";

export default function MyProfilePage() {
  const [editMode, setEditMode] = useState(false);
  const { isMobile } = useDeviceContext();
  const { isDialogOpen, openDialog, closeDialog } = useDialog();
  const dispatch = useDispatch();
  const router = useRouter();

  // dummy data
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
    name: name,
    phoneNumber: phone,
    phoneVerified: phoneVerified,
    onWhatsapp: onWhatsapp,
    email: email,
    emailVerified: emailVerified,
    connects: connects,
  };
  const [savedValues, setSavedValues] =
    useState<MyProfileFormValues>(initialValues);

  const handleEmailVerification = () => {
    openDialog(EMAIL_VERIFICATION_DIALOG_ID);
  };

  const closeVerificationDialog = () => {
    closeDialog(EMAIL_VERIFICATION_DIALOG_ID);
    dispatch(setHideStickyNavBar(false));
  };

  const onVerificationSuccess = () => {
    closeVerificationDialog();
    openDialog(EMAIL_VERIFICATION_SUCCESS_DIALOG_ID);
  };

  useEffect(() => {
    if (isMobile) dispatch(setHideStickyNavBar(editMode));
  }, [dispatch, isMobile, editMode]);

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
          // TODO: call backend
          setEditMode(false);
        }}
      >
        {() =>
          isMobile ? (
            <MobileClient
              savedValues={savedValues}
              editMode={editMode}
              setEditMode={setEditMode}
              onBack={() => router.back()}
              onVerifyEmail={handleEmailVerification}
            />
          ) : (
            <DesktopClient
              savedValues={savedValues}
              editMode={editMode}
              setEditMode={setEditMode}
              onVerifyEmail={handleEmailVerification}
            />
          )
        }
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
