"use client";

import "react-international-phone/style.css";

import { ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import BuyersConnectionsSvg from "public/icons/buyers-connections.svg";
import CallWithCaptainSvg from "public/icons/call-with-captain.svg";
import CreateNewListingSvg from "public/icons/create-new-listing.svg";
import CustomerSupportSvg from "public/icons/customer-support.svg";
import FasterDealClosuresSvg from "public/icons/faster-deal-closures.svg";
import FlatmatesSvg from "public/icons/flatmates.svg";
import HassleFreeListingsSvg from "public/icons/hassle-free-listings.svg";
import HouseClayCaptainSvg from "public/icons/houseclay-captain.svg";
import RentSvg from "public/icons/rent.svg";
import ResaleSvg from "public/icons/resale.svg";
import React, { useEffect, useState } from "react";
import { PhoneInput } from "react-international-phone";
import { useDispatch, useSelector } from "react-redux";

import { AuthStep, PropertyListingType, PropertyType } from "@/common/utils";
import Carousel2D from "@/components/Carousel2D";
import { Dialog, DialogContent } from "@/components/Dialog";
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

import dummyData from "../../data/dummyData.json";

interface ListingOptionProps {
  id: string;
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  description: string;
  isSelected: boolean;
  onChange: () => void;
}

const ListingOption: React.FC<ListingOptionProps> = ({
  id,
  icon,
  iconColor,
  title,
  description,
  isSelected,
  onChange,
}) => {
  return (
    <div
      className={`lg:mb-4 mb-2 focus-within:ring-1 focus-within:rounded-lg focus-within:ring-red-500`}
    >
      <label
        htmlFor={id}
        className={`flex items-center justify-between lg:p-4 p-2 rounded-lg border cursor-pointer lg:gap-12 gap-6 ${
          isSelected ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
        }`}
      >
        <div className="flex flex-1 items-center gap-4">
          <div
            className={`flex items-center p-1 bg-${iconColor}-50 rounded-full`}
          >
            <div
              className={`flex w-12 h-12  items-center justify-center   rounded-full  bg-${iconColor}-100`}
            >
              {icon}
            </div>
          </div>
          <div>
            <h2 className="lg:text-xl text-sm font-medium">{title}</h2>
            <p className="lg:text-base text-xs text-gray-500">{description}</p>
          </div>
        </div>
        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            isSelected ? "border-red-500 bg-white" : "border-gray-300"
          }`}
        >
          {isSelected && (
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
          )}
        </div>
      </label>
      <input
        type="radio"
        id={id}
        name="listingOption"
        checked={isSelected}
        onChange={onChange}
        className="sr-only" // Visually hidden but accessible
      />
    </div>
  );
};

interface PropertyTypeOptionProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onChange: () => void;
}

const PropertyTypeOption: React.FC<PropertyTypeOptionProps> = ({
  id,
  label,
  icon,
  isSelected,
  onChange,
}) => {
  return (
    <div className="flex flex-1 focus-within:ring-1 focus-within:rounded-lg focus-within:ring-red-500">
      <label
        htmlFor={id}
        className={`flex items-start lg:gap-8 gap-4 justify-center lg:p-4 p-2 rounded-lg border cursor-pointer text-center ${
          isSelected ? "border-red-500 bg-red-50" : ""
        }`}
      >
        <div className="flex flex-col items-start justify-center">
          {icon}
          <span>{label}</span>
        </div>
        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            isSelected ? "border-red-500 bg-white" : "border-gray-300"
          }`}
        >
          {isSelected && (
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
          )}
        </div>
      </label>
      <input
        type="radio"
        id={id}
        name="propertyType"
        className="sr-only"
        checked={isSelected}
        onChange={onChange}
      />
    </div>
  );
};

