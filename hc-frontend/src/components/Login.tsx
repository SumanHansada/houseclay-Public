"use client";

import { PhoneInput } from "react-international-phone";
import Image from "next/image";
import { useDialog } from "@/providers/DialogContextProvider";
import "react-international-phone/style.css";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  useGenerateOtpMutation,
  useLazyCheckUserQuery,
  useLoginMutation,
  useRegisterMutation,
} from "@/store/apiSlice";
import { setUser, User } from "@/store/userSlice";

const Login = () => {
  const { closeDialog } = useDialog();
  const [loginStatus, setLoginStatus] = useState({
    enterPhone: false,
    enterOtp: false,
    createAccount: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const [phoneNo, setPhoneNo] = useState("");
  const [emailID, setEmailID] = useState("");
  const [name, setName] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [login] = useLoginMutation();
  const [triggerCheckUser] = useLazyCheckUserQuery();
  const [register] = useRegisterMutation();
  const [generateOtp] = useGenerateOtpMutation();
  const dispatch = useDispatch();
  const [userExists, setUserExists] = useState(false);
  const emailIDRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleCheckUser = async () => {
    try {
      const response = await triggerCheckUser({ phoneNo }).unwrap();
      console.log("User data:", response);
      setUserExists(true);
      setLoginStatus({
        ...loginStatus,
        enterPhone: false,
        enterOtp: true,
      })
    } catch (err) {
      setLoginStatus({
        ...loginStatus,
        enterPhone: false,
        createAccount: true,
      });
      console.error("Login Error:", err);
    }
  };

  const handleCreateUser = async () => {
    try {
      if (!phoneNo) return;
      if (!emailIDRegex.test(emailID)) return;
      if (!name) return;

      const otpResponse = await generateOtp({ phoneNo });
      console.log(otpResponse);
      if(otpResponse.data) {
        setLoginStatus({
          ...loginStatus,
          createAccount: false,
          enterOtp: true,
        });
      }      

    } catch (err) {
      console.log(err)
    }
  };

  const handleVerifyAndContinue = async () => {
    try {
      
      if(!userExists) {
        if (!phoneNo) return;
        if (!emailIDRegex.test(emailID)) return;
        if (!name) return;
      }
      else {
        if (!phoneNo) return;
        if (!otp.join()) return;
      }

      const registerResponse = await register({
        phoneNo,
        name,
        emailID,
        otpCode: otp.join(""),
      });

      if(registerResponse.data) {
        dispatch(setUser(registerResponse.data.user))
      }

      const loginResponse = await login({
        phoneNo,
        otpCode: otp.join(""),
      });

      console.log("loginResponse", loginResponse);

      setLoginStatus({
        ...loginStatus,
        createAccount: false,
        enterOtp: false,
        enterPhone:false
      });

      closeDialog("login-dialog");

    } catch (err) {

    }
  }

  const handlePhoneChange = (data: any) => {
    // Remove '+' sign and update the phone number
    const sanitizedPhone = data.replace(/^\+/, '');
    setPhoneNo(sanitizedPhone);
  }; 


  useEffect(() => {
    setLoginStatus({ ...loginStatus, enterPhone: true });
    // Focus the first input when component mounts
    if (inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
  }, []);

  const handleChange = (index: number, value: string): void => {
    // Only allow single digit numbers
    if (value && !/^\d*$/.test(value)) return;

    // Update the OTP array
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1); // Ensure only one character
    setOtp(newOtp);

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
      !otp[index] &&
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
      const newOtp = [...otp];

      // Fill the inputs with pasted digits
      digits.forEach((digit, index) => {
        if (index < 4) {
          newOtp[index] = digit;
        }
      });

      setOtp(newOtp);

      // Focus the last input
      if (inputRefs[3].current) {
        inputRefs[3].current.focus();
      }
    }
  };

  const isVerifyEnabled = otp.every((digit) => digit !== "");

  return (
    <div className="flex items-center justify-center h-full bg-white rounded-lg">
      {/* Left pane (image) - takes full height */}
      <div className="h-full w-5/12">
        <Image
          src="/icons/login.svg"
          alt="Login"
          className="relative rounded-l-lg"
          width={500}
          height={400}
        />
      </div>
      {/* Right pane (form) - takes remaining width */}
      <div className="flex flex-1 h-full px-8">
        {/* Close button */}
        <div className="absolute top-4 right-4">
          <button
            className="text-gray-400 hover:text-gray-600"
            onClick={() => closeDialog("login-dialog")}
          >
            <Image src="/icons/close.svg" alt="Close" width={30} height={30} />
          </button>
        </div>

        {loginStatus.enterPhone && (
          <div className="w-full flex flex-col align-center justify-center gap-8">
            {/* Form header */}
            <div>
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

              {/* Continue button */}
              <button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg"
                onClick={handleCheckUser}
              >
                Continue
              </button>
            </div>
          </div>
        )}
        {loginStatus.createAccount && (
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
        {loginStatus.enterOtp && (
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
                  value={otp[0]}
                  onChange={(e) => handleChange(0, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(0, e)}
                  onPaste={handlePaste}
                  className={`w-14 h-14 text-center text-xl font-medium border-2 ${otp[0] ? "bg-white border-red-200" : "bg-gray-100 border-gray-300"}  rounded-md focus:border-red-200 focus:outline-none`}
                  maxLength={1}
                />
                <input
                  type="text"
                  inputMode="numeric"
                  ref={inputRefs[1]}
                  value={otp[1]}
                  onChange={(e) => handleChange(1, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(1, e)}
                  className={`w-14 h-14 text-center text-xl font-medium border-2 ${otp[1] ? "bg-white border-red-200" : "bg-gray-100 border-gray-300"}  rounded-md focus:border-red-200 focus:outline-none`}
                  maxLength={1}
                />
                <input
                  type="text"
                  inputMode="numeric"
                  ref={inputRefs[2]}
                  value={otp[2]}
                  onChange={(e) => handleChange(2, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(2, e)}
                  className={`w-14 h-14 text-center text-xl font-medium border-2 ${otp[2] ? "bg-white border-red-200" : "bg-gray-100 border-gray-300"}  rounded-md focus:border-red-200 focus:outline-none`}
                  maxLength={1}
                />
                <input
                  type="text"
                  inputMode="numeric"
                  ref={inputRefs[3]}
                  value={otp[3]}
                  onChange={(e) => handleChange(3, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(3, e)}
                  className={`w-14 h-14 text-center text-xl font-medium border-2 ${otp[3] ? "bg-white border-red-200" : "bg-gray-100 border-gray-300"}  rounded-md focus:border-red-200 focus:outline-none`}
                  maxLength={1}
                />
              </div>
              {/* Info box */}
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
              {/* Verify Button */}
              <button
                type="submit"
                className={`w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg ${isVerifyEnabled ? "bg-red-500 hover:bg-red-600" : "bg-red-400"}`}
                onClick={handleVerifyAndContinue}
                disabled={!isVerifyEnabled}
              >
                Verify and Continue
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
