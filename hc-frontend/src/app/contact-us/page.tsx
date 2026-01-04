"use client";

import { Form, Formik, FormikHelpers } from "formik";
import { ChevronLeft, Mail, PhoneCall } from "lucide-react";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

import { Button } from "@/base-components";
import {
  bannerBackgroundContactUsImageURL,
  bannerBackgroundContactUsMobileImageURL,
  contactSupportImageURL,
} from "@/common/cdnURLs";
import { HOUSECLAY_SUPPORT } from "@/common/constants";
import { sanitizePhoneKeepCountryCode } from "@/common/utils";
import Spinner from "@/components/Spinner";
import { FormPhoneField, FormTextArea, FormTextField } from "@/form-components";
import { Footer, MobileHeader } from "@/layout-components";
import { useContactUsMutation } from "@/store/apiSlice";
import { ImageWithLoader } from "@/utility-components";

interface ContactUsFormValues {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  phone: Yup.string().required("Phone is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  subject: Yup.string().required("Subject is required"),
  message: Yup.string().required("Message is required"),
});

const initialValues: ContactUsFormValues = {
  name: "",
  phone: "",
  email: "",
  subject: "",
  message: "",
};

const formattedPhoneNumber = sanitizePhoneKeepCountryCode(
  HOUSECLAY_SUPPORT.phone,
);

export default function ContactUsPage() {
  const router = useRouter();

  const [contactUs, { isLoading, isSuccess, isError }] = useContactUsMutation();

  const handleSubmit = async (
    values: ContactUsFormValues,
    { resetForm }: FormikHelpers<ContactUsFormValues>,
  ) => {
    try {
      const payload = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        subject: values.subject,
        message: values.message,
      };

      await contactUs(payload).unwrap();

      resetForm();
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <>
      <MobileHeader>
        <MobileHeader.LeftAction>
          <Button
            variant="secondary"
            size="custom"
            className="rounded-full p-1"
            onClick={() => router.back()}
          >
            <ChevronLeft size={24} />
          </Button>
        </MobileHeader.LeftAction>
        <MobileHeader.Title>Contact Us</MobileHeader.Title>
      </MobileHeader>

      <section className="relative w-full">
        {/* --- UNIFIED UPPER Section --- */}
        <section
          aria-labelledby="contact-hero-title contact-hero-title-mobile"
          className="relative w-full"
        >
          {/* Desktop Content */}
          <div className="hidden lg:block">
            <div className="absolute inset-0 -z-10" aria-hidden="true">
              <ImageWithLoader
                src={bannerBackgroundContactUsImageURL}
                alt=""
                fill
                className="object-cover object-top md:object-center"
                sizes="100vw"
                priority
              />
            </div>
            <div className="xl:px-28 lg:px-14 md:px-14 px-8 pt-12 md:pt-16 lg:pt-20">
              <div className="w-2/3">
                <h1
                  id="contact-hero-title"
                  className="text-3xl md:text-4xl font-bold text-gray-900"
                >
                  Contact Us
                </h1>
                <p className="mt-2 text-gray-900 text-2xl w-1/2">
                  We&apos;d love to hear from you. Our friendly team is always
                  here to chat.
                </p>
                <div className="mt-8 h-80 md:w-1/2 lg:w-7/12 xl:w-1/2">
                  <ImageWithLoader
                    src={contactSupportImageURL}
                    alt="Contact support"
                    fill
                    className="object-center"
                    sizes="100vw"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile/Tablet Content*/}
          <div className="relative h-96 sm:h-[400px] md:h-[500px] lg:hidden">
            <div className="absolute inset-0 -z-10" aria-hidden="true">
              <ImageWithLoader
                src={bannerBackgroundContactUsMobileImageURL}
                alt=""
                fill
                className="object-center"
                sizes="100vw"
                priority
              />
            </div>
            {/* Centering container */}
            <div className="absolute inset-0 top-5 flex justify-center p-4 sm:p-8 h-fit">
              <h1
                id="contact-hero-title-mobile"
                className="text-center text-xl sm:text-2xl md:text-3xl md:w-3/4 font-bold text-gray-900"
              >
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
              initialValues={initialValues}
              validationSchema={validationSchema}
              validateOnBlur={false}
              validateOnChange={false}
              onSubmit={handleSubmit}
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
                    name="phone"
                    id="phone"
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
                    required
                  />
                  <FormTextArea
                    name="message"
                    id="message"
                    label="Message"
                    placeholder="Type your message"
                    className="w-full"
                    required
                  />

                  {/* Feedback Messages */}
                  {isSuccess && (
                    <div className="p-3 text-sm text-green-700 bg-green-100 rounded-lg">
                      Message sent successfully! We will get back to you soon.
                    </div>
                  )}
                  {isError && (
                    <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
                      Failed to send message. Please try again.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 px-3 py-1 md:px-5 md:py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed text-white rounded-lg shadow-sm transition-colors"
                  >
                    {isLoading && <Spinner size="sm" />}
                    {isLoading ? "Sending..." : "Submit"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </section>

        {/* --- LOWER Section --- */}
        <section
          aria-labelledby="contact-channels"
          className="w-full bg-white max-md:mb-16"
        >
          <h2 id="contact-channels" className="sr-only">
            Contact channels
          </h2>
          <div className="xl:px-28 lg:px-14 md:px-14 px-8 py-8 sm:py-12 lg:py-24 lg:pt-16 lg:pb-36 xl:pb-56">
            <div className="text-lg lg:w-1/2">
              <p className="w-full lg:w-4/5 xl:w-2/3 mb-8 tracking-wide">
                In case you have any questions, reach out to us through the
                following channels:
              </p>

              <a
                href={`mailto:${HOUSECLAY_SUPPORT.email}`}
                className="flex items-center gap-2 mb-4 w-fit"
              >
                <Mail width={25} height={25} className="text-red-500" />
                <span>{HOUSECLAY_SUPPORT.email}</span>
              </a>

              <a
                href={`tel:${formattedPhoneNumber}`}
                className="flex gap-2 items-start w-fit"
              >
                <PhoneCall
                  width={25}
                  height={25}
                  className="text-red-500 mt-1"
                />
                <div className="flex flex-col">
                  <span>{HOUSECLAY_SUPPORT.phone}</span>
                  <span className="text-sm text-gray-700">
                    (9 AM &ndash; 7 PM, Mon &ndash; Sat)
                  </span>
                </div>
              </a>
            </div>
          </div>
        </section>
      </section>

      <Footer />
    </>
  );
}
