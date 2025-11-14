"use client";

import { ErrorMessage, Form, Formik, FormikHelpers } from "formik";
import React from "react";
import * as Yup from "yup";

import { FormCalendarField, FormTextField } from "@/form-components";
import FormRadioGroup from "@/form-components/FormRadioGroup";
import FormSelectDropdown from "@/form-components/FormSelectDropdown";

import { DocumentUpload } from "./components/DocumentUpload";

export interface AddAdminFormValues {
  name: string;
  // phone: string;
  // secondaryContact?: string;
  email: string;
  personalEmail: string;
  address: string;
  role: string;
  dateOfBirth: string;
  documents: { pan?: File | null; aadhaar?: File | null };
  joiningDate: string;
  active: boolean;
}

const dateField: Yup.StringSchema<string> = Yup.string()
  .transform((_, originalValue) =>
    originalValue instanceof Date
      ? originalValue.toISOString().split("T")[0]
      : originalValue,
  )
  .required("Date is required");

const schema: Yup.Schema<AddAdminFormValues> = Yup.object({
  name: Yup.string().required("Name is required"),
  // phone: Yup.string().required("Phone is required"),
  // secondaryContact: Yup.string(),
  email: Yup.string()
    .required("Company e-mail is required")
    .test(
      "no-at",
      "Don't type the domain; it's added automatically",
      (v = "") => !v.includes("@"),
    )
    .matches(/^\S+$/, "No spaces allowed"),
  personalEmail: Yup.string()
    .email("Invalid e-mail")
    .required("Personal e-mail is required"),
  address: Yup.string().required("Address is required"),
  role: Yup.string().required("Role is required"),
  dateOfBirth: dateField,
  joiningDate: dateField,
  documents: Yup.object()
    .shape({
      pan: Yup.mixed<File>().nullable(),
      aadhaar: Yup.mixed<File>().nullable(),
    })
    .test("pan-or-aadhaar", "Either PAN or Aadhaar must be provided", (docs) =>
      docs
        ? Boolean(docs.pan instanceof File || docs.aadhaar instanceof File)
        : false,
    ),
  active: Yup.boolean().required(),
});

const AddAdminPage: React.FC = () => {
  const initialValues: AddAdminFormValues = {
    name: "",
    // phone: "",
    // secondaryContact: "",
    email: "",
    personalEmail: "",
    address: "",
    role: "",
    dateOfBirth: "",
    documents: { pan: null, aadhaar: null },
    joiningDate: "",
    active: true,
  };

  const handleSubmit = async (
    v: AddAdminFormValues,
    actions: FormikHelpers<AddAdminFormValues>,
  ) => {
    const payload = { ...v, email: `${v.email}@houseclay.com` };
    console.log("submitting", payload);
    actions.setSubmitting(false);
  };

  return (
    <div className="mx-auto w-4/5 px-4 py-8">
      <h1 className="text-2xl md:text-3xl mb-6 font-semibold text-gray-800">
        Add New Zebra User
      </h1>

      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={handleSubmit}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormTextField
                name="name"
                id="name"
                label="Name"
                placeholder="Full name"
                required
              />
              {/* <FormPhoneInput
                label="Phone"
                name="phone"
                id="phone"
                defaultCountry="in"
                required
              />
              <FormPhoneInput
                label="Secondary Contact"
                name="secondaryContact"
                id="secondaryContact"
                defaultCountry="in"
              /> */}
              <FormTextField
                name="email"
                id="email"
                label="Email"
                type="email"
                placeholder="username"
                suffix="@houseclay.com"
                required
              />
              <FormTextField
                name="personalEmail"
                id="personalEmail"
                label="Personal Email"
                type="email"
                placeholder="Enter your personal email"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormTextField
                name="address"
                id="address"
                label="Address"
                placeholder="Enter address"
                required
              />
              <FormSelectDropdown
                label="Role"
                name="role"
                id="role"
                placeholder="Select role"
                options={[
                  { value: "ADMIN", label: "Admin" },
                  { value: "MANAGER", label: "Manager" },
                  { value: "CAPTAIN", label: "HouseClay Captain" },
                ]}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormCalendarField
                label="Date of Birth"
                name="dateOfBirth"
                dateFormat="yyyy-MM-dd"
                showPrevNextYear={true}
                required
              />
              <FormCalendarField
                label="Joining Date"
                name="joiningDate"
                dateFormat="yyyy-MM-dd"
                required
              />
            </div>

            <div>
              <h2 className="text-xl mb-4 font-medium text-gray-800">
                Documents
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DocumentUpload label="PAN" fieldName="pan" />
                <DocumentUpload label="Aadhaar" fieldName="aadhaar" />
              </div>
              <ErrorMessage
                name="documents"
                render={(msg) =>
                  typeof msg === "string" ? (
                    <p className="text-red-600 text-sm mt-1">{msg}</p>
                  ) : null
                }
              />
            </div>

            <FormRadioGroup
              name="active"
              label="Active"
              columns={2}
              horizontal
              options={[
                { value: true, label: "Yes" },
                { value: false, label: "No" },
              ]}
              required
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isSubmitting ? "Saving…" : "Create User"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddAdminPage;
