"use client";

import "react-international-phone/style.css";

import { ShieldCheck, X } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import HouseClayCaptainSvg from "public/icons/houseclay-captain.svg";
import React, { useEffect, useState } from "react";
import { PhoneInput } from "react-international-phone";
import { useDispatch, useSelector } from "react-redux";

import {
  AuthStep,
  ListPropertyDesktopStep,
  ListPropertyMobileStep,
  PropertyListingType,
} from "@/common/enums";
import Carousel2D from "@/components/Carousel2D";
import CustomerSupportBanner from "@/components/CustomerSupportBanner";
import { Dialog, DialogContent, DialogHeader } from "@/components/Dialog";
import Footer from "@/components/Footer";
import GetStarted from "@/components/GetStarted";
import ListingOptions from "@/components/ListingOptions";
import ListPropertyAdvantages from "@/components/ListPropertyAdvantages";
import ListWithUs from "@/components/ListWithUs";
import PropertyTypeOptions from "@/components/PropertyTypeOptions";
import { TestimonialCard } from "@/components/Testimonials";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";
import {
  useGenerateOtpMutation,
  useLazyCheckUserQuery,
} from "@/store/apiSlice";
import {
  setHideFooter,
  setHideHeader,
  setHideStickyNavBar,
} from "@/store/appSlice";
import { setAuthStep, setPhoneNo } from "@/store/authSlice";
import { clearAllFormData } from "@/store/listPropertySlice";
import { RootState } from "@/store/store";
import { setCheckUser } from "@/store/userSlice";

import dummyData from "../../data/dummyData.json";
import ListPropertyLoading from "./loading";

const HouseClayCaptain = HouseClayCaptainSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;

const ListPropertyPage = dynamic(
  () =>
    Promise.resolve(() => {
      const { isDialogOpen, openDialog, closeDialog } = useDialog();
      const { isMobile } = useDeviceContext();
      const router = useRouter();
      const token = useSelector((state: RootState) => state.auth.token);
      const phoneNo = useSelector((state: RootState) => state.auth.phoneNo);
      const listingType = useSelector(
        (state: RootState) => state.listProperty.listingType,
      );
      const propertyCategory = useSelector(
        (state: RootState) => state.listProperty.propertyCategory,
      );
      const handlePhoneChange = (data: string) => {
        // Remove '+' sign and update the phone number
        const sanitizedPhone = data.replace(/^\+/, "");
        dispatch(setPhoneNo(sanitizedPhone));
      };
      const dispatch = useDispatch();
      const [acceptTerms, setAcceptTerms] = useState(false);
      const [mobileStep, setMobileStep] = useState<ListPropertyMobileStep>(
        ListPropertyMobileStep.GET_STARTED,
      );
      const [desktopStep, setDesktopStep] = useState<ListPropertyDesktopStep>(
        ListPropertyDesktopStep.LISTING_OPTIONS,
      );
      const [triggerCheckUser] = useLazyCheckUserQuery();
      const [generateOtp] = useGenerateOtpMutation();

      const testimonials = dummyData.testimonials;

      useEffect(() => {
        dispatch(setAuthStep(AuthStep.PHONE));
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

      const handleListingTypeClick = () => {
        if (listingType === PropertyListingType.CALL) {
          openDialog("call-with-captain-dialog");
          return;
        } else if (listingType === PropertyListingType.DIY) {
          if (isMobile) {
            setMobileStep(ListPropertyMobileStep.PROPERTY_TYPE);
          } else {
            setDesktopStep(ListPropertyDesktopStep.PROPERTY_TYPE);
          }
          return;
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
        dispatch(clearAllFormData());
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
          } catch (err) {
            console.error("Login Error:", err);
            dispatch(setAuthStep(AuthStep.CREATE_USER));
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
                          onChange={(value) => handlePhoneChange(value)}
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
            <Dialog
              id="call-with-captain-dialog"
              type={isMobile ? "bottom-sheet" : "card"}
              onClose={() => {
                closeDialog("call-with-captain-dialog");
                dispatch(setHideStickyNavBar(true));
              }}
              width={isMobile ? 100 : 40}
              entryAnimation={
                isMobile ? "animate-slide-in-bottom" : "animate-fade-in"
              }
              exitAnimation={
                isMobile ? "animate-slide-out-top" : "animate-fade-out"
              }
            >
              <DialogHeader>
                <div
                  className={`${isMobile ? "py-2 px-8" : ""}  flex flex-col justify-between items-center w-full`}
                >
                  {isMobile && (
                    <>
                      <h1 className="text-xl py-1.5 text-black">Awesome!</h1>
                      <button className="absolute top-4 right-4 border border-gray-200 rounded-full md:border-none">
                        <X
                          onClick={() => {
                            closeDialog("call-with-captain-dialog");
                            dispatch(setHideStickyNavBar(true));
                          }}
                          size={25}
                        />
                      </button>
                    </>
                  )}
                </div>
              </DialogHeader>
              <DialogContent>
                <div
                  className={`flex flex-col items-center justify-center text-center ${isMobile ? "pt-6 pb-2 px-6" : "p-8"}`}
                >
                  <div className="relative overflow-hidden rounded-lg">
                    <div className="absolute inset-0 shadow-[inset_0_0_25px_25px_rgba(255,255,255,0.8)] z-20"></div>
                    <HouseClayCaptain />
                  </div>
                  {!isMobile && (
                    <h2 className="text-2xl font-medium">Awesome!</h2>
                  )}
                  {!isMobile && (
                    <h2 className="text-2xl font-medium">
                      We&apos;re Getting Started
                    </h2>
                  )}
                  <p className="text-base text-gray-500 my-4">
                    One of our team members will call you shortly to guide you
                    through the property listing process.
                  </p>
                  <button
                    className={`px-24 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition duration-200 ${isMobile ? "w-full" : ""}`}
                    onClick={() => closeDialog("call-with-captain-dialog")}
                  >
                    Great!
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </>
      );
    }),
  { ssr: false, loading: () => <ListPropertyLoading /> },
);

export default ListPropertyPage;
