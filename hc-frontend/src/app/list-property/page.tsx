"use client";

import "react-international-phone/style.css";

import { Lightbulb, ShieldCheck, X } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CallWithCaptainSvg from "public/icons/call-with-captain.svg";
import CreateNewListingSvg from "public/icons/create-new-listing.svg";
import FlatmatesSvg from "public/icons/flatmates.svg";
import GoLiveSvg from "public/icons/get-started/go-live.svg";
import PropertyBasicsSvg from "public/icons/get-started/property-basics.svg";
import ShowcaseYourSpaceSvg from "public/icons/get-started/showcase-your-space.svg";
import HouseClayCaptainSvg from "public/icons/houseclay-captain.svg";
import RentSvg from "public/icons/rent.svg";
import ResaleSvg from "public/icons/resale.svg";
import React, { useEffect, useState } from "react";
import { PhoneInput } from "react-international-phone";
import { useDispatch, useSelector } from "react-redux";

import { AuthStep, PropertyListingType, PropertyType } from "@/common/enums";
import Carousel2D from "@/components/Carousel2D";
import CustomerSupportBanner from "@/components/CustomerSupportBanner";
import { Dialog, DialogContent, DialogHeader } from "@/components/Dialog";
import Footer from "@/components/Footer";
import ListingOption from "@/components/ListingOption";
import ListPropertyAdvantages from "@/components/ListPropertyAdvantages";
import ListWithUs from "@/components/ListWithUs";
import PropertyTypeOption from "@/components/PropertyTypeOption";
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
import {
  setListingType,
  setPropertyType,
  setShowPropertyType,
} from "@/store/listPropertySlice";
import { RootState } from "@/store/store";
import { setCheckUser } from "@/store/userSlice";

import dummyData from "../../data/dummyData.json";
import ListPropertyLoading from "./loading";

const CreateNewListing = CreateNewListingSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const CallWithCaptain = CallWithCaptainSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const HouseClayCaptain = HouseClayCaptainSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;

const Rent = RentSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const Resale = ResaleSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const Flatmates = FlatmatesSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const GoLive = GoLiveSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const ShowcaseYourSpace = ShowcaseYourSpaceSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const PropertyBasics = PropertyBasicsSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;

