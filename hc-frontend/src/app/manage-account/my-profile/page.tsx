"use client";

import { Formik, Form } from "formik";
import * as Yup from "yup";

import { getInitials } from "@/common/utils";

import { useState } from "react";
import { useDialog } from "@/providers/DialogContextProvider";
import EmailVerificationDialog from "@/dialogs/email-verification";
import { useDispatch } from "react-redux";
import { setHideStickyNavBar } from "@/store/appSlice";
import EmailVerificationSuccessDialog from "@/dialogs/email-verification-success";
import { FormPhoneField, FormTextField } from "@/form-components";

import WhatsAppIconSvg from "public/icons/whatsapp-border.svg";
import CircleCheckIconSvg from "public/icons/circle-check.svg";
import CircleExclamationIconSvg from "public/icons/circle-exclamation.svg";
import CoinEggIconSvg from "public/icons/coin-egg.svg";

// Test
import { user } from "../dummy";
import { ChevronLeft, SquarePen } from "lucide-react";
import { useRouter } from "next/navigation";

const WhatsAppIcon = WhatsAppIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const CircleCheckIcon = CircleCheckIconSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const CircleExclamationIcon = CircleExclamationIconSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const CoinEggIcon = CoinEggIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;

/* ------------------------------------------------------------------ */
/*  1. Formik setup                                                   */
/* ------------------------------------------------------------------ */
const initialValues = {
  name: user.name,
  phoneNumber: user.phone,
  whatsapp: user.onWhatsapp,
  email: user.email,
};

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

  const VerifiedBadge = ({ isVerified }: { isVerified: boolean }) => (
    <span className="inline-flex items-center gap-1 text-sm">
      {isVerified ? (
        <CircleCheckIcon width={16} height={16} className="text-green-600" />
      ) : (
        <CircleExclamationIcon
          width={16}
          height={16}
          className="text-red-600"
        />
      )}
      {isVerified ? "Verified" : "Not verified"}
    </span>
  );

  const DisplayRow = ({
    label,
    value,
    verificationStatus,
  }: {
    label: string;
    value: React.ReactNode;
    verificationStatus?: React.ReactNode;
  }) => (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-3">
      <div className="flex-1">
        <div className="text-xs text-gray-500">{label}</div>
        <div className="mt-0.5 text-base text-gray-900 break-words">
          {value}
        </div>
      </div>
      {verificationStatus ? (
        <div className="shrink-0 pt-4">{verificationStatus}</div>
      ) : null}
    </div>
  );

  const EmailVerifyIncentive = () =>
    !user.emailVerified ? (
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
            onClick={handleEmailVerification}
          >
            Verify Email Address
          </button>
        </div>
      </div>
    ) : null;

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

  return (
    <>
      {/* Desktop */}
      <section className="space-y-6 max-md:hidden">
        {/* Page title */}
        <div className="border-b-2 pb-2 flex items-center justify-between">
          <h1 className="text-2xl font-medium">My Profile</h1>
          <button
            type="button"
            className="md:px-5 md:py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm disabled:cursor-not-allowed disabled:bg-gray-300"
            onClick={() => setEditMode(true)}
            disabled={editMode}
          >
            Edit
          </button>
        </div>

        <div className="flex flex-col lg:flex-row lg:gap-6 xl:gap-10 2xl:gap-20 space-y-8 lg:space-y-0">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="size-32 2xl:size-40 bg-black rounded-full flex items-center justify-center text-5xl 2xl:text-[60px] text-white">
              {getInitials(user.name)}
            </div>
          </div>

          {/* Profile form */}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              console.log("Submit all data:", values);
              // TODO: call backend
            }}
            validateOnBlur={false}
            validateOnChange={false}
          >
            {({ values, setFieldValue }) => (
              <Form className="flex-1 space-y-4 md:space-y-6">
                {/* Name */}
                <FormTextField
                  name="name"
                  id="name"
                  label="Name"
                  placeholder="Full name"
                  className="w-2/3"
                  required
                  disabled={!editMode}
                />

                {/* Phone */}
                <div className="mt-1 flex flex-col lg:flex-row items-end lg:items-center justify-between lg:gap-1">
                  <div className="flex flex-col w-full">
                    <div className="w-full lg:w-fit 2xl:w-3/4">
                      <FormPhoneField
                        name="phoneNumber"
                        id="phoneNumber"
                        label="Phone Number"
                        defaultCountry="in"
                        placeholder="Enter phone number"
                        className="border border-gray-300 rounded-lg px-3 py-1 focus:ring-red-500 focus:border-red-500 cursor-not-allowed bg-gray-50"
                        required
                        disabled
                      />
                    </div>
                    {user.phoneVerified ? (
                      <p className="text-green-600 mt-1 flex items-center gap-1">
                        <CircleCheckIcon
                          width={20}
                          height={20}
                          className="text-green-600"
                        />
                        Verified
                      </p>
                    ) : (
                      <p className="text-red-600 mt-1 flex items-center gap-1">
                        <CircleExclamationIcon
                          width={20}
                          height={20}
                          className="text-red-600"
                        />
                        Phone Number is not verified
                      </p>
                    )}
                  </div>
                  {/* WhatsApp toggle */}
                  <label className="flex items-center gap-4 lg:gap-1 xl:gap-4 cursor-pointer w-fit">
                    <div className="flex gap-1 xl:gap-2 items-center">
                      <WhatsAppIcon className="w-10 h-10 text-black" />
                      <span className="text-nowrap">Available on WhatsApp</span>
                    </div>
                    {/* Toggle */}
                    <div className="relative">
                      {/* Hidden checkbox bound to Formik */}
                      <input
                        type="checkbox"
                        name="whatsapp"
                        checked={values.whatsapp}
                        onChange={() =>
                          setFieldValue("whatsapp", !values.whatsapp)
                        }
                        className="sr-only peer"
                      />
                      {/* Slider track + thumb */}
                      <div className="w-10 h-6 rounded-full bg-gray-300 peer-checked:bg-black transition-colors" />
                      <div className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow peer-checked:translate-x-4 transition-transform" />
                    </div>
                  </label>
                </div>

                {/* Email */}
                <div>
                  <FormTextField
                    name="email"
                    id="email"
                    label="Email"
                    placeholder="Enter your personal email"
                    className="w-2/3"
                    required
                    disabled={user.emailVerified ? true : !editMode}
                  />
                  {user.emailVerified ? (
                    <p className="text-green-600 mt-1 flex items-center gap-1">
                      <CircleCheckIcon
                        width={20}
                        height={20}
                        className="text-green-600"
                      />
                      Verified
                    </p>
                  ) : (
                    <p className="text-red-600 mt-1 flex items-center gap-1">
                      <CircleExclamationIcon
                        width={20}
                        height={20}
                        className="text-red-600"
                      />
                      Email is not verified
                    </p>
                  )}

                  {!user.emailVerified && (
                    <div className="mt-2 p-3 bg-red-50 rounded-lg flex flex-col xl:flex-row lg:items-center justify-between w-full md:w-11/12 2xl:w-3/4 gap-2">
                      <div className="flex gap-2 items-center w-full xl:w-3/4">
                        <CoinEggIcon />
                        <span className="md:text-lg px-1 w-4/5 md:px-2">
                          Verify your email address and earn<b> 1 Connect </b>
                          instantly!
                        </span>
                      </div>
                      <div className="flex justify-end md:w-full 2xl:w-auto">
                        <button
                          type="button"
                          className="md:text-lg font-medium text-red-500 hover:text-red-600 underline text-nowrap"
                          onClick={handleEmailVerification}
                        >
                          Verify Email Address
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 text-lg">
                  {editMode ? (
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="px-3 py-1 md:px-5 md:py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm"
                        onClick={() => setEditMode(false)}
                      >
                        Save
                      </button>
                      <button
                        type="reset"
                        className="px-3 py-1 md:px-5 md:py-2 border rounded-lg shadow-sm"
                        onClick={() => setEditMode(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : null}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </section>

      {/* Mobile */}
      <section className="md:hidden overflow-y-auto">
        <header className="fixed top-0 inset-x-0 z-50 h-[55px] border-b border-gray-200 bg-white">
          <div className="grid grid-cols-3 items-center h-full px-4">
            <button
              aria-label="Go back"
              className="justify-self-start rounded-full p-1 border"
              onClick={() => router.back()}
            >
              <ChevronLeft size={25} />
            </button>

            <h1 className="col-start-2 text-center font-medium truncate">
              My Profile
            </h1>

            <div className="justify-self-end w-6">
              <button
                type="button"
                onClick={() => setEditMode(true)}
                disabled={editMode}
              >
                <SquarePen size={20} />
              </button>
            </div>
          </div>
        </header>

        <div className="flex flex-col items-center py-6 mt-[55px]">
          <div className="size-36 bg-black rounded-full flex items-center justify-center text-5xl text-white">
            {getInitials(user.name)}
          </div>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log("Submit all data:", values);
            // TODO: call backend
          }}
          validateOnBlur={false}
          validateOnChange={false}
        >
          {({ values, setFieldValue }) =>
            editMode ? (
              /* ------------------------ EDIT MODE: form fields ------------------------ */
              <Form className="flex-1 space-y-5 px-8 py-4 mb-16">
                {/* Name */}
                <FormTextField
                  name="name"
                  id="name"
                  label="Name"
                  placeholder="Full name"
                  required
                  disabled={!editMode}
                />

                {/* Phone */}
                <div className="mt-1 flex flex-col gap-4">
                  <div className="flex flex-col w-full">
                    <div className="w-full">
                      <FormPhoneField
                        name="phoneNumber"
                        id="phoneNumber"
                        label="Phone Number"
                        defaultCountry="in"
                        placeholder="Enter phone number"
                        className="border border-gray-300 rounded-lg px-3 py-1 focus:ring-red-500 focus:border-red-500 cursor-not-allowed bg-gray-50"
                        required
                        disabled
                      />
                    </div>
                    {user.phoneVerified ? (
                      <p className="text-green-600 mt-1 flex items-center gap-1">
                        <CircleCheckIcon
                          width={20}
                          height={20}
                          className="text-green-600"
                        />
                        Verified
                      </p>
                    ) : (
                      <p className="text-red-600 mt-1 flex items-center gap-1">
                        <CircleExclamationIcon
                          width={20}
                          height={20}
                          className="text-red-600"
                        />
                        Phone Number is not verified
                      </p>
                    )}
                  </div>

                  {/* WhatsApp toggle */}
                  <label className="flex items-center gap-4 cursor-pointer w-full justify-between">
                    <div className="flex gap-1 items-center">
                      <WhatsAppIcon className="w-10 h-10 text-black" />
                      <span className="text-nowrap">Available on WhatsApp</span>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="whatsapp"
                        checked={values.whatsapp}
                        onChange={() =>
                          setFieldValue("whatsapp", !values.whatsapp)
                        }
                        className="sr-only peer"
                      />
                      <div className="w-10 h-6 rounded-full bg-gray-300 peer-checked:bg-black transition-colors" />
                      <div className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow peer-checked:translate-x-4 transition-transform" />
                    </div>
                  </label>
                </div>

                {/* Email */}
                <div>
                  <FormTextField
                    name="email"
                    id="email"
                    label="Email"
                    placeholder="Enter your personal email"
                    required
                    disabled={user.emailVerified ? true : !editMode}
                  />
                  {user.emailVerified ? (
                    <p className="text-green-600 mt-1 flex items-center gap-1">
                      <CircleCheckIcon
                        width={20}
                        height={20}
                        className="text-green-600"
                      />
                      Verified
                    </p>
                  ) : (
                    <p className="text-red-600 mt-1 flex items-center gap-1">
                      <CircleExclamationIcon
                        width={20}
                        height={20}
                        className="text-red-600"
                      />
                      Email is not verified
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="text-lg">
                  <div className="flex justify-between w-full mt-8">
                    <button
                      type="reset"
                      className="px-3 py-1 md:px-5 md:py-2 border rounded-lg shadow-sm"
                      onClick={() => setEditMode(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm"
                      onClick={() => setEditMode(false)}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </Form>
            ) : (
              /* ------------------- VIEW MODE: read-only display rows ------------------- */
              <div className="px-8 py-4 mb-16 space-y-4">
                <DisplayRow label="Name" value={values.name} />

                <DisplayRow
                  label="Phone Number"
                  value={`+${values.phoneNumber}`}
                  verificationStatus={
                    <VerifiedBadge isVerified={user.phoneVerified} />
                  }
                />

                <DisplayRow
                  label="Available on WhatsApp"
                  value={values.whatsapp ? "Yes" : "No"}
                />

                <DisplayRow
                  label="Email"
                  value={values.email}
                  verificationStatus={
                    <VerifiedBadge isVerified={user.emailVerified} />
                  }
                />

                <EmailVerifyIncentive />
              </div>
            )
          }
        </Formik>
      </section>

      {isDialogOpen(EMAIL_VERIFICATION_DIALOG_ID) && (
        <EmailVerificationDialog
          id={EMAIL_VERIFICATION_DIALOG_ID}
          emailToVerify={user.email}
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
