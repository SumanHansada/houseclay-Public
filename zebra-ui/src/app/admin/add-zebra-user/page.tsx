"use client";

import { Form, Formik, FormikHelpers } from "formik";
import React from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";

import { Button } from "@/base-components";
import Spinner from "@/components/Spinner";
import {
  FormCalendarField,
  FormPhoneField,
  FormTextField,
} from "@/form-components";
import FormSelectDropdown from "@/form-components/FormSelectDropdown";
import { ADMIN_ROLES } from "@/interfaces/AdminAuth";
import { useRegisterMutation } from "@/store/apiSlice";
import { toErrorMessage } from "@/utils/rtkError";

export interface AddAdminFormValues {
  name: string;
  phoneNo: string;
  secondaryPhoneNo?: string;
  username: string;
  password: string;
  personalEmail: string;
  address: string;
  role: string;
  dateOfBirth: string;
  dateOfJoining: string;
}

const schema: Yup.Schema<AddAdminFormValues> = Yup.object({
  name: Yup.string().required("Name is required"),
  phoneNo: Yup.string().required("Phone number is required"),
  secondaryPhoneNo: Yup.string(),
  username: Yup.string()
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
  dateOfJoining: Yup.string().required("Joining date is required"),
});

const initialValues: AddAdminFormValues = {
  name: "",
  phoneNo: "",
  secondaryPhoneNo: "",
  username: "",
  password: "",
  personalEmail: "",
  address: "",
  role: "",
  dateOfBirth: "",
  dateOfJoining: "",
};

const AddAdminPage: React.FC = () => {
  const [registerUser] = useRegisterMutation();

  const handleSubmit = async (
    values: AddAdminFormValues,
    actions: FormikHelpers<AddAdminFormValues>,
  ) => {
    try {
      actions.setSubmitting(true);
      const payload = {
        ...values,
        username: `${values.username}@houseclay.com`,
      };
      await registerUser(payload).unwrap();
      toast.success("New Zebra user created successfully! 🎉");
      actions.resetForm();
    } catch (err: unknown) {
      const errorMessage = toErrorMessage(err);
      toast.error(errorMessage);
    } finally {
      actions.setSubmitting(false);
    }
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
                name="phoneNo"
                id="phoneNo"
                defaultCountry="in"
                placeholder="Enter phone number"
                className="border border-gray-300 rounded-lg px-3 py-1 focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormTextField
                name="username"
                id="username"
                label="Official Email (Username)"
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
                  { value: ADMIN_ROLES.MANAGER, label: "Manager" },
                  { value: ADMIN_ROLES.CAPTAIN, label: "Houseclay Captain" },
                ]}
                required
              />
              <FormCalendarField
                label="Joining Date"
                name="dateOfJoining"
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
                label="Secondary Phone Number"
                name="secondaryPhoneNo"
                id="secondaryPhoneNo"
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
