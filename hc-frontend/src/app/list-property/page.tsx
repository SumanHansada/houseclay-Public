"use client";

import "react-international-phone/style.css";

import { ShieldCheck } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import CallWithCaptainSvg from "public/icons/call-with-captain.svg";
import CreateNewListingSvg from "public/icons/create-new-listing.svg";
import FlatmatesSvg from "public/icons/flatmates.svg";
import HouseClayCaptainSvg from "public/icons/houseclay-captain.svg";
import RentSvg from "public/icons/rent.svg";
import ResaleSvg from "public/icons/resale.svg";
import React, { useEffect, useState } from "react";
import { PhoneInput } from "react-international-phone";
import { useDispatch, useSelector } from "react-redux";

import { AuthStep, PropertyListingType, PropertyType } from "@/common/utils";
import Carousel2D from "@/components/Carousel2D";
import CustomerSupportBanner from "@/components/CustomerSupportBanner";
import { Dialog, DialogContent } from "@/components/Dialog";
import Footer from "@/components/Footer";
import ListingOption from "@/components/ListingOption";
import ListPropertyAdvantages from "@/components/ListPropertyAdvantages";
import ListWithUs from "@/components/ListWithUs";
import PropertyTypeOption from "@/components/PropertyTypeOption";
import { TestimonialCard } from "@/components/Testimonials";
import { useDialog } from "@/providers/DialogContextProvider";
import {
  useGenerateOtpMutation,
  useLazyCheckUserQuery,
} from "@/store/apiSlice";
import { setAuthStep, setPhoneNo } from "@/store/authSlice";
import {
  setListingType,
  setPropertyType,
  setShowPropertyType,
} from "@/store/listPropertySlice";
import { RootState } from "@/store/store";
import { setCheckUser } from "@/store/userSlice";

import dummyData from "../../data/dummyData.json";
import ListPropertySkeleton from "./ListPropertySkeleton";

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
      const [triggerCheckUser] = useLazyCheckUserQuery();
      const [generateOtp] = useGenerateOtpMutation();

      const testimonials = dummyData.testimonials;
      const showListingOptions = token && !showPropertyType;
      const showPropertyTypeOptions = token && showPropertyType;

      useEffect(() => {
        dispatch(setAuthStep(AuthStep.PHONE));
      }, [dispatch]);

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
        console.log(`Navigating to: ${url}`);
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
          <section className="xl:min-h-[500px] min-h-[400px] w-full overflow-hidden">
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
                <div className="max-w-lg my-0 mx-auto flex flex-col gap-8">
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
                      <div className="flex justify-between lg:gap-8 gap-4 lg:mb-8 mb-4">
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
                      <Link
                        href={`/list-property/${propertyType.toLowerCase()}`}
                        type="button"
                        className="text-center w-full bg-red-500 hover:bg-red-600 text-white lg:py-4 py-3 rounded-lg font-medium transition duration-200"
                        onClick={handlePostListingClick}
                      >
                        Start Posting Your Free Listing
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="w-full overflow-hidden">
            <ListWithUs />
          </section>

          <section className="w-full overflow-hidden">
            <CustomerSupportBanner />
          </section>

          <section className="w-full overflow-hidden">
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

          <section className="w-full overflow-hidden">
            <ListPropertyAdvantages />
          </section>

          <Footer />
          {isDialogOpen("call-with-captain-dialog") && (
            <Dialog
              id="call-with-captain-dialog"
              type="card"
              onClose={() => closeDialog("call-with-captain-dialog")}
              width={40}
            >
              <DialogContent>
                <div className="flex flex-col items-center justify-center text-center p-8">
                  <div className="relative overflow-hidden rounded-lg">
                    <div className="absolute inset-0 shadow-[inset_0_0_25px_25px_rgba(255,255,255,0.8)] z-20"></div>
                    <HouseClayCaptain />
                  </div>
                  <h2 className="text-2xl font-medium">Awesome!</h2>
                  <h2 className="text-2xl font-medium">
                    We&apos;re Getting Started
                  </h2>
                  <p className="text-base text-gray-500 my-4">
                    One of our team members will call you shortly to guide you
                    through the property listing process.
                  </p>
                  <button
                    className="px-24 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition duration-200"
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
  { ssr: false, loading: () => <ListPropertySkeleton /> },
);

export default ListPropertyPage;
