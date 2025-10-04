import { X } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/Dialog";
import { useDeviceContext } from "@/providers/DeviceContextProvider";

interface EmailVerificationDialogProps {
  id: string;
  emailToVerify: string;
  onSubmit: (email: string, otp: string) => void;
  onClose: () => void;
}

const EmailVerificationDialog: React.FC<EmailVerificationDialogProps> = ({
  id,
  emailToVerify,
  onSubmit,
  onClose,
}) => {
  const { isMobile } = useDeviceContext();
  const [otpCode, setOtpCode] = useState<string[]>(["", "", "", ""]);

  const ref1 = useRef<HTMLInputElement>(null);
  const ref2 = useRef<HTMLInputElement>(null);
  const ref3 = useRef<HTMLInputElement>(null);
  const ref4 = useRef<HTMLInputElement>(null);

  const inputRefs = useMemo(() => [ref1, ref2, ref3, ref4], []);

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

  const handleVerifyAndContinue = () => {
    // run the api
    const otp = otpCode.join("");
    console.log("Email is Verified - OTP: " + otpCode);
    onSubmit(emailToVerify, otp);
  };

  const isVerifyEnabled = otpCode.every((digit) => digit && digit !== "");

  return (
    <Dialog
      id={id}
      type={isMobile ? "fullscreen" : "card"}
      onClose={onClose}
      width={isMobile ? 100 : 40}
      entryAnimation={isMobile ? "animate-slide-in-bottom" : "animate-fade-in"}
      exitAnimation={isMobile ? "animate-slide-out-bottom" : "animate-fade-out"}
    >
      <DialogHeader>
        <div className="relative flex h-full w-full items-center justify-center">
          {/* Title: Centered and only visible on mobile */}
          <h1 className="text-lg text-center truncate font-medium md:hidden">
            Verify your email address
          </h1>

          {/* Close Button: Repositions itself based on screen size */}
          <button
            aria-label="Close"
            onClick={onClose}
            className="absolute p-2 right-2 top-1/2 -translate-y-1/2 rounded-full md:right-4 md:border md:border-gray-200 md:top-4 md:translate-y-0"
          >
            <X size={24} />
          </button>
        </div>
      </DialogHeader>
      <DialogContent>
        <div className="w-full flex flex-col justify-center gap-4 p-6 max-md:h-full">
          {/* Form header */}
          <div className="max-md:text-center">
            <h1 className="text-2xl mb-1 max-md:hidden">
              Verify Your email address
            </h1>
            <p className="text-gray-700 md:text-sm">
              We&apos;ve sent a 4-digit OTP to your email address.
            </p>
            <b>{emailToVerify}</b>
          </div>

          {/* Form fields */}
          <div className="flex flex-col gap-4">
            <div className="flex gap-2 max-md:mx-auto">
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

            {/* Resend option */}
            <div className="max-md:text-center">
              <span className="text-gray-500">Didn&apos;t receive code?</span>
              &nbsp;
              <button className="text-red-500 font-medium underline">
                Resend
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogFooter>
        <div className="flex w-full justify-between md:justify-end md:gap-3">
          <button
            type="button"
            className="border rounded-lg py-3 px-4"
            onClick={onClose}
          >
            Cancel
          </button>
          {/* Verify Button */}
          <button
            type="submit"
            className={`w-fit text-white py-3 px-4 rounded-lg ${isVerifyEnabled ? "bg-red-500 hover:bg-red-600" : "bg-red-300"}`}
            onClick={handleVerifyAndContinue}
            disabled={!isVerifyEnabled}
          >
            Verify and Continue
          </button>
        </div>
      </DialogFooter>
    </Dialog>
  );
};

export default EmailVerificationDialog;
