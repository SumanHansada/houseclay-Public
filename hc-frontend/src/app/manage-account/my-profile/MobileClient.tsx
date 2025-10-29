"use client";

import { Form, useFormikContext } from "formik";
import { ChevronLeft, CircleAlert, CircleCheck, SquarePen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { Button } from "@/base-components";
import { getInitials } from "@/common/utils";
import { FormPhoneField, FormTextField } from "@/form-components";
import { MyProfileFormValues } from "@/interfaces/ManageAccount";
import { MobileFooter, MobileHeader } from "@/layout-components";
import { setHideStickyNavBar } from "@/store/appSlice";
import { SvgIcon } from "@/utility-components";

import { EmailVerifyIncentive } from "../components/EmailVerifyIncentive";

interface MobileClientProps {
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  onBack?: () => void;
  onVerifyEmail: () => void;
}

function VerifiedBadge({ isVerified }: { isVerified: boolean }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm">
      {isVerified ? (
        <CircleCheck size={25} className="text-white fill-green-600" />
      ) : (
        <CircleAlert size={25} className="text-white fill-red-600" />
      )}
      {isVerified ? "Verified" : "Not verified"}
    </span>
  );
}

function DisplayRow({
  label,
  value,
  verificationStatus,
}: {
  label: string;
  value: React.ReactNode;
  verificationStatus?: React.ReactNode;
}) {
  return (
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
}

export function MobileClient({
  editMode,
  setEditMode,
  onVerifyEmail,
}: MobileClientProps) {
  const router = useRouter();
  const { values, setFieldValue, resetForm, initialValues } =
    useFormikContext<MyProfileFormValues>();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setHideStickyNavBar(editMode));
    return () => {
      dispatch(setHideStickyNavBar(false));
    };
  }, [dispatch, editMode]);

  const handleCancel = () => {
    resetForm({ values: initialValues });
    setEditMode(false);
  };

  return (
    <>
      <MobileHeader>
        <MobileHeader.LeftAction>
          <Button
            variant="secondary"
            size="custom"
            className="rounded-full p-1"
            onClick={() => (editMode ? setEditMode(false) : router.back())}
          >
            <ChevronLeft size={24} />
          </Button>
        </MobileHeader.LeftAction>
        <MobileHeader.Title>My Profile</MobileHeader.Title>
        {!editMode ? (
          <MobileHeader.RightAction>
            <Button
              variant="secondary"
              size="custom"
              className="rounded-full p-1"
              onClick={() => setEditMode(true)}
            >
              <SquarePen size={24} className="p-0.5" />
            </Button>
          </MobileHeader.RightAction>
        ) : null}
      </MobileHeader>

      <div className="md:hidden">
        <div className="flex flex-col items-center py-6">
          <div className="size-36 bg-black rounded-full flex items-center justify-center text-5xl text-white">
            {getInitials(values.name)}
          </div>
        </div>

        {editMode ? (
          <Form className="flex-1 space-y-5 px-8 py-5 mb-16">
            {/* Name */}
            <FormTextField
              name="name"
              id="name"
              label="Name"
              placeholder="Full name"
              required
            />

            {/* Phone (read-only) */}
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
                {values.phoneVerified ? (
                  <p className="text-green-600 mt-1 flex items-center gap-1">
                    <CircleCheck
                      size={20}
                      className="text-white fill-green-600"
                    />
                    Verified
                  </p>
                ) : (
                  <p className="text-red-600 mt-1 flex items-center gap-1">
                    <CircleAlert
                      size={25}
                      className="text-white fill-red-600"
                    />
                    Phone Number is not verified
                  </p>
                )}
              </div>

              {/* WhatsApp toggle */}
              <label className="flex items-center gap-4 cursor-pointer w-full justify-between">
                <div className="flex gap-1 items-center">
                  <SvgIcon iconSize="small" name="whatsapp" size={40} />
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
                disabled={values.emailVerified}
              />
              {values.emailVerified ? (
                <p className="text-green-600 mt-1 flex items-center gap-1">
                  <CircleCheck
                    size={25}
                    className="text-white fill-green-600"
                  />
                  Verified
                </p>
              ) : (
                <p className="text-red-600 mt-1 flex items-center gap-1">
                  <CircleAlert size={25} className="text-white fill-red-600" />
                  Email is not verified
                </p>
              )}
            </div>

            {/* Actions */}
            <MobileFooter>
              <button
                type="button"
                className="px-4 py-3 border rounded-xl hover:bg-gray-50"
                onClick={handleCancel}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl"
              >
                Save
              </button>
            </MobileFooter>
          </Form>
        ) : (
          <div className="px-6 pt-4 pb-16 space-y-4">
            <DisplayRow label="Name" value={values.name} />
            <DisplayRow
              label="Phone Number"
              value={`${values.phoneNumber}`}
              verificationStatus={
                <VerifiedBadge isVerified={values.phoneVerified} />
              }
            />
            <DisplayRow
              label="Available on WhatsApp"
              value={values.onWhatsapp ? "Yes" : "No"}
            />
            <DisplayRow
              label="Email"
              value={values.email}
              verificationStatus={
                <VerifiedBadge isVerified={values.emailVerified} />
              }
            />
            <EmailVerifyIncentive onVerify={onVerifyEmail} />
          </div>
        )}
      </div>
    </>
  );
}
