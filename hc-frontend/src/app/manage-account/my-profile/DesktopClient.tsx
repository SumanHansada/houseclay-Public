"use client";

import { Form, useFormikContext } from "formik";
import { CircleAlert, CircleCheck } from "lucide-react";
import WhatsAppIconSvg from "public/icons/whatsapp.svg";

import { getInitials } from "@/common/utils";
import { FormPhoneField, FormTextField } from "@/form-components";
import { MyProfileFormValues } from "@/interfaces/ManageAccount";

import { EmailVerifyIncentive } from "../components/EmailVerifyIncentive";

const WhatsAppIcon = WhatsAppIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;

interface DesktopClientProps {
  savedValues: MyProfileFormValues;
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  onVerifyEmail: () => void;
}

export function DesktopClient({
  editMode,
  setEditMode,
  onVerifyEmail,
  savedValues,
}: DesktopClientProps) {
  const { values, setFieldValue, resetForm } =
    useFormikContext<MyProfileFormValues>();

  return (
    <>
      {/* Page title */}
      <div className="border-b-2 pb-2 flex items-center justify-between mb-8">
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
            {getInitials(values.name)}
          </div>
        </div>

        {/* Form body */}
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
              {values.phoneVerified ? (
                <p className="text-green-600 mt-1 flex items-center gap-1">
                  <CircleCheck size={25} className="text-white fill-lime-500" />
                  Verified
                </p>
              ) : (
                <p className="text-red-600 mt-1 flex items-center gap-1">
                  <CircleAlert size={25} className="text-white fill-red-600" />
                  Phone Number is not verified
                </p>
              )}
            </div>

            {/* WhatsApp toggle */}
            <label
              className="flex items-center gap-4 lg:gap-1 xl:gap-4 cursor-pointer w-fit disabled:cursor-not-allowed"
              aria-disabled={editMode ? false : true}
            >
              <div className="flex gap-1 xl:gap-2 items-center">
                <WhatsAppIcon className="w-10 h-10 text-black" />
                <span className="text-nowrap">Available on WhatsApp</span>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  name="onWhatsapp"
                  checked={values.onWhatsapp}
                  onChange={() =>
                    setFieldValue("onWhatsapp", !values.onWhatsapp)
                  }
                  className="sr-only peer disabled:cursor-not-allowed"
                  disabled={!editMode}
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
              className="w-2/3"
              required
              disabled={values.emailVerified ? true : !editMode}
            />
            {values.emailVerified ? (
              <p className="text-green-600 mt-1 flex items-center gap-1">
                <CircleCheck size={25} className="text-white fill-lime-500" />
                Verified
              </p>
            ) : (
              <div className="space-y-6">
                <p className="text-red-600 mt-1 flex items-center gap-1">
                  <CircleAlert size={25} className="text-white fill-red-600" />
                  Email is not verified
                </p>
                {editMode ? null : (
                  <EmailVerifyIncentive onVerify={onVerifyEmail} />
                )}
              </div>
            )}
          </div>

          {/* Actions (desktop) */}
          {editMode ? (
            <footer className="mt-6 border-t-2 pt-4 flex justify-between shadow-sm">
              <button
                type="reset"
                className="px-3 py-1 md:px-5 md:py-2 border rounded-lg shadow-sm"
                onClick={() => {
                  resetForm({ values: savedValues });
                  setEditMode(false);
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 md:px-5 md:py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm"
              >
                Save
              </button>
            </footer>
          ) : null}
        </Form>
      </div>
    </>
  );
}
