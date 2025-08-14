"use client";

import { Formik, Form } from "formik";
import * as Yup from "yup";

import { getInitials } from "@/common/utils";

import WhatsAppIconSvg from "public/icons/whatsapp-border.svg";
import CircleCheckIconSvg from "public/icons/circle-check.svg";
import CircleExclamationIconSvg from "public/icons/circle-exclamation.svg";
import CoinEggIconSvg from "public/icons/coin-egg.svg";
import { useState } from "react";
import { useDialog } from "@/providers/DialogContextProvider";
import EmailVerificationDialog from "@/dialogs/email-verification";
import { useDispatch } from "react-redux";
import { setHideStickyNavBar } from "@/store/appSlice";
import EmailVerificationSuccessDialog from "@/dialogs/email-verification-success";
import { FormPhoneField, FormTextField } from "@/form-components";

// Test
import { user } from "../dummy";

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

  const handleEmailVerification = () => {
    openDialog(EMAIL_VERIFICATION_DIALOG_ID);
  };

  const closeVerificationDialog = () => {
    closeDialog(EMAIL_VERIFICATION_DIALOG_ID);
    dispatch(setHideStickyNavBar(true));
  };

  const onVerificationSuccess = () => {
    closeVerificationDialog();
    openDialog(EMAIL_VERIFICATION_SUCCESS_DIALOG_ID);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Page title */}
        <div className="border-b-2 pb-2">
          <h1 className="text-2xl font-medium">My Profile</h1>
        </div>

        <div className="flex flex-col lg:flex-row lg:space-x-20 space-y-8 lg:space-y-0">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="size-40 bg-black rounded-full flex items-center justify-center text-[60px] text-white">
              {getInitials(user.name)}
            </div>
            {/* <button className="mt-2 underline underline-offset-4 text-gray-700">
              Upload Profile Photo
            </button> */}
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
              <Form className="flex-1 space-y-6">
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
                <div className="flex flex-col">
                  <div className="mt-1 flex items-end justify-between">
                    <div className="w-2/3">
                      <FormPhoneField
                        name="phoneNumber"
                        id="phoneNumber"
                        label="Phone Number"
                        defaultCountry="in"
                        placeholder="Enter phone number"
                        className="border border-gray-300 rounded-lg px-3 py-1 focus:ring-red-500 focus:border-red-500 cursor-not-allowed bg-gray-300"
                        // className={`border border-gray-300 rounded-lg px-3 py-1 focus:ring-red-500 focus:border-red-500 ${editMode ? "" : "cursor-not-allowed bg-gray-300"}`}
                        required
                        disabled
                      />
                    </div>

                    {/* WhatsApp toggle */}
                    <label className="flex items-center gap-5 cursor-pointer w-fit">
                      <div className="flex gap-2 items-center">
                        <WhatsAppIcon
                          width={40}
                          height={40}
                          className="text-black"
                        />
                        <span className="text-nowrap">
                          Available on WhatsApp
                        </span>
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
                    <div className="mt-2 p-3 bg-red-50 rounded-lg flex items-center justify-between w-2/3">
                      <CoinEggIcon />
                      <span className="text-lg w-1/2 px-2">
                        Verify your email address and earn<b> 1 Connect </b>
                        instantly!
                      </span>
                      <button
                        type="button"
                        className="text-lg font-medium text-red-500 hover:text-red-600 underline text-nowrap"
                        onClick={handleEmailVerification}
                      >
                        Verify Email Address
                      </button>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 text-lg">
                  {editMode ? (
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm"
                        onClick={() => setEditMode(false)}
                      >
                        Save
                      </button>
                      <button
                        type="reset"
                        className="px-5 py-2 border rounded-lg shadow-sm"
                        onClick={() => setEditMode(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm"
                      onClick={() => setEditMode(true)}
                    >
                      Edit
                    </button>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
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
            dispatch(setHideStickyNavBar(true));
          }}
        />
      )}
    </>
  );
}
