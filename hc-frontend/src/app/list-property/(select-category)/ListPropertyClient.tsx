"use client";

import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ShieldCheck, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/base-components";
import { CDN_BASE_URL } from "@/common/constants";
import { validPhoneNoLength } from "@/common/constants";
import {
  AuthStep,
  ErrorStatus,
  LeadCategory,
  ListPropertyDesktopStep,
  ListPropertyMobileStep,
  PropertyListingType,
} from "@/common/enums";
import { generateUUID } from "@/common/utils";
import GetStarted from "@/components/GetStarted";
import LazyPhoneInput from "@/components/LazyPhoneInput";
import ListingOptions from "@/components/ListingOptions";
import PropertyTypeOptions from "@/components/PropertyTypeOptions";
import { MobileFooter, MobileHeader } from "@/layout-components";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";
import {
  useGenerateLeadMutation,
  useGenerateOtpMutation,
  useLazyCheckUserQuery,
} from "@/store/apiSlice";
import { setAuthStep, setLoginFromAddProperty } from "@/store/authSlice";
import { clearFormData, setPropertyID } from "@/store/listPropertySlice";
import { RootState } from "@/store/store";
import { setCheckUser, setPhoneNo } from "@/store/userSlice";
import { ImageWithLoader } from "@/utility-components";

const listPropertyImgUrl =
  CDN_BASE_URL + "/public/images/list-your-property.webp";

const ListPropertyClient = () => {
  const { openDialog } = useDialog();
  const { isMobile } = useDeviceContext();
  const router = useRouter();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const listingType = useSelector(
    (state: RootState) => state.listProperty.listingType,
  );
  const propertyCategory = useSelector(
    (state: RootState) => state.listProperty.propertyCategory,
  );

  const dispatch = useDispatch();
  const { phoneNo } = useSelector((state: RootState) => state.user.userDetail);
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

  useEffect(() => {
    dispatch(setAuthStep(AuthStep.PHONE));
    dispatch(clearFormData());
  }, [dispatch]);

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
    const uuid = generateUUID();
    dispatch(setPropertyID(uuid));
    const url = `/list-property/${propertyCategory.toLowerCase()}/property-details`;
    router.push(url);
  };

  const handleGetStarted = () => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
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
    if (acceptTerms && phoneNo.substring(validPhoneNoLength)) {
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
      dispatch(setLoginFromAddProperty(true));
      openDialog("login-dialog");
    }
  };

  return (
    <>
      {/* Mobile Section */}
      <MobileHeader>
        <MobileHeader.Title>{GetMobileHeader()}</MobileHeader.Title>
        <MobileHeader.RightAction>
          <Button
            variant="secondary"
            size="custom"
            className="rounded-full p-1"
            onClick={goToHomePage}
          >
            <X size={24} />
          </Button>
        </MobileHeader.RightAction>
      </MobileHeader>
      {/* Mobile Content */}

      <section className="w-full my-0 flex-col container pt-4 pb-2 px-6 mx-auto flex justify-between gap-16 md:hidden">
        {mobileStep === ListPropertyMobileStep.GET_STARTED && <GetStarted />}
        {mobileStep === ListPropertyMobileStep.LISTING_OPTIONS && (
          <ListingOptions onNext={handleListingTypeClick} />
        )}
        {mobileStep === ListPropertyMobileStep.PROPERTY_TYPE && (
          <PropertyTypeOptions
            onNext={handlePostListingClick}
            onBack={handleBack}
          />
        )}
      </section>
      <MobileFooter>
        {mobileStep === ListPropertyMobileStep.GET_STARTED && (
          <button
            className="text-center w-full border border-red-500 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl transition duration-200"
            onClick={handleGetStarted}
          >
            Get Started
          </button>
        )}
        {mobileStep === ListPropertyMobileStep.LISTING_OPTIONS && (
          <div className="flex mt-auto w-full md:hidden">
            <button
              type="button"
              className={`text-center w-full border border-red-500 bg-red-500 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:border-gray-300 hover:bg-red-600 text-white py-3 rounded-xl transition duration-200`}
              onClick={handleListingTypeClick}
              disabled={!listingType}
            >
              {listingType === PropertyListingType.CALL
                ? "Get a call back!"
                : "Start Posting Your Free Listing"}
            </button>
          </div>
        )}
        {mobileStep === ListPropertyMobileStep.PROPERTY_TYPE && (
          <div className={`flex gap-2 mt-auto w-full md:hidden`}>
            <button
              type="button"
              className={`text-center w-full border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-xl transition duration-200`}
              onClick={handleBack}
            >
              Back
            </button>
            <button
              type="button"
              className={`text-center w-full border border-red-500  bg-red-500 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:border-gray-300 hover:bg-red-600 text-white px-6 py-3 rounded-xl transition duration-200`}
              onClick={handlePostListingClick}
              disabled={!propertyCategory}
            >
              Next
            </button>
          </div>
        )}
      </MobileFooter>
      {/* Desktop Section */}
      <section className="xl:max-h-[500px] max-h-[450px] max-md:max-h-[fit-content] w-full overflow-hidden max-md:hidden">
        <div className="container pt-12 mx-auto xl:px-28 lg:px-14 md:px-8 px-8 flex justify-between gap-16">
          <div className="flex w-2/5 justify-around items-start">
            <ImageWithLoader
              src={listPropertyImgUrl}
              alt="List Your Property"
              width={550}
              height={475}
              className="my-0"
            />
          </div>
          <div className="flex w-3/5 items-start">
            <div className="w-full xl:max-w-xl my-0 flex flex-col gap-8">
              {!isAuthenticated ? (
                <>
                  <div className="flex flex-col">
                    <label className="block mb-2 text-base font-medium text-gray-700">
                      Phone Number
                    </label>
                    <LazyPhoneInput
                      defaultCountry="in"
                      value={phoneNo}
                      forceDialCode={true}
                      disableFormatting={true}
                      placeholder={"Enter phone number"}
                      onChange={(value) => dispatch(setPhoneNo(value))}
                      className="custom-phone-input w-full border border-gray-300 rounded-lg px-2 py-0.5 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      id="terms"
                      type="checkbox"
                      className="w-5 h-5 text-red-500 border-gray-300 rounded focus:ring-red-500 accent-red-500 hover:cursor-pointer"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                    />
                    <label
                      htmlFor="terms"
                      className="ml-2 text-sm text-gray-700"
                    >
                      I agree to{" "}
                      <Link
                        href="/terms-and-conditions"
                        className="text-gray-700 hover:underline"
                      >
                        Terms & Conditions
                      </Link>{" "}
                      &{" "}
                      <Link
                        href="/privacy-policy"
                        className="text-gray-700 hover:underline"
                      >
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  <div className="flex flex-col items-center">
                    <button
                      className={`w-full px-6 py-3 text-base text-white rounded-md  ${!acceptTerms || !phoneNo.substring(validPhoneNoLength) ? "bg-red-300" : "bg-red-500 hover:bg-red-600"}`}
                      disabled={
                        !acceptTerms || !phoneNo.substring(validPhoneNoLength)
                      }
                      onClick={handlePostYourPropertyClick}
                    >
                      Post Your Property - It&apos;s free
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
                  {desktopStep === ListPropertyDesktopStep.LISTING_OPTIONS && (
                    <ListingOptions onNext={handleListingTypeClick} />
                  )}

                  {desktopStep === ListPropertyDesktopStep.PROPERTY_TYPE && (
                    <PropertyTypeOptions
                      onNext={handlePostListingClick}
                      onBack={handleBack}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ListPropertyClient;
