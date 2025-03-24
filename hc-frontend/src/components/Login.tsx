"use client";

import "react-international-phone/style.css";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { PhoneInput } from "react-international-phone";
import { useDispatch } from "react-redux";

import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";
import {
  useGenerateOtpMutation,
  useLazyCheckUserQuery,
  useLoginMutation,
  useRegisterMutation,
} from "@/store/apiSlice";
import { setToken } from "@/store/authSlice";

enum AuthStep {
  PHONE = "phone",
  OTP = "otp",
  CREATE_USER = "createUser",
  EMPTY = "",
}

const emailIDRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const Login = () => {
  const { closeDialog } = useDialog();
  const [authStep, setAuthStep] = useState<AuthStep>(AuthStep.EMPTY);
  const [phoneNo, setPhoneNo] = useState("");
  const [emailID, setEmailID] = useState("");
  const [name, setName] = useState("");
  const [login] = useLoginMutation();
  const [triggerCheckUser] = useLazyCheckUserQuery();
  const [register] = useRegisterMutation();
  const [generateOtp] = useGenerateOtpMutation();
  const dispatch = useDispatch();
  const [userExists, setUserExists] = useState(false);
  const { isMobile } = useDeviceContext();

  const [otpCode, setOtpCode] = useState<string[]>(["", "", "", ""]);

  const ref1 = useRef<HTMLInputElement>(null);
  const ref2 = useRef<HTMLInputElement>(null);
  const ref3 = useRef<HTMLInputElement>(null);
  const ref4 = useRef<HTMLInputElement>(null);

  const inputRefs = useMemo(() => [ref1, ref2, ref3, ref4], []);

  const handleCheckUser = async () => {
    try {
      const checkUserResponse = await triggerCheckUser({ phoneNo }).unwrap();
      console.log("Check User Response:", checkUserResponse);
      setUserExists(checkUserResponse.exists);
      const otpResponse = await generateOtp({ phoneNo });
      console.log("OTP Response:", otpResponse);
      if (otpResponse.data) {
        setAuthStep(AuthStep.OTP);
      }
    } catch (err) {
      console.error("Login Error:", err);
      setAuthStep(AuthStep.CREATE_USER);
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
        setAuthStep(AuthStep.OTP);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleVerifyAndContinue = async () => {
    try {
      if (!userExists) {
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
          dispatch(setToken(registerResponse.data));
        }
      } else {
        if (!phoneNo) return;
        if (!otpCode.join()) return;
        const loginResponse = await login({
          phoneNo,
          otpCode: otpCode.join(""),
        });
        if (loginResponse.data) {
          dispatch(setToken(loginResponse.data));
        }
      }
      setAuthStep(AuthStep.EMPTY);
      closeDialog("login-dialog");
    } catch (err) {
      console.error(err);
    }
  };

  const handlePhoneChange = (data: string) => {
    // Remove '+' sign and update the phone number
    const sanitizedPhone = data.replace(/^\+/, "");
    setPhoneNo(sanitizedPhone);
  };

  useEffect(() => {
    setAuthStep(AuthStep.PHONE);
    // Focus the first input when component mounts
    if (inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
  }, [inputRefs]);

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
    <div className="flex items-center justify-center h-full bg-white rounded-lg">
      {/* Left pane (image) - takes full height */}
      {!isMobile && (
        <div className="h-full w-5/12">
          <Image
            src="/icons/login.svg"
            alt="Login"
            className="relative rounded-l-lg"
            width={500}
            height={400}
          />
        </div>
      )}
      {/* Right pane (form) - takes remaining width */}
      <div className="flex flex-1 h-full px-8">
        {authStep === AuthStep.PHONE && (
          <div className="w-full flex flex-col align-center justify-center gap-8">
            {/* Form header */}
            <div className="max-md:hidden">
              <h1 className="text-2xl mb-3 text-black ">
                Log In to Your Account
              </h1>
              <p className="text-gray-600 text-sm">
                Enter phone number to log in
              </p>
            </div>

            {/* Form fields */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="phone"
                  className="block text-base font-normal text-gray-700 mb-2"
                >
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

              {/* Info box */}
              <div className="md:hidden text-gray-400 mb-3">
                We’ll text you to confirm your number.
              </div>

              {/* Continue button */}
              <button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg"
                onClick={handleCheckUser}
              >
                Continue
              </button>

              {/* Privacy policy */}
              <div className="md:hidden text-gray-500 text-sm">
                By continuing to use this service, you agree to our{" "}
                <span className="text-gray-700 underline font-bold">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="text-gray-700 underline font-bold">
                  Privacy Policy
                </span>
              </div>
            </div>
          </div>
        )}
        {authStep === AuthStep.CREATE_USER && (
          <div className="w-full flex flex-col align-center justify-center gap-2">
            {/* Form header */}
            <div>
              <h1 className="text-2xl mb-1 text-black ">Create New Account</h1>
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
                  placeholder="Enter phone number"
                  onChange={(value) => handlePhoneChange(value)}
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
                  onChange={(e) => setEmailID(e.target.value)}
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
                  onChange={(e) => setName(e.target.value)}
                  className="px-2 py-2 w-full border border-gray-300 rounded-lg mb-2"
                />
              </div>
              {/* Continue button */}
              <button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg"
                onClick={handleCreateUser}
              >
                Continue
              </button>
            </div>
          </div>
        )}
        {authStep === AuthStep.OTP && (
          <div className="w-full flex flex-col align-center justify-center gap-8">
            {/* Form header */}
            <div>
              <h1 className="text-2xl mb-3 text-black ">
                Verify Your Phone Number
              </h1>
              <p className="text-gray-600 text-sm">
                We’ve sent a 4-digit OTP to your phone number.
              </p>
            </div>

            {/* Form fields */}
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  ref={inputRefs[0]}
                  value={otpCode[0]}
                  onChange={(e) => handleChange(0, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(0, e)}
                  onPaste={handlePaste}
                  className={`w-14 h-14 text-center text-xl font-medium border-2 ${otpCode[0] ? "bg-white border-red-200" : "bg-gray-100 border-gray-300"}  rounded-md focus:border-red-200 focus:outline-none`}
                  maxLength={1}
                />
                <input
                  type="text"
                  inputMode="numeric"
                  ref={inputRefs[1]}
                  value={otpCode[1]}
                  onChange={(e) => handleChange(1, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(1, e)}
                  className={`w-14 h-14 text-center text-xl font-medium border-2 ${otpCode[1] ? "bg-white border-red-200" : "bg-gray-100 border-gray-300"}  rounded-md focus:border-red-200 focus:outline-none`}
                  maxLength={1}
                />
                <input
                  type="text"
                  inputMode="numeric"
                  ref={inputRefs[2]}
                  value={otpCode[2]}
                  onChange={(e) => handleChange(2, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(2, e)}
                  className={`w-14 h-14 text-center text-xl font-medium border-2 ${otpCode[2] ? "bg-white border-red-200" : "bg-gray-100 border-gray-300"}  rounded-md focus:border-red-200 focus:outline-none`}
                  maxLength={1}
                />
                <input
                  type="text"
                  inputMode="numeric"
                  ref={inputRefs[3]}
                  value={otpCode[3]}
                  onChange={(e) => handleChange(3, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(3, e)}
                  className={`w-14 h-14 text-center text-xl font-medium border-2 ${otpCode[3] ? "bg-white border-red-200" : "bg-gray-100 border-gray-300"}  rounded-md focus:border-red-200 focus:outline-none`}
                  maxLength={1}
                />
              </div>
              {/* Info box */}
              {!userExists && (
                <div className="bg-red-50 p-4 rounded-lg flex items-center gap-4">
                  <Image
                    src="/icons/coin-egg.svg"
                    alt="Info"
                    width={60}
                    height={60}
                  />

                  <div>
                    <p className="text-gray-800 font-normal">
                      Verify your Phone Number and earn
                      <br />
                      <span className="font-bold">2 Connects</span> instantly!
                    </p>
                  </div>
                </div>
              )}
              {/* Verify Button */}
              <button
                type="submit"
                className={`w-full text-white py-3 px-4 rounded-lg ${isVerifyEnabled ? "bg-red-500 hover:bg-red-600" : "bg-red-300"}`}
                onClick={handleVerifyAndContinue}
                disabled={!isVerifyEnabled}
              >
                {userExists ? "Verify" : "Verify and Continue"}
              </button>
              {/* Resend option */}
              <div className="text-center">
                <span className="text-gray-500">Didn&apos;t receive code?</span>{" "}
                <button className="text-red-500 font-medium underline">
                  Resend
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
