"use client";

import { Form, Formik } from "formik";
import { Mail, PhoneCall } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

import { SUPPORT_CONTACT, SUPPORT_EMAIL } from "@/common/constants";
import { FormPhoneField, FormTextArea, FormTextField } from "@/form-components";
import { Footer, MobileHeader } from "@/layout-components";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { setHideFooter, setHideHeader } from "@/store/appSlice";
import { ImageWithLoader, SvgIcon } from "@/utility-components";

interface ContactUsFormValues {
  name: string;
  phoneNumber: string;
  email: string;
  subject: string;
  message: string;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  phoneNumber: Yup.string().required("Phone is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  subject: Yup.string(),
  message: Yup.string(),
});

const initialValues: ContactUsFormValues = {
  name: "",
  phoneNumber: "",
  email: "",
  subject: "",
  message: "",
};

export default function ContactUsPage() {
  const [savedValues, setSavedValues] =
    useState<ContactUsFormValues>(initialValues);
  const { isMobile } = useDeviceContext();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isMobile) {
      dispatch(setHideHeader(true));
      dispatch(setHideFooter(true));
    } else {
      dispatch(setHideHeader(false));
      dispatch(setHideFooter(false));
    }
  }, [isMobile, dispatch]);

  return (
    <>
      <MobileHeader title="Contact Us" />

      <main className="relative w-full">
        {/* --- UNIFIED UPPER Section --- */}
        <section className="relative w-full">
          {/* Desktop Content */}
          <div className="hidden lg:block">
            <div className="absolute inset-0 -z-10">
              <ImageWithLoader
                src="/images/banner-background-contact-us.webp"
                alt="Banner Background"
                fill
                className="object-cover object-top md:object-center"
                sizes="100vw"
                priority
              />
            </div>
            <div className="xl:px-28 lg:px-14 md:px-14 px-8 pt-12 md:pt-16 lg:pt-20">
              <div className="w-2/3">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Contact Us
                </h1>
                <p className="mt-2 text-gray-900 text-2xl w-1/2">
                  We&apos;d love to hear from you. Our friendly team is always
                  here to chat.
                </p>
                <div className="mt-8 h-80 md:w-1/2 lg:w-7/12 xl:w-1/2">
                  <ImageWithLoader
                    src="/optimizedIcons/large/contact-support.svg"
                    alt="Contact support"
                    fill
                    className="object-center"
                    sizes="100vw"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile/Tablet Content*/}
          <div className="relative h-96 sm:h-[400px] md:h-[500px] lg:hidden">
            <div className="absolute inset-0 -z-10">
              <ImageWithLoader
                src="/optimizedIcons/large/banner-background-contact-us-mobile.svg"
                alt="Banner Background"
                fill
                className="object-center"
                sizes="100vw"
                priority
              />
            </div>
            {/* Centering container */}
            <div className="absolute inset-0 top-5 flex justify-center p-4 sm:p-8 h-fit">
              <h1 className="text-center text-xl sm:text-2xl md:text-3xl md:w-3/4 font-bold text-gray-900">
                We&apos;d love to hear from you. Our friendly team is always
                here to chat
              </h1>
            </div>
          </div>
        </section>

        {/* --- Form Section --- */}
        <section
          className="
            px-6 sm:px-8 lg:px-0 -mt-10
            sm:-mt-8 md:-mt-6 lg:mt-0
            lg:absolute lg:z-10
            lg:top-20
            lg:right-14 xl:right-28
            lg:w-[45%] xl:w-2/5
          "
        >
          <div className="rounded-xl bg-white lg:shadow-lg border border-gray-200 p-4 sm:p-6 md:p-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-6">
              Get in Touch!
            </h2>
            <Formik
              initialValues={savedValues}
              validationSchema={validationSchema}
              validateOnBlur={false}
              validateOnChange={false}
              onSubmit={(values) => {
                console.log("Submit all data:", values);
                setSavedValues(values);
              }}
              enableReinitialize
            >
              {() => (
                <Form className="space-y-4">
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

        {/* --- LOWER Section --- */}
        <section className="w-full bg-white max-md:mb-16">
          <div className="xl:px-28 lg:px-14 md:px-14 px-8 py-8 sm:py-12 lg:py-24 lg:pt-16 lg:pb-36 xl:pb-56">
            <div className="text-lg lg:w-1/2">
              <p className="w-full lg:w-4/5 xl:w-2/3 mb-8 tracking-wide">
                In case you have any questions, reach out to us through the
                following channels:
              </p>

              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="flex items-center gap-2 mb-4 w-fit"
              >
                <Mail width={25} height={25} className="text-red-500" />
                <span>{SUPPORT_EMAIL}</span>
              </a>

              <a
                href={`tel:${SUPPORT_CONTACT}`}
                className="flex gap-2 items-start w-fit"
              >
                <PhoneCall
                  width={25}
                  height={25}
                  className="text-red-500 mt-1"
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
        </section>
      </main>

      <Footer />
    </>
  );
}
