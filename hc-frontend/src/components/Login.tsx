"use client";

import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import { loginAction, registerAction } from "@/actions/authActions";
import { Button } from "@/base-components";
import { loginImageURL } from "@/common/cdnURLs";
import { validPhoneNoLength } from "@/common/constants";
import { AuthStep } from "@/common/enums";
import { AuthUserDetail } from "@/interfaces/User";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";
import {
  useGenerateOtpMutation,
  useLazyCheckUserQuery,
} from "@/store/apiSlice";
import {
  setAuthStep,
  setIsAuthenticated,
  setLoginFromAddProperty,
  setLoginFromLoginPage,
} from "@/store/authSlice";
import { RootState } from "@/store/store";
import {
  clearCheckUser,
  setCheckUser,
  setEmailID,
  setName,
  setPhoneNo,
  setUserDetail,
} from "@/store/userSlice";
import { ImageWithLoader, SvgIcon } from "@/utility-components";
import { getErrorMessage } from "@/utils/rtkQueryHelpers";

import LazyPhoneInput from "./LazyPhoneInput";
import Spinner from "./Spinner";

const emailIDRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const Login = ({ onClose }: { onClose: () => void }) => {
  const { authStep, loginFromAddProperty, loginFromLoginPage } = useSelector(
    (state: RootState) => state.auth,
  );
  const { name, emailID, phoneNo } = useSelector(
    (state: RootState) => state.user.userDetail,
  );
  const checkUser = useSelector((state: RootState) => state.user.checkUser);
  const [triggerCheckUser] = useLazyCheckUserQuery();
  const [generateOtp] = useGenerateOtpMutation();
  const dispatch = useDispatch();
  const { isMobile } = useDeviceContext();
  const router = useRouter();
  const { closeAllDialogs } = useDialog();

  const [otpCode, setOtpCode] = useState<string[]>(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const ref1 = useRef<HTMLInputElement>(null);
  const ref2 = useRef<HTMLInputElement>(null);
  const ref3 = useRef<HTMLInputElement>(null);
  const ref4 = useRef<HTMLInputElement>(null);

  const inputRefs = useMemo(() => [ref1, ref2, ref3, ref4], []);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTimeLeft(30);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimeLeft(0);
  };

  const handleCheckUser = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const checkUserResponse = await triggerCheckUser({ phoneNo }).unwrap();
      console.log("Check User Response:", checkUserResponse);
      dispatch(setCheckUser(checkUserResponse));
      const otpResponse = await generateOtp({ phoneNo }).unwrap();
      console.log("OTP Response:", otpResponse);
      dispatch(setAuthStep(AuthStep.OTP));
    } catch (err: unknown) {
      console.error("Check User Error:", err);
      dispatch(clearCheckUser());
      if (
        err &&
        typeof err === "object" &&
        "status" in err &&
        typeof (err as FetchBaseQueryError).status === "number"
      ) {
        const status = (err as FetchBaseQueryError).status;
        const data = (err as FetchBaseQueryError).data;

        let errorMessage = "Unknown error";
        if (data && typeof data === "object") {
          const typedData = data as { error?: string; message?: string };
          errorMessage = typedData.error || typedData.message || errorMessage;
        }
        console.error(`HTTP ${status}: ${errorMessage}`);
        // Handle Blacklisted(403) or other specific status codes
        if (status === 403) {
          toast.error("Something went wrong!\n Please try again later.");
          closeAllDialogs();
          router.replace("/");
        }
        dispatch(setAuthStep(AuthStep.CREATE_USER));
      } else {
        // Non-HTTP error (e.g., network failure)
        dispatch(setAuthStep(AuthStep.CREATE_USER));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (isLoading) return;
    if (
      !phoneNo ||
      !phoneNo.substring(validPhoneNoLength) ||
      !emailIDRegex.test(emailID) ||
      !name
    )
      return;
    setIsLoading(true);
    try {
      const otpResponse = await generateOtp({ phoneNo }).unwrap();
      console.log("OTP Response:", otpResponse);
      dispatch(setAuthStep(AuthStep.OTP));
    } catch (err: unknown) {
      console.error("Create User Error:", err);
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndContinue = async () => {
    if (isLoading || !isVerifyEnabled) return;
    setIsLoading(true);
    try {
      let result: { success: boolean; data?: AuthUserDetail; error?: string };

      if (!checkUser) {
        // Register new user
        result = await registerAction({
          phoneNo,
          name,
          emailID,
          otpCode: otpCode.join(""),
        });
      } else {
        // Login existing user
        result = await loginAction({
          phoneNo,
          otpCode: otpCode.join(""),
        });
      }

      if (!result.success || !result.data) {
        throw new Error(result.error || "Authentication failed");
      }

      const userData = result.data;
      console.warn("Auth Response:", userData);

      // Update Redux state
      dispatch(setIsAuthenticated(true));
      dispatch(setUserDetail(userData));
      dispatch(setAuthStep(AuthStep.LOGGED_IN));
      onClose();

      // Navigate based on context
      if (loginFromLoginPage) {
        router.replace("/");
        dispatch(setLoginFromLoginPage(false));
      } else if (loginFromAddProperty) {
        router.push("/list-property");
        dispatch(setLoginFromAddProperty(false));
      }
    } catch (err: unknown) {
      console.error("Verify Error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      toast.error(errorMessage);
      setOtpCode(["", "", "", ""]);
      if (inputRefs[0].current) {
        inputRefs[0].current.focus();
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authStep === AuthStep.NONE) {
      dispatch(setAuthStep(AuthStep.PHONE));
    }
    // Focus the first input when component mounts
    if (authStep === AuthStep.OTP && inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
    if (authStep === AuthStep.OTP) {
      startTimer();
    } else {
      clearTimer();
    }
    return () => {
      clearTimer();
    };
  }, [inputRefs, authStep, dispatch]);

  useEffect(() => {
    return () => {
      if (!loginFromAddProperty && !loginFromLoginPage) {
        dispatch(setAuthStep(AuthStep.NONE));
      }
      clearTimer();
    };
  }, [dispatch, loginFromAddProperty, loginFromLoginPage]);

  const handleResendOtp = async () => {
    if (timeLeft > 0 || !phoneNo || isLoading) return;
    try {
      const otpResponse = await generateOtp({ phoneNo }).unwrap();
      console.warn("Resend OTP Response:", otpResponse);
      startTimer();
      toast.success("OTP resent successfully!");
    } catch (err: unknown) {
      console.error("Resend OTP Error:", err);
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (index: number, value: string): void => {
    // Only allow single digit numbers
    if (value && !/^\d*$/.test(value)) return;

    // Update the OTP array
    const newOtp = [...otpCode];
    newOtp[index] = value.slice(0, 1); // Ensure only one character
    setOtpCode(newOtp);

    // Auto-focus next input if value exists
    if (value && index < 3 && inputRefs[index + 1].current) {
      const currentInputRef = inputRefs[index + 1].current;
      currentInputRef?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    // Handle backspace - move to previous input
    if (
      e.key === "Backspace" &&
      !otpCode[index] &&
      index > 0 &&
      inputRefs[index - 1].current
    ) {
      const currentInputRef = inputRefs[index - 1].current;
      currentInputRef?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault();

    // Get pasted data
    const pastedData = e.clipboardData.getData("text/plain").trim();

    // Only proceed if it looks like a 4-digit number
    if (/^\d{4}$/.test(pastedData)) {
      const digits = pastedData.split("");
      const newOtp = [...otpCode];

      // Fill the inputs with pasted digits
      digits.forEach((digit, index) => {
        if (index < 4) {
          newOtp[index] = digit;
        }
      });

      setOtpCode(newOtp);

      // Focus the last input
      if (inputRefs[3].current) {
        inputRefs[3].current.focus();
      }
    }
  };

  const isVerifyEnabled = otpCode.every((digit) => digit && digit !== "");

  const getButtonContent = (text: string) => (
    <>{isLoading ? <Spinner size="sm" /> : text}</>
  );

  return (
    <>
      {!isMobile && (
        <div className="relative w-full h-0">
          <Button
            variant="secondary"
            size="custom"
            className="absolute top-4 right-4 rounded-full p-1"
            onClick={onClose}
          >
            <X size={24} />
          </Button>
        </div>
      )}
      <div className="flex items-center justify-center h-full bg-white rounded-xl">
        <div className="w-5/12 min-h-[400px] xl:min-h-[500px] 3xl:min-h-[800px] max-md:hidden">
          <ImageWithLoader
            src={loginImageURL}
            alt="Login"
            fill
            className="rounded-l-xl object-cover w-full min-h-[400px] xl:min-h-[500px] 3xl:min-h-[800px]"
            priority
          />
        </div>
        {/* Right pane (form) - takes remaining width */}
        <div className="flex flex-1 h-full px-8 mx-auto relative">
          {authStep === AuthStep.PHONE && (
            <div className="w-full flex flex-col align-center justify-center gap-8">
              {/* Form header */}
              <div className="max-md:hidden">
                <h1 className="text-lg lg:text-xl xl:text-2xl 2xl:text-3xl mb-3 text-black ">
                  Log In to Your Account
                </h1>
                <p className="text-gray-600 text-sm">
                  Enter phone number to log in
                </p>
              </div>

              {/* Form fields */}
              <div className="space-y-2 lg:space-y-2 xl:space-y-3 2xl:space-y-4">
                <div>
                  <div className="md:hidden mb-8">
                    <span className="text-2xl font-bold">No spam, </span>
                    <span className="text-2xl">just updates.</span>
                  </div>
                  <label
                    htmlFor="phone"
                    className="block text-base font-normal text-gray-700 mb-2"
                  >
                    Phone Number
                  </label>
                  <LazyPhoneInput
                    name="phone"
                    defaultCountry="in"
                    selectedCountry="in"
                    value={phoneNo}
                    forceDialCode={true}
                    disableFormatting={true}
                    placeholder={"Enter phone number"}
                    onChange={(value) => dispatch(setPhoneNo(value))}
                    className="custom-phone-input w-full border border-gray-300 rounded-lg px-2 py-0.5 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Info box */}
                <div className="text-gray-400 mb-3 text-sm">
                  We&apos;ll text you to confirm your number.
                </div>

                {/* Continue button */}
                <button
                  type="submit"
                  className={`w-full text-white py-3 px-4 rounded-lg ${!phoneNo.substring(validPhoneNoLength) || isLoading ? "bg-red-300 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"}`}
                  onClick={handleCheckUser}
                  disabled={!phoneNo.substring(validPhoneNoLength) || isLoading}
                >
                  {getButtonContent("Continue")}
                </button>

                {/* Privacy policy */}
                <div className="text-gray-500 text-sm">
                  By continuing to use this service, you agree to our{" "}
                  <Link
                    href="/terms-and-conditions"
                    className="text-gray-700 underline font-bold"
                    onClick={onClose}
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy-policy"
                    className="text-gray-700 underline font-bold"
                    onClick={onClose}
                  >
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </div>
          )}
          {authStep === AuthStep.CREATE_USER && (
            <div className="w-full flex flex-col align-center justify-center gap-2">
              {/* Form header */}
              <div>
                <h1 className="text-2xl mb-1 text-black ">
                  Create New Account
                </h1>
              </div>
              <div className="space-y-2">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-base font-normal text-gray-700"
                  >
                    Phone Number<span className="text-red-600">*</span>
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
                  <label
                    htmlFor="phone"
                    className="block text-base font-normal text-gray-700 mt-2"
                  >
                    Email Address<span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={emailID}
                    onChange={(e) => dispatch(setEmailID(e.target.value))}
                    className="px-2 py-2 w-full border border-gray-300 rounded-lg"
                  />
                  <label
                    htmlFor="phone"
                    className="block text-base font-normal text-gray-700 mt-2"
                  >
                    Name<span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    required
                    value={name}
                    onChange={(e) => dispatch(setName(e.target.value))}
                    className="px-2 py-2 w-full border border-gray-300 rounded-lg mb-2"
                  />
                </div>
                {/* Continue button */}
                <button
                  type="submit"
                  className={`w-full text-white py-3 px-4 rounded-lg ${
                    !phoneNo.substring(validPhoneNoLength) ||
                    !emailIDRegex.test(emailID) ||
                    !name ||
                    isLoading
                      ? "bg-red-300 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                  onClick={handleCreateUser}
                  disabled={
                    !phoneNo.substring(validPhoneNoLength) ||
                    !emailIDRegex.test(emailID) ||
                    !name ||
                    isLoading
                  }
                >
                  {getButtonContent("Continue")}
                </button>
              </div>
            </div>
          )}
          {authStep === AuthStep.OTP && (
            <div className="w-full flex flex-col align-center justify-center gap-6">
              {/* Form header */}
              <div>
                <h1 className="text-2xl mb-1 text-black ">
                  Verify Your Phone Number
                </h1>
                <p className="text-gray-600 text-sm">
                  We&apos;ve sent a 4-digit OTP to your phone number.
                </p>
              </div>

              {/* Form fields */}
              <div className="flex flex-col gap-5">
                {/* Hidden input for Android & iOS OTP autofill */}
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  style={{
                    position: "absolute",
                    left: "-9999px",
                    opacity: 0,
                    pointerEvents: "none",
                  }}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                    if (value.length === 4) {
                      const digits = value.split("");
                      setOtpCode(digits);
                      // Focus the last input
                      if (inputRefs[3].current) {
                        inputRefs[3].current.focus();
                      }
                    }
                  }}
                />
                <div className="flex gap-2">
                  <input
                    id="otp-1"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    ref={inputRefs[0]}
                    value={otpCode[0]}
                    onChange={(e) => handleChange(0, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(0, e)}
                    onPaste={handlePaste}
                    className={`w-12 h-12 text-center text-xl font-medium border-2 ${otpCode[0] ? "bg-white border-red-200" : "bg-gray-100 border-gray-300"}  rounded-md focus:border-red-200 focus:outline-none`}
                    maxLength={1}
                    disabled={isLoading}
                  />
                  <input
                    id="otp-2"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    ref={inputRefs[1]}
                    value={otpCode[1]}
                    onChange={(e) => handleChange(1, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(1, e)}
                    className={`w-12 h-12 text-center text-xl font-medium border-2 ${otpCode[1] ? "bg-white border-red-200" : "bg-gray-100 border-gray-300"}  rounded-md focus:border-red-200 focus:outline-none`}
                    maxLength={1}
                    disabled={isLoading}
                  />
                  <input
                    id="otp-3"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    ref={inputRefs[2]}
                    value={otpCode[2]}
                    onChange={(e) => handleChange(2, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(2, e)}
                    className={`w-12 h-12 text-center text-xl font-medium border-2 ${otpCode[2] ? "bg-white border-red-200" : "bg-gray-100 border-gray-300"}  rounded-md focus:border-red-200 focus:outline-none`}
                    maxLength={1}
                    disabled={isLoading}
                  />
                  <input
                    id="otp-4"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    ref={inputRefs[3]}
                    value={otpCode[3]}
                    onChange={(e) => handleChange(3, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(3, e)}
                    className={`w-12 h-12 text-center text-xl font-medium border-2 ${otpCode[3] ? "bg-white border-red-200" : "bg-gray-100 border-gray-300"}  rounded-md focus:border-red-200 focus:outline-none`}
                    maxLength={1}
                    disabled={isLoading}
                  />
                </div>

                <div className="flex flex-col gap-4">
                  {/* Info box */}
                  {!checkUser ? (
                    <div className="bg-red-50 p-2 rounded-lg flex items-center gap-2">
                      <SvgIcon iconSize="medium" name="coin-egg" size={40} />

                      <div>
                        <p className="text-gray-800 font-normal">
                          Verify your Phone Number and earn
                          <span className="font-bold"> 2 Connects</span>{" "}
                          instantly!
                        </p>
                      </div>
                    </div>
                  ) : null}
                  {/* Verify Button */}
                  <button
                    type="submit"
                    className={`w-full text-white py-3 px-4 rounded-lg ${isVerifyEnabled && !isLoading ? "bg-red-500 hover:bg-red-600" : "bg-red-300 cursor-not-allowed"}`}
                    onClick={handleVerifyAndContinue}
                    disabled={!isVerifyEnabled || isLoading}
                  >
                    {getButtonContent(
                      checkUser ? "Verify" : "Verify and Continue",
                    )}
                  </button>
                </div>

                {/* Resend option */}
                <div className="text-center">
                  {timeLeft > 0 ? (
                    <span>Resend code in {timeLeft}s</span>
                  ) : (
                    <>
                      <span className="text-gray-500">
                        Didn&apos;t receive code?
                      </span>{" "}
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isLoading}
                        className={`font-medium underline ${
                          isLoading
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-red-500"
                        }`}
                      >
                        Resend
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;
