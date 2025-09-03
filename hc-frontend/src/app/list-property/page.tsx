"use client";

import "react-international-phone/style.css";

import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ShieldCheck, X } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { PhoneInput } from "react-international-phone";
import { useDispatch, useSelector } from "react-redux";

import {
  AuthStep,
  ErrorStatus,
  LeadCategory,
  ListPropertyDesktopStep,
  ListPropertyMobileStep,
  PropertyListingType,
} from "@/common/enums";
import Carousel2D from "@/components/Carousel2D";
import CustomerSupportBanner from "@/components/CustomerSupportBanner";
import GetStarted from "@/components/GetStarted";
import ListingOptions from "@/components/ListingOptions";
import ListPropertyAdvantages from "@/components/ListPropertyAdvantages";
import ListWithUs from "@/components/ListWithUs";
import PropertyTypeOptions from "@/components/PropertyTypeOptions";
import { TestimonialCard } from "@/components/Testimonials";
import { CallWithCaptainDialog } from "@/dialogs";
import { Footer } from "@/layout-components";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";
import {
  useGenerateLeadMutation,
  useGenerateOtpMutation,
  useLazyCheckUserQuery,
} from "@/store/apiSlice";
import {
  setHideFooter,
  setHideHeader,
  setHideStickyNavBar,
} from "@/store/appSlice";
import { setAuthStep } from "@/store/authSlice";
import { clearFormData } from "@/store/listPropertySlice";
import { RootState } from "@/store/store";
import { setCheckUser } from "@/store/userSlice";

import dummyData from "../../data/dummyData.json";
import ListPropertyLoading from "./loading";