const propertyTypes = [
  {
    id: "rent",
    label: "Rent",
    icon: <Rent />,
    type: PropertyType.RENT,
  },
  {
    id: "resale",
    label: "Resale",
    icon: <Resale />,
    type: PropertyType.RESALE,
  },
  {
    id: "flatmates",
    label: "Flatmates",
    icon: <Flatmates />,
    type: PropertyType.FLATMATES,
  },
];

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
      const showPropertyType = useSelector(
        (state: RootState) => state.listProperty.showPropertyType,
      );
      const propertyType = useSelector(
        (state: RootState) => state.listProperty.propertyType,
      );
      const handlePhoneChange = (data: string) => {
        // Remove '+' sign and update the phone number
        const sanitizedPhone = data.replace(/^\+/, "");
        dispatch(setPhoneNo(sanitizedPhone));
      };
      const dispatch = useDispatch();
      const [acceptTerms, setAcceptTerms] = useState(false);
      const [showGetStarted, setShowGetStarted] = useState(
        isMobile ? true : false,
      );
      const [triggerCheckUser] = useLazyCheckUserQuery();
      const [generateOtp] = useGenerateOtpMutation();

      const testimonials = dummyData.testimonials;
      const showListingOptions = token && !showPropertyType;
      const showPropertyTypeOptions = token && showPropertyType;

      useEffect(() => {
        dispatch(setAuthStep(AuthStep.PHONE));
        if (isMobile) {
          dispatch(setHideHeader(true));
          dispatch(setHideFooter(true));
          dispatch(setHideStickyNavBar(true));
          setShowGetStarted(true);
        } else {
          dispatch(setHideHeader(false));
          dispatch(setHideFooter(false));
          dispatch(setHideStickyNavBar(false));
        }
      }, [dispatch, isMobile]);

      const handleListingTypeClick = () => {
        if (listingType === PropertyListingType.CALL) {
          openDialog("call-with-captain-dialog");
          return;
        } else if (listingType === PropertyListingType.DIY) {
          dispatch(setShowPropertyType(true));
          return;
        }
      };

      const handlePostListingClick = () => {
        if (!propertyType) {
          console.error("Property type is not selected");
          return;
        }
        const url = `/list-property/${propertyType.toLowerCase()}`;
        console.log("Navigating to URL:", url);
        router.push(url);
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

      const goToHomePage = () => {
        router.push("/");
      };

      return (
        <>
          {/* Mobile Section */}
          <section
            className={`py-2 px-4 fixed top-0 left-0 right-0 z-50 border-b h-[55px] border-gray-200 bg-white flex flex-col justify-center items-center w-full md:hidden`}
          >
            <div className="flex justify-center items-center align-middle w-full md:hidden">
              <h1 className="text-lg my-auto text-black ml-auto">
                {showGetStarted ? "Get Started" : "List Your Property"}
              </h1>

              <button className="border border-gray-200 rounded-full md:border-none ml-auto">
                <X onClick={goToHomePage} size={25} />
              </button>
            </div>
          </section>
          {showGetStarted && (
            <section className="flex flex-col items-start justify-around min-h-[calc(100vh-55px)] bg-white px-6 py-4 md:hidden gap-8 w-full mx-auto">
              <h1 className="text-2xl">
                It&apos;s easy to list property on Houseclay
              </h1>
              <div className="flex flex-col gap-6 w-full mx-auto">
                <div className="flex items-start gap-4">
                  <PropertyBasics />
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="font-normal text-lg">
                      1. Property Basics
                    </div>
                    <div className="text-gray-500 text-sm">
                      Choose property type & enter location.
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <ShowcaseYourSpace />
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="font-normal text-lg">
                      2. Showcase Your Space
                    </div>
                    <div className="text-gray-500 text-sm">
                      Upload photos, add key details & set price.
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <GoLive />
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="font-normal text-lg">
                      3. Go Live & Get Leads!
                    </div>
                    <div className="text-gray-500 text-sm">
                      Post instantly & connect with buyers/tenants.
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full mx-auto mt-auto">
                <div className="flex items-center bg-green-100 rounded-lg p-4 gap-4 mb-8">
                  <span className="bg-teal-500 text-white rounded-md py-2 px-3 text-xs font-medium flex gap-1 items-center">
                    <Lightbulb size={15} /> Tip
                  </span>
                  <span className="text-gray-700 text-sm">
                    On an average it takes less than 2 minutes to list the
                    property
                  </span>
                </div>
                <button
                  className="text-center w-full bg-red-500 hover:bg-red-600 text-white lg:py-4 py-3 rounded-lg font-medium transition duration-200"
                  onClick={() => setShowGetStarted(false)}
                >
                  Get Started
                </button>
              </div>
            </section>
          )}

          {!showGetStarted && (
            <section className="w-full my-0 min-h-[calc(100vh-55px)] flex-col container py-4 px-6 mx-auto flex justify-between gap-16 md:hidden">
              {showListingOptions && (
                <div className="flex flex-col gap-8 h-full">
                  <h1 className="text-2xl">
                    Select How You Want to List Your Property
                  </h1>
                  <legend className="sr-only">Listing Options</legend>
                  <div className="flex flex-col gap-2">
                    <ListingOption
                      id="option-diy"
                      icon={<CreateNewListing />}
                      iconColor="blue"
                      title="Create a New Listing"
                      description="Do it yourself in 5 easy steps"
                      className="py-4"
                      isSelected={listingType === PropertyListingType.DIY}
                      onChange={() =>
                        dispatch(setListingType(PropertyListingType.DIY))
                      }
                    />

                    <ListingOption
                      id="option-call"
                      icon={<CallWithCaptain />}
                      iconColor="green"
                      title="Get on a Call with an Captain"
                      description="Let us do it for you over a quick phone call"
                      className="py-4"
                      isSelected={listingType === PropertyListingType.CALL}
                      onChange={() =>
                        dispatch(setListingType(PropertyListingType.CALL))
                      }
                    />
                  </div>

                  <button
                    type="button"
                    className="w-full bg-red-500 hover:bg-red-600 text-white lg:py-4 py-3 rounded-lg lg:mt-4 font-medium transition duration-200 mt-auto"
                    onClick={handleListingTypeClick}
                  >
                    {listingType === PropertyListingType.CALL
                      ? "Get a call back!"
                      : "Start Posting Your Free Listing"}
                  </button>
                </div>
              )}
              {showPropertyTypeOptions && (
                <div className="flex flex-col gap-8 h-full">
                  <h1 className="text-2xl">Tell us about your property</h1>
                  <div className="grid grid-cols-3 max-md:grid-cols-1 lg:gap-4 gap-4 lg:mb-8 mb-4">
                    {propertyTypes.map((option) => (
                      <PropertyTypeOption
                        key={option.id}
                        id={option.id}
                        label={option.label}
                        icon={option.icon}
                        className="px-4 items-center"
                        isSelected={propertyType === option.type}
                        iconClassName={`${
                          propertyType === option.type
                            ? "opacity-100"
                            : "opacity-50"
                        } transition-opacity duration-200`}
                        onChange={() => dispatch(setPropertyType(option.type))}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <button
                      type="button"
                      className="text-center w-full border border-gray-300 text-gray-700 hover:bg-gray-50 lg:py-4 py-3 rounded-lg font-medium transition duration-200"
                      onClick={() => dispatch(setShowPropertyType(false))}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      className="text-center w-full bg-red-500 hover:bg-red-600 text-white lg:py-4 py-3 rounded-lg font-medium transition duration-200"
                      onClick={handlePostListingClick}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}

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
              <div className="flex w-3/5 justify-around items-center">
                <div className="max-w-lg lg:w-full my-0 mx-auto flex flex-col gap-8">
                  {!token && (
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
                  )}
                  {showListingOptions && (
                    <div className="flex flex-col">
                      <h1 className="lg:text-2xl text-xl lg:mb-8 mb-4">
                        Select How You Want to List Your Property
                      </h1>
                      <legend className="sr-only">Listing Options</legend>
                      <ListingOption
                        id="option-diy"
                        icon={<CreateNewListing />}
                        iconColor="blue"
                        title="Create a New Listing"
                        description="Do it yourself in 5 easy steps"
                        isSelected={listingType === PropertyListingType.DIY}
                        onChange={() =>
                          dispatch(setListingType(PropertyListingType.DIY))
                        }
                      />

                      <ListingOption
                        id="option-call"
                        icon={<CallWithCaptain />}
                        iconColor="green"
                        title="Get on a Call with an Captain"
                        description="Let us do it for you over a quick phone call"
                        isSelected={listingType === PropertyListingType.CALL}
                        onChange={() =>
                          dispatch(setListingType(PropertyListingType.CALL))
                        }
                      />

                      <button
                        type="button"
                        className="w-full bg-red-500 hover:bg-red-600 text-white lg:py-4 py-3 rounded-lg lg:mt-4 mt-2 font-medium transition duration-200"
                        onClick={handleListingTypeClick}
                      >
                        Get Started
                      </button>
                    </div>
                  )}
                  {showPropertyTypeOptions && (
                    <div className="flex flex-col">
                      <h1 className="lg:text-2xl text-xl lg:mb-8 mb-4">
                        Tell us about your property
                      </h1>
                      <div className="grid grid-cols-3 max-md:grid-cols-1 lg:gap-4 gap-2 lg:mb-8 mb-4">
                        {propertyTypes.map((option) => (
                          <PropertyTypeOption
                            key={option.id}
                            id={option.id}
                            label={option.label}
                            icon={option.icon}
                            isSelected={propertyType === option.type}
                            iconClassName={`${
                              propertyType === option.type
                                ? "opacity-100"
                                : "opacity-50"
                            } transition-opacity duration-200`}
                            onChange={() =>
                              dispatch(setPropertyType(option.type))
                            }
                          />
                        ))}
                      </div>
                      <button
                        type="button"
                        className="text-center w-full bg-red-500 hover:bg-red-600 text-white lg:py-4 py-3 rounded-lg font-medium transition duration-200"
                        onClick={handlePostListingClick}
                      >
                        Start Posting Your Free Listing
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

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
                  <Carousel2D slideWidth={400} gap={24} showDots={true}>
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
              onClose={() => closeDialog("call-with-captain-dialog")}
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
                          onClick={() =>
                            closeDialog("call-with-captain-dialog")
                          }
                          size={25}
                        />
                      </button>
                    </>
                  )}
                </div>
              </DialogHeader>
              <DialogContent>
                <div className="flex flex-col items-center justify-center text-center p-8">
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
