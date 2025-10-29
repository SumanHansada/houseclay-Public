"use client";

import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AuthStep, ErrorStatus } from "@/common/enums";
import LazyPhoneInput from "@/components/LazyPhoneInput";
import { useDialog } from "@/providers/DialogContextProvider";
import {
  useGenerateOtpMutation,
  useLazyCheckUserQuery,
} from "@/store/apiSlice";
import { setAuthStep } from "@/store/authSlice";
import { RootState } from "@/store/store";
import { setCheckUser, setPhoneNo } from "@/store/userSlice";
import { ImageWithLoader } from "@/utility-components";

export default function LoginPage() {
  const { phoneNo } = useSelector((state: RootState) => state.user.userDetail);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const dispatch = useDispatch();
  const [triggerCheckUser] = useLazyCheckUserQuery();
  const [generateOtp] = useGenerateOtpMutation();
  const { openDialog } = useDialog();

  useEffect(() => {
    dispatch(setAuthStep(AuthStep.PHONE));
  }, [dispatch]);

  const handleLoginClick = async () => {
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
      <div className="flex w-full h-full pt-14">
        <div className="left-0 top-14 bottom-0 w-[33.33%] fixed  bg-gray-50 max-md:hidden">
          <ImageWithLoader
            src="/images/property-add-graphic.svg"
            alt="Property Graphic"
            fill
            className="object-cover max-xl:hidden"
            priority
          />
        </div>
        <div className="container right-0 ml-[33.33%] max-md:ml-auto top-14 py-20 mx-auto relative xl:px-28 lg:px-14 md:px-8 px-6 h-full flex justify-center">
          <>
            <div className="flex flex-col h-full justify-center gap-8">
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
                  onClick={handleLoginClick}
                >
                  Login
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
          </>
        </div>
      </div>
    </>
  );
}
