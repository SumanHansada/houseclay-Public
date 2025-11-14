"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { PhoneInput } from "react-international-phone";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/base-components";
import { AuthStep } from "@/common/enums";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import {
  useGenerateOtpMutation,
  useLazyCheckUserQuery,
  useLoginMutation,
  useRegisterMutation,
} from "@/store/apiSlice";
import { setAuthStep, setIsAuthenticated } from "@/store/authSlice";
import { RootState } from "@/store/store";
import {
  clearCheckUser,
  setCheckUser,
  setEmailID,
  setName,
  setUserDetail,
  UserDetail,
} from "@/store/userSlice";
import { ImageWithLoader } from "@/utility-components";

const emailIDRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

interface ContactLoginProps {
  onSuccess: () => void;
  onClose: () => void;
}

export const ContactLogin = ({ onSuccess, onClose }: ContactLoginProps) => {
  const { authStep, loginFromAddProperty } = useSelector(
    (state: RootState) => state.auth,
  );
  const { name, emailID } = useSelector(
    (state: RootState) => state.user.userDetail,
  );

  const checkUser = useSelector((state: RootState) => state.user.checkUser);
  const [login] = useLoginMutation();
  const [triggerCheckUser] = useLazyCheckUserQuery();
  const [register] = useRegisterMutation();
  const [generateOtp] = useGenerateOtpMutation();
  const dispatch = useDispatch();
  const { isMobile } = useDeviceContext();

  const [otpCode, setOtpCode] = useState<string[]>(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [phoneNo, setPhoneNo] = useState("");

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
    try {
      const checkUserResponse = await triggerCheckUser({ phoneNo }).unwrap();
      console.log("Check User Response:", checkUserResponse);
      dispatch(setCheckUser(checkUserResponse));
      const otpResponse = await generateOtp({ phoneNo });
      console.log("OTP Response:", otpResponse);
      if (otpResponse.data) {
        dispatch(setAuthStep(AuthStep.OTP));
      }
    } catch (err) {
      console.error("Login Error:", err);
      dispatch(clearCheckUser());
      dispatch(setAuthStep(AuthStep.CREATE_USER));
    }
  };

  const handleCreateUser = async () => {
    try {
      if (!phoneNo) return;
      if (!emailIDRegex.test(emailID)) return;
      if (!name) return;
      const otpResponse = await generateOtp({ phoneNo });
      console.log("OTP Response:", otpResponse);
      if (otpResponse.data) {
        dispatch(setAuthStep(AuthStep.OTP));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleVerifyAndContinue = async () => {
    try {
      if (!checkUser) {
        if (!phoneNo) return;
        if (!emailIDRegex.test(emailID)) return;
        if (!name) return;
        const registerResponse = await register({
          phoneNo,
          name,
          emailID,
          otpCode: otpCode.join(""),
        });
        if (registerResponse.data) {
          dispatch(setIsAuthenticated(true));
          dispatch(setUserDetail(registerResponse.data));
        } else {
          toast.error("Registration failed! Wrong OTP code");
          setOtpCode(["", "", "", ""]);
          throw new Error("Registration failed");
        }
      } else {
        if (!phoneNo) return;
        if (!otpCode.join()) return;
        const loginResponse = await login({
          phoneNo,
          otpCode: otpCode.join(""),
        });
        if (loginResponse.data) {
          dispatch(setIsAuthenticated(true));
          dispatch(setUserDetail(loginResponse?.data as UserDetail));
        } else {
          toast.error("Login failed! Wrong OTP code");
          setOtpCode(["", "", "", ""]);
          throw new Error("Login failed");
        }
      }
      dispatch(setAuthStep(AuthStep.LOGGED_IN));
      onSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (authStep === AuthStep.NONE) {
      console.log(authStep);
      dispatch(setAuthStep(AuthStep.PHONE));
    }
    // Focus the first input when component mounts
    if (inputRefs[0].current) {
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
      if (!loginFromAddProperty) {
        dispatch(setAuthStep(AuthStep.NONE));
      }
      clearTimer();
    };
  }, [dispatch]);

  const handleResendOtp = async () => {
    if (timeLeft > 0 || !phoneNo) return;
    try {
      const otpResponse = await generateOtp({ phoneNo });
      if (otpResponse.data) {
        startTimer();
      }
    } catch (err) {
      console.error("Resend OTP Error:", err);
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

  return (
    <>
      {!isMobile && (
        <div className="relative w-full h-0">
          <Button
            variant="secondary"
            size="custom"
            className="absolute top-2 right-2 rounded-full p-1"
            onClick={onClose}
          >
            <X size={24} />
          </Button>
        </div>
      )}
      <div className="flex items-center justify-center h-full bg-white rounded-lg">
        {!isMobile && (
          <div className="relative w-2/5 rounded-l-lg h-[420px] 2xl:h-[480px] overflow-hidden">
            <ImageWithLoader
              src="/images/contact-owner.svg"
              alt="Login"
              fill
              className="object-center"
              sizes="100vw"
              priority
            />
          </div>
        )}
        {/* Right pane (form) - takes remaining width */}
        <div className="flex flex-1 h-full px-8 mx-auto relative mt-10 mb-6">
          {authStep === AuthStep.PHONE && (
            <div className="w-full flex flex-col align-center justify-center gap-8">
              {/* Form header */}
              <div className="max-md:hidden">
                <h1 className="text-lg lg:text-xl xl:text-2xl 2xl:text-3xl mb-3 text-black ">
                  Unlock Owner Details
                </h1>
                <p className="text-gray-600 text-sm">
                  You&apos;re one step away from connecting with the property
                  owner. Use 1 Connect to view their contact information.
                </p>
              </div>

              {/* Form fields */}
              <div className="space-y-1 lg:space-y-2 xl:space-y-3 2xl:space-y-4">
                <div>
                  <div className="md:hidden mb-6">
                    <span className="text-2xl font-bold">No spam, </span>
                    <span className="text-2xl font-medium">just updates.</span>
                    <p className="text-lg text-gray-700">
                      You&apos;re one step away from connecting with the
                      property owner. Use 1 Connect to view their contact
                      information
                    </p>
                  </div>
                  <label
                    htmlFor="phone"
                    className="block text-base font-normal text-gray-700 mb-2"
                  >
                    Phone Number
                  </label>
                  <PhoneInput
                    defaultCountry="in"
                    disableFormatting={true}
                    value={phoneNo}
                    placeholder={"Enter phone number"}
                    onChange={(value) => setPhoneNo(value)}
                    className="custom-phone-input w-full border border-gray-300 rounded-lg px-2 py-0.5 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Info box */}
                <div className="md:hidden text-gray-400 mb-3">
                  We&apos;ll text you to confirm your number.
                </div>

                {/* Continue button */}
                <button
                  type="submit"
                  className={`w-full text-white py-3 px-4 rounded-lg ${!phoneNo.substring(2) ? "bg-red-300" : "bg-red-500 hover:bg-red-600"}`}
                  onClick={handleCheckUser}
                  disabled={!phoneNo.substring(2)}
                >
                  Continue
                </button>

                {/* Privacy policy */}
                <div className="md:hidden text-gray-500 text-sm">
                  By continuing to use this service, you agree to our{" "}
                  <Link
                    href="/terms-and-conditions"
                    className="text-gray-700 underline font-bold"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy-policy"
                    className="text-gray-700 underline font-bold"
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
              <div className="flex flex-col gap-1 mb-2">
                <h1 className="text-2xl text-black ">
                  Looks like you don&apos;t have an Account!
                </h1>
                <h2 className="text-lg">Create New Account</h2>
              </div>
              <div className="space-y-2">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-base font-normal text-gray-700"
                  >
                    Phone Number<span className="text-red-600">*</span>
                  </label>
                  <PhoneInput
                    defaultCountry="in"
                    value={phoneNo}
                    placeholder={"Enter phone number"}
                    onChange={(value) => setPhoneNo(value)}
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
                  className={`w-full text-white py-3 px-4 rounded-lg ${!phoneNo.substring(2) || !emailIDRegex.test(emailID) || !name ? "bg-red-300" : "bg-red-500 hover:bg-red-600"}`}
                  onClick={handleCreateUser}
                  disabled={
                    !phoneNo.substring(2) ||
                    !emailIDRegex.test(emailID) ||
                    !name
                  }
                >
                  Continue
                </button>
              </div>
            </div>
          )}
          {authStep === AuthStep.OTP && (
            <div className="w-full flex flex-col align-center justify-center gap-6">
              {/* Form header */}
              <div>
                <h1 className="text-2xl mb-1 text-black max-md:hidden">
                  Unlock Owner Details
                </h1>
                <div className="md:hidden mb-6">
                  <span className="text-2xl font-bold">No spam, </span>
                  <span className="text-2xl font-medium">just updates.</span>
                  <p className="text-lg text-gray-700">
                    You&apos;re one step away from connecting with the property
                    owner. Use 1 Connect to view their contact information
                  </p>
                </div>
                <p className="text-gray-600 text-sm">
                  We&apos;ve sent a 4-digit OTP to your phone number: {phoneNo}
                </p>
              </div>

              {/* Form fields */}
              <div className="flex flex-col gap-5">
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
                  />
                  <input
                    id="otp-2"
                    type="text"
                    inputMode="numeric"
                    ref={inputRefs[1]}
                    value={otpCode[1]}
                    onChange={(e) => handleChange(1, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(1, e)}
                    className={`w-12 h-12 text-center text-xl font-medium border-2 ${otpCode[1] ? "bg-white border-red-200" : "bg-gray-100 border-gray-300"}  rounded-md focus:border-red-200 focus:outline-none`}
                    maxLength={1}
                  />
                  <input
                    id="otp-3"
                    type="text"
                    inputMode="numeric"
                    ref={inputRefs[2]}
                    value={otpCode[2]}
                    onChange={(e) => handleChange(2, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(2, e)}
                    className={`w-12 h-12 text-center text-xl font-medium border-2 ${otpCode[2] ? "bg-white border-red-200" : "bg-gray-100 border-gray-300"}  rounded-md focus:border-red-200 focus:outline-none`}
                    maxLength={1}
                  />
                  <input
                    id="otp-4"
                    type="text"
                    inputMode="numeric"
                    ref={inputRefs[3]}
                    value={otpCode[3]}
                    onChange={(e) => handleChange(3, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(3, e)}
                    className={`w-12 h-12 text-center text-xl font-medium border-2 ${otpCode[3] ? "bg-white border-red-200" : "bg-gray-100 border-gray-300"}  rounded-md focus:border-red-200 focus:outline-none`}
                    maxLength={1}
                  />
                </div>

                <div className="flex flex-col gap-4">
                  {/* Verify Button */}
                  <button
                    type="submit"
                    className={`w-full text-white py-3 px-4 rounded-lg ${isVerifyEnabled ? "bg-red-500 hover:bg-red-600" : "bg-red-300"}`}
                    onClick={handleVerifyAndContinue}
                    disabled={!isVerifyEnabled}
                  >
                    {checkUser ? "Verify" : "Verify and Continue"}
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
                        className="text-red-500 font-medium underline"
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