const ListPropertyPage = dynamic(
  () =>
    Promise.resolve(() => {
      const { isDialogOpen, openDialog, closeDialog } = useDialog();
      const { isMobile } = useDeviceContext();
      const router = useRouter();
      const token = useSelector((state: RootState) => state.auth.token);
      const listingType = useSelector(
        (state: RootState) => state.listProperty.listingType,
      );
      const propertyCategory = useSelector(
        (state: RootState) => state.listProperty.propertyCategory,
      );

      const dispatch = useDispatch();
      const [phoneNo, setPhoneNo] = useState("");
      const [acceptTerms, setAcceptTerms] = useState(false);
      const [mobileStep, setMobileStep] = useState<ListPropertyMobileStep>(
        ListPropertyMobileStep.GET_STARTED,
      );
      const [desktopStep, setDesktopStep] = useState<ListPropertyDesktopStep>(
        ListPropertyDesktopStep.LISTING_OPTIONS,
      );
      const [triggerCheckUser] = useLazyCheckUserQuery();
      const [generateOtp] = useGenerateOtpMutation();
      const [generateLead] = useGenerateLeadMutation();

      const testimonials = dummyData.testimonials;

      useEffect(() => {
        dispatch(setAuthStep(AuthStep.PHONE));
        dispatch(clearFormData());
        if (isMobile) {
          dispatch(setHideHeader(true));
          dispatch(setHideFooter(true));
          dispatch(setHideStickyNavBar(true));
        } else {
          dispatch(setHideHeader(false));
          dispatch(setHideFooter(false));
          dispatch(setHideStickyNavBar(false));
        }
      }, [dispatch, isMobile]);

      const goToHomePage = () => {
        router.back();
      };

      const GetMobileHeader = () => {
        if (mobileStep === ListPropertyMobileStep.GET_STARTED) {
          return "Get Started";
        } else if (mobileStep === ListPropertyMobileStep.LISTING_OPTIONS) {
          return "List Your Property";
        } else if (mobileStep === ListPropertyMobileStep.PROPERTY_TYPE) {
          return "Type of Listing";
        }
      };

      const handleListingTypeClick = async () => {
        if (listingType === PropertyListingType.CALL) {
          try {
            const response = await generateLead({
              leadCategory: LeadCategory.PROPERTY_LISTING,
            });
            console.log(response);
            openDialog("call-with-captain-dialog");
          } catch (error) {
            console.error("Error generating lead:", error);
          }
        } else if (listingType === PropertyListingType.DIY) {
          if (isMobile) {
            setMobileStep(ListPropertyMobileStep.PROPERTY_TYPE);
          } else {
            setDesktopStep(ListPropertyDesktopStep.PROPERTY_TYPE);
          }
        }
      };

      const handlePostListingClick = () => {
        if (!propertyCategory) {
          console.error("Property type is not selected");
          return;
        }
        const url = `/list-property/${propertyCategory.toLowerCase()}`;
        console.log("Navigating to URL:", url);
        router.push(url);
      };

      const handlePrefetch = () => {
        if (propertyCategory) {
          const url = `/list-property/${propertyCategory.toLowerCase()}`;
          router.prefetch(url);
        }
      };

      const handleGetStarted = () => {
        setMobileStep(ListPropertyMobileStep.LISTING_OPTIONS);
      };

      const handleBack = () => {
        if (isMobile) {
          setMobileStep(ListPropertyMobileStep.LISTING_OPTIONS);
        } else {
          setDesktopStep(ListPropertyDesktopStep.LISTING_OPTIONS);
        }
      };

      const handlePostYourPropertyClick = async () => {
        if (acceptTerms && phoneNo.substring(2)) {
          try {
            const checkUserResponse = await triggerCheckUser({
              phoneNo,
            }).unwrap();
            console.log("Check User Response:", checkUserResponse);
            dispatch(setCheckUser(checkUserResponse));
            const otpResponse = await generateOtp({ phoneNo });
            console.log("OTP Response:", otpResponse);
            if (otpResponse.data) {
              dispatch(setAuthStep(AuthStep.OTP));
            }
          } catch (error) {
            const e = error as FetchBaseQueryError;
            console.error("Login Error:", e);
            if (e.status === ErrorStatus.NOT_FOUND) {
              dispatch(setAuthStep(AuthStep.CREATE_USER));
            }
          }
          openDialog("login-dialog");
        }
      };

      return (
        <>
          {/* Mobile Section */}
          <section
            className={`py-2 px-4 fixed top-0 left-0 right-0 z-50 border-b h-[55px] border-gray-200 bg-white flex flex-col justify-center items-center w-full md:hidden`}
          >
            <div className="flex justify-center items-center align-middle w-full md:hidden">
              <h1 className="text-lg my-auto text-black ml-auto">
                {GetMobileHeader()}
              </h1>

              <button className="border border-gray-200 rounded-full md:border-none ml-auto">
                <X onClick={goToHomePage} size={25} />
              </button>
            </div>
          </section>
          {/* Mobile Content */}
          <section className="w-full my-0 min-h-[calc(100svh-55px)] flex-col container pt-4 pb-2 px-6 mx-auto flex justify-between gap-16 md:hidden">
            {mobileStep === ListPropertyMobileStep.GET_STARTED && (
              <GetStarted onGetStarted={handleGetStarted} />
            )}
            {mobileStep === ListPropertyMobileStep.LISTING_OPTIONS && (
              <ListingOptions isMobile={true} onNext={handleListingTypeClick} />
            )}
            {mobileStep === ListPropertyMobileStep.PROPERTY_TYPE && (
              <PropertyTypeOptions
                isMobile={true}
                onNext={handlePostListingClick}
                onBack={handleBack}
                handlePrefetch={handlePrefetch}
              />
            )}
          </section>

          {/* Desktop Section */}
          <section className="xl:min-h-[500px] min-h-[400px] max-md:min-h-[fit-content] w-full overflow-hidden max-md:hidden">
            <div className="container py-12 mx-auto xl:px-28 lg:px-14 md:px-8 px-8 flex justify-between gap-16">
              <div className="flex w-2/5 justify-around items-start">
                <Image
                  src={"/images/list-your-property.svg"}
                  alt="List Your Property"
                  objectFit="contain"
                  width={550}
                  height={475}
                  className="my-0"
                />
              </div>
              <div className="flex w-3/5 justify-end items-center">
                <div className="max-w-lg xl:max-w-xl lg:w-full my-0 flex flex-col gap-8">
                  {!token ? (
                    <>
                      <div className="flex flex-col">
                        <label className="block mb-2 text-base font-medium text-gray-700">
                          Phone Number
                        </label>
                        <PhoneInput
                          defaultCountry="in"
                          value={phoneNo}
                          placeholder={"Enter phone number"}
                          onChange={(value) => setPhoneNo(value)}
                          className="custom-phone-input w-full border border-gray-300 rounded-lg px-2 py-0.5 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="flex items-center">
                        <input
                          id="terms"
                          type="checkbox"
                          className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500 accent-red-500"
                          checked={acceptTerms}
                          onChange={(e) => setAcceptTerms(e.target.checked)}
                        />
                        <label
                          htmlFor="terms"
                          className="ml-2 text-sm text-gray-700"
                        >
                          I accept the{" "}
                          <a href="#" className="text-gray-700 underline">
                            Terms & Conditions
                          </a>{" "}
                          &{" "}
                          <a href="#" className="text-gray-700 underline">
                            Privacy Policy
                          </a>
                        </label>
                      </div>

                      <div className="flex flex-col items-center">
                        <button
                          className={`w-full px-6 py-3 text-base text-white rounded-md  ${!acceptTerms || !phoneNo.substring(2) ? "bg-red-300" : "bg-red-500 hover:bg-red-600"}`}
                          disabled={!acceptTerms || !phoneNo.substring(2)}
                          onClick={handlePostYourPropertyClick}
                        >
                          Post Your Property – It&apos;s free
                        </button>

                        <p className="mt-2 text-base text-center text-gray-500">
                          Don&apos;t worry we won&apos;t spam you.
                        </p>
                      </div>

                      <div className="flex flex-col items-center">
                        <ShieldCheck
                          className="text-white fill-gray-600"
                          size={32}
                        />
                        <p className="mt-2 text-sm text-center text-gray-400">
                          More than 800+ owners have listed their properties on
                          HouseClay and closed their deal.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      {desktopStep ===
                        ListPropertyDesktopStep.LISTING_OPTIONS && (
                        <ListingOptions
                          isMobile={false}
                          onNext={handleListingTypeClick}
                        />
                      )}

                      {desktopStep ===
                        ListPropertyDesktopStep.PROPERTY_TYPE && (
                        <PropertyTypeOptions
                          isMobile={false}
                          onNext={handlePostListingClick}
                          onBack={handleBack}
                          handlePrefetch={handlePrefetch}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Rest of the sections */}
          <section className="w-full overflow-hidden max-md:hidden">
            <ListWithUs />
          </section>

          <section className="w-full overflow-hidden max-md:hidden">
            <CustomerSupportBanner />
          </section>

          <section className="w-full overflow-hidden max-md:hidden">
            <div className="container py-12 mx-auto xl:px-28 lg:px-14 md:px-8 px-8">
              <div className="flex justify-around items-center gap-16">
                <div className="flex flex-col w-1/2">
                  <h2 className="text-3xl font-bold text-gray-800">
                    Trusted by Landlords Across Top Cities
                  </h2>
                  <p className="mt-4 text-base text-gray-600">
                    Trusted by landlords in top cities to deliver fast,
                    reliable, and hassle-free property listing solutions!
                  </p>
                </div>

                <div className="flex w-1/2">
                  <Carousel2D
                    slideWidth={400}
                    gap={4}
                    showDots={true}
                    showArrows={true}
                  >
                    {testimonials.map((testimonial) => (
                      <TestimonialCard
                        key={testimonial.id}
                        testimonial={testimonial}
                      />
                    ))}
                  </Carousel2D>
                </div>
              </div>
            </div>
          </section>

          <section className="w-full overflow-hidden max-md:hidden">
            <ListPropertyAdvantages />
          </section>

          <Footer />

          {/* Call with Captain Dialog */}
          {isDialogOpen("call-with-captain-dialog") && (
            <CallWithCaptainDialog
              id="call-with-captain-dialog"
              onClose={() => {
                closeDialog("call-with-captain-dialog");
                dispatch(setHideStickyNavBar(true));
              }}
            />
          )}
        </>
      );
    }),
  { ssr: false, loading: () => <ListPropertyLoading /> },
);

export default ListPropertyPage;
