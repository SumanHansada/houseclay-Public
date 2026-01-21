"use client";

import { Form, Formik } from "formik";
import { X } from "lucide-react";
import { useState } from "react";
import * as Yup from "yup";

import { Button } from "@/base-components";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/Dialog";
import Spinner from "@/components/Spinner";
import { FormPhoneField, FormTextField } from "@/form-components";
import { useDialog } from "@/providers/DialogContextProvider";
import { useCreateHouseclayUserMutation } from "@/store/apiSlice";

interface AddNewHouseclayUserDialogProps {
  id: string;
}

interface AddUserFormValues {
  name: string;
  phoneNo: string;
  email?: string;
  blacklisted: boolean;
}

const schema: Yup.Schema<AddUserFormValues> = Yup.object({
  name: Yup.string().required("Name is required"),
  phoneNo: Yup.string().required("Phone number is required"),
  email: Yup.string().email("Invalid email").optional(),
  blacklisted: Yup.boolean().required(),
});

export const AddNewHouseclayUserDialog: React.FC<
  AddNewHouseclayUserDialogProps
> = ({ id }) => {
  const { closeDialog } = useDialog();
  const [createHouseclayUser] = useCreateHouseclayUserMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues: AddUserFormValues = {
    name: "",
    phoneNo: "",
    email: "",
    blacklisted: false,
  };

  const handleSubmit = async (values: AddUserFormValues) => {
    try {
      await createHouseclayUser({
        name: values.name,
        phoneNo: values.phoneNo,
        email: values.email || "",
        blacklisted: values.blacklisted,
      }).unwrap();
      closeDialog(id);
    } catch (error) {
      console.error("Failed to create user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    closeDialog(id);
  };

  return (
    <Dialog
      id={id}
      type="card"
      onClose={handleClose}
      entryAnimation="animate-fade-in"
      exitAnimation="animate-fade-out"
    >
      <DialogHeader>
        <div className="flex justify-between items-center w-full">
          <h3 className="text-2xl font-semibold">Add new Houseclay User</h3>
          <X className="cursor-pointer" onClick={handleClose} />
        </div>
      </DialogHeader>
      <DialogContent>
        <Formik
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={handleSubmit}
          validateOnChange={true}
          validateOnBlur={true}
        >
          {() => (
            <Form id="addUserForm" className="flex flex-col gap-4 px-6 py-6">
              <FormTextField
                name="name"
                id="name"
                label="Name"
                placeholder="Full name"
                required
              />
              <FormPhoneField
                label="Phone Number"
                name="phoneNo"
                id="phoneNo"
                defaultCountry="in"
                placeholder="Enter phone number"
                className="border border-gray-300 rounded-lg px-3 py-1 focus:ring-red-500 focus:border-red-500"
                required
              />
              <FormTextField
                name="email"
                id="email"
                label="Email"
                type="email"
                placeholder="Enter email (optional)"
              />
              {/* <FormRadioGroup
                name="blacklisted"
                label="Blacklisted"
                horizontal
                options={[
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
                required
              /> */}
            </Form>
          )}
        </Formik>
      </DialogContent>
      <DialogFooter>
        <div className="flex justify-end w-full">
          <Button
            variant="primary"
            className="rounded-lg"
            type="submit"
            form="addUserForm"
          >
            {isSubmitting ? <Spinner size="sm" /> : "Add New User"}
          </Button>
        </div>
      </DialogFooter>
    </Dialog>
  );
};