export default function ListProperty() {
  const { isDialogOpen, openDialog, closeDialog } = useDialog();
  const listingType = useSelector(
    (state: RootState) => state.listProperty.listingType,
  );
  const showPropertyType = useSelector(
    (state: RootState) => state.listProperty.showPropertyType,
  );
  const propertyType = useSelector(
    (state: RootState) => state.listProperty.propertyType,
  );
  const phoneNo = useSelector((state: RootState) => state.auth.phoneNo);
  const token = useSelector((state: RootState) => state.auth.token);
  const handlePhoneChange = (data: string) => {
    // Remove '+' sign and update the phone number
    const sanitizedPhone = data.replace(/^\+/, "");
    dispatch(setPhoneNo(sanitizedPhone));
  };
  const dispatch = useDispatch();
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [triggerCheckUser] = useLazyCheckUserQuery();
  const [generateOtp] = useGenerateOtpMutation();

  const BuyersConnections = BuyersConnectionsSvg as React.FC<
    React.SVGProps<SVGSVGElement>
  >;
  const FasterDealClosures = FasterDealClosuresSvg as React.FC<
    React.SVGProps<SVGSVGElement>
  >;
  const HassleFreeListings = HassleFreeListingsSvg as React.FC<
    React.SVGProps<SVGSVGElement>
  >;
  const CustomerSupport = CustomerSupportSvg as React.FC<
    React.SVGProps<SVGSVGElement>
  >;

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

  const testimonials = dummyData.testimonials;

  useEffect(() => {
    dispatch(setAuthStep(AuthStep.PHONE));
  }, []);

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
    // Assuming you have a router instance from Next.js
    // Uncomment the following line if using Next.js router
    // router.push(url);

    console.log(`Navigating to: ${url}`);
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
            {token ? (
              showPropertyType ? (
                <div className="flex flex-col items-center">
                  <h1 className="lg:text-2xl text-xl lg:mb-8 mb-4">
                    Tell us about your property
                  </h1>
                  <div className="flex justify-between lg:gap-8 gap-4 lg:mb-8 mb-4">
                    <PropertyTypeOption
                      id="rent"
                      label="Rent"
                      icon={<Rent />}
                      isSelected={propertyType === PropertyType.RENT}
                      onChange={() =>
                        dispatch(setPropertyType(PropertyType.RENT))
                      }
                    />
                    <PropertyTypeOption
                      id="resale"
                      label="Resale"
                      icon={<Resale />}
                      isSelected={propertyType === PropertyType.RESALE}
                      onChange={() =>
                        dispatch(setPropertyType(PropertyType.RESALE))
                      }
                    />
                    <PropertyTypeOption
                      id="flatmates"
                      label="Flatmates"
                      icon={<Flatmates />}
                      isSelected={propertyType === PropertyType.FLATMATES}
                      onChange={() =>
                        dispatch(setPropertyType(PropertyType.FLATMATES))
                      }
                    />
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
              ) : (
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
              )
            ) : (
              <div className="w-full max-w-md my-0 mx-auto flex flex-col gap-8">
                <div className="flex flex-col">
                  <label className="block mb-2 text-base font-medium text-gray-700">
                    Phone Number
                  </label>
                  <PhoneInput
                    defaultCountry="in"
                    value={phoneNo}
                    placeholder="Enter phone number"
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
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
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
                    onClick={async () => {
                      if (acceptTerms && phoneNo.substring(2)) {
                        try {
                          const checkUserResponse = await triggerCheckUser({
                            phoneNo,
                          }).unwrap();
                          console.log(
                            "Check User Response:",
                            checkUserResponse,
                          );
                          // setUserExists(checkUserResponse.exists);
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
                    }}
                  >
                    Post Your Property – It&apos;s free
                  </button>

                  <p className="mt-2 text-base text-center text-gray-500">
                    Don&apos;t worry we won&apos;t spam you.
                  </p>
                </div>

                <div className="flex flex-col items-center">
                  <ShieldCheck className="text-white fill-gray-600" size={32} />
                  <p className="mt-2 text-sm text-center text-gray-400">
                    More than 800+ owners have listed their properties on
                    HouseClay and closed their deal.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      <section className="w-full overflow-hidden">
        <div className="container py-8 mx-auto xl:px-28 lg:px-14 md:px-8 px-8">
          <div className="flex justify-around items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center p-1 bg-green-50 rounded-full">
                <div className="flex  w-12 h-12 items-center justify-center bg-green-100 rounded-full">
                  <HassleFreeListings
                    height={32}
                    width={32}
                    className=" bg-green-100 rounded-full"
                  />
                </div>
              </div>
              <div className="text-lg font-medium text-gray-800">
                Hassle-Free Listings
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center p-1 bg-blue-50 rounded-full">
                <div className="flex  w-12 h-12 items-center justify-center bg-blue-100 rounded-full">
                  <FasterDealClosures
                    height={32}
                    width={32}
                    className="bg-blue-100 rounded-full"
                  />
                </div>
              </div>
              <div className="text-lg font-medium text-gray-800">
                Faster Deal Closures
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center p-1 bg-amber-50 rounded-full">
                <div className="flex w-12 h-12 items-center justify-center  bg-amber-100 rounded-full">
                  <BuyersConnections
                    height={32}
                    width={32}
                    className="bg-amber-100 rounded-full"
                  />
                </div>
              </div>
              <div className="text-lg font-medium text-gray-800">
                1 lac+ tenants/buyers connections
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full overflow-hidden">
        <div className="container py-12 mx-auto xl:px-28 lg:px-14 md:px-8 px-8">
          <div className="p-8 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm flex items-center w-full justify-between gap-16">
            <div className="relative overflow-hidden rounded-lg">
              <div className="absolute inset-0 shadow-[inset_0_0_80px_40px_rgba(255,255,255,0.8)] z-20"></div>
              <CustomerSupport />
            </div>

            <div className="flex flex-col justify-between w-1/2">
              <h2 className="text-2xl font-bold text-gray-800">
                Need Help Listing Your Property?{" "}
                <span className="text-red-500">Let&apos;s Talk!</span>
              </h2>
              <p className="mt-3 text-gray-600">
                Need fast results and hassle-free listing? Book a call with our
                experts to get your property listed quickly and easily!
              </p>
              <div className="mt-6">
                <button className="px-6 py-3 border border-red-500 rounded-xl hover:bg-red-50 ">
                  Book a Free Call Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full overflow-hidden">
        <div className="container py-12 mx-auto xl:px-28 lg:px-14 md:px-8 px-8">
          <div className="flex justify-around items-center gap-16">
            <div className="flex flex-col w-1/2">
              <h2 className="text-3xl font-bold text-gray-800">
                Trusted by Landlords Across Top Cities
              </h2>
              <p className="mt-4 text-base text-gray-600">
                Trusted by landlords in top cities to deliver fast, reliable,
                and hassle-free property listing solutions!
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
        <div className="container mx-auto flex flex-col items-center justify-between gap-10 xl:px-28 lg:px-14 md:px-8 px-8 py-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-4xl font-bold text-center">
              Why List Your Property With Us?
            </h1>
            <div className="text-center text-gray-600">
              Listing your property has never been easier or more effective.
              Here&apos;s why thousands of property owners trust us:
            </div>
          </div>
          <div className="flex flex-wrap xl:gap-12 lg:gap-6 gap-6 justify-between">
            <div className="flex flex-1 flex-col bg-white rounded-3xl  border border-gray-200 shadow-lg xl:px-12 lg:px-6 px-3 py-6 justify-between items-center gap-4">
              <Image
                src="/icons/fast-results.svg"
                alt="Fast Results"
                width={150}
                height={150}
              />
              <h1 className="font-bold text-center">Fast Results</h1>
              <p className="text-center">
                Find tenants or buyers in under 3 days.
              </p>
            </div>
            <div className="flex flex-1 flex-col bg-white rounded-3xl border border-gray-200 shadow-lg xl:px-12 lg:px-6 px-3  py-6 justify-between items-center gap-4">
              <Image
                src="/icons/affordable-upgrades.svg"
                alt="Affordable Upgrades"
                width={150}
                height={150}
              />
              <h1 className="font-bold text-center">Affordable Upgrades</h1>
              <p className="text-center">
                Access premium listing tag options to enhance visibility.
              </p>
            </div>
            <div className="flex flex-1 flex-col bg-white rounded-3xl border border-gray-200 shadow-lg xl:px-12 lg:px-6 px-3  py-6 justify-between items-center gap-4">
              <Image
                src="/icons/wide-reach.svg"
                alt="Wide Reach"
                width={150}
                height={150}
              />
              <h1 className="font-bold text-center">Wide Reach</h1>
              <p className="text-center">
                Showcase your property to thousands across top cities.
              </p>
            </div>
          </div>
        </div>
      </section>
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
}
