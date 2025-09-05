"use client";

import { SUPPORT_CONTACT, SUPPORT_EMAIL } from "@/common/constants";
import { FormPhoneField, FormTextArea, FormTextField } from "@/form-components";
import { Footer } from "@/layout-components";
import { ImageWithLoader } from "@/utility-components";
import { Form, Formik, useFormikContext } from "formik";
import { Mail, PhoneCall } from "lucide-react";
import { useState } from "react";
import * as Yup from "yup";

interface ContactUsFormValues {
  name: string;
  phoneNumber: string;
  email: string;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  phoneNumber: Yup.string().required("Phone is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
});

const initialValues: ContactUsFormValues = {
  name: "",
  phoneNumber: "",
  email: "",
};

export default function ContactUsPage() {
  const [savedValues, setSavedValues] =
    useState<ContactUsFormValues>(initialValues);

  // const { values, setFieldValue } = useFormikContext<ContactUsFormValues>();

  return (
    <>
      <section className="relative w-full h-full flex">
        <div className="w-full">
          <div className="w-full bg-gray-100">
            <div>
              <h1>Contact Us</h1>
              <p>
                We&apos;love to hear from you. Our friendly team is always here
                to chat
              </p>
              <div>
                <ImageWithLoader
                  src="/icons/static-pages/contact-support.svg"
                  alt="contact support"
                  width={360}
                  height={360}
                  className="max-lg:m-auto"
                />
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-300 pb-32">
            <div className="text-lg">
              <p className="w-11/12 mb-8 tracking-wide max-lg:hidden">
                In case you have any questions, Reach out to us through the
                following channels:
              </p>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="flex items-center gap-2 mb-4"
              >
                <Mail width={25} height={25} className="text-red-500" />
                <span>{SUPPORT_EMAIL}</span>
              </a>
              <a
                href={`tel:${SUPPORT_CONTACT}`}
                className="flex gap-2 items-start"
              >
                <PhoneCall
                  width={25}
                  height={25}
                  className="text-red-500 mt-2"
                />

                <div className="flex flex-col">
                  <span>{SUPPORT_CONTACT}</span>
                  <span className="text-sm text-gray-700">
                    (9 AM &ndash; 7 PM, Mon &ndash; Sat)
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="absolute top-12 right-28 p-6 rounded-lg shadow-md w-1/3 bg-white">
          <h1 className="text-2xl font-bold mb-6">Get in Touch!</h1>
          <Formik
            initialValues={savedValues}
            validationSchema={validationSchema}
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={(values) => {
              console.log("Submit all data:", values);
              setSavedValues(values);
            }}
          >
            {() => (
              <Form className="space-y-4">
                {/* Name */}
                <FormTextField
                  name="name"
                  id="name"
                  label="Name"
                  placeholder="Full name"
                  className="w-full"
                  required
                />

                <FormTextField
                  name="email"
                  id="email"
                  label="Email"
                  placeholder="Enter your personal email"
                  className="w-full"
                  required
                />

                <FormPhoneField
                  name="phoneNumber"
                  id="phoneNumber"
                  label="Phone Number"
                  defaultCountry="in"
                  placeholder="Enter phone number"
                  className="border border-gray-300 rounded-lg px-3 py-1 focus:ring-red-500 focus:border-red-500 bg-gray-50"
                  required
                />

                <FormTextField
                  name="subject"
                  id="subject"
                  label="Subject"
                  placeholder="Enter your subject"
                  className="w-full"
                />

                <FormTextArea
                  name="message"
                  id="message"
                  label="Message"
                  placeholder="Type your message"
                  className="w-full"
                />

                <button
                  type="submit"
                  className="px-3 py-1 md:px-5 md:py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm"
                >
                  Submit
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </section>
      <Footer />
    </>
  );
}
