"use client";

import { Form, Formik, FormikHelpers } from "formik";
import React from "react";
import * as Yup from "yup";

import { Button } from "@/base-components";
import Spinner from "@/components/Spinner";
import {
  FormCalendarField,
  FormPhoneField,
  FormTextField,
} from "@/form-components";
import FormSelectDropdown from "@/form-components/FormSelectDropdown";

export interface AddAdminFormValues {
  name: string;
  phone: string;
  secondaryContact?: string;
  email: string;
  password: string;
  personalEmail: string;
  address: string;
  role: string;
  dateOfBirth: string;
  joiningDate: string;
}

const schema: Yup.Schema<AddAdminFormValues> = Yup.object({
  name: Yup.string().required("Name is required"),
  phone: Yup.string().required("Phone number is required"),
  secondaryContact: Yup.string(),
  email: Yup.string()
    .required("Company e-mail is required")
    .test(
      "no-at",
      "Don't type the domain; it's added automatically",
      (v = "") => !v.includes("@"),
    )
    .matches(/^\S+$/, "No spaces allowed"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long"),
  personalEmail: Yup.string()
    .email("Invalid e-mail")
    .required("Personal e-mail is required"),
  address: Yup.string().required("Address is required"),
  role: Yup.string().required("Role is required"),
  dateOfBirth: Yup.string().required("Date of birth is required"),
  joiningDate: Yup.string().required("Joining date is required"),
});

const AddAdminPage: React.FC = () => {
  const initialValues: AddAdminFormValues = {
    name: "",
    phone: "",
    secondaryContact: "",
    email: "",
    password: "",
    personalEmail: "",
    address: "",
    role: "",
    dateOfBirth: "",
    joiningDate: "",
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
              <FormPhoneField
                label="Phone"
                name="phone"
                id="phone"
                defaultCountry="in"
                placeholder="Enter phone number"
                className="border border-gray-300 rounded-lg px-3 py-1 focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                name="password"
                id="password"
                label="Password"
                type="password"
                placeholder="Enter password"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormSelectDropdown
                label="Role"
                name="role"
                id="role"
                placeholder="Select role"
                options={[
                  { value: "ADMIN", label: "Admin" },
                  { value: "MANAGER", label: "Manager" },
                  { value: "CAPTAIN", label: "Houseclay Captain" },
                ]}
                required
              />
              <FormCalendarField
                label="Joining Date"
                name="joiningDate"
                placeholder="Select joining date: Format 01-01-2026"
                dateFormat="dd-MM-yyyy"
                required
              />
            </div>

            <hr />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormTextField
                name="personalEmail"
                id="personalEmail"
                label="Personal Email"
                type="email"
                placeholder="Enter your personal email"
                required
              />
              <FormCalendarField
                label="Date of Birth"
                name="dateOfBirth"
                placeholder="Select date of birth: Format 01-01-1999"
                dateFormat="dd-MM-yyyy"
                showPrevNextYear={true}
                disablePrevDates={false}
                showYearDropdown={true}
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
              <FormPhoneField
                label="Secondary Contact"
                name="secondaryContact"
                id="secondaryContact"
                defaultCountry="in"
                placeholder="Enter secondary phone number"
                className="border border-gray-300 rounded-lg px-3 py-1 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div className="flex justify-end">
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg"
              >
                {isSubmitting ? <Spinner size="sm" /> : "Create User"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddAdminPage;
