"use client";

import {
  CalendarClock,
  CheckCircle2,
  CircleCheck,
  HandCoins,
  Loader2,
  UserStar,
  X,
  XCircle,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import { TextField } from "@/base-components";

// Lazy load Lottie
const DotLottieReact = dynamic(
  () =>
    import("@lottiefiles/dotlottie-react").then((mod) => mod.DotLottieReact),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-pulse bg-gray-100 rounded-lg w-full h-full"></div>
      </div>
    ),
  },
);

// Razorpay type definition
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_API_KEY;

import { Button } from "@/base-components";
import { PaymentVerificationStatus } from "@/common/enums";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/Dialog";
import Login from "@/components/Login";
import { MobileHeader } from "@/layout-components";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";
import {
  useBundleInfoQuery,
  useClaimCorporateBenefitsMutation,
  useConfirmCorporateVerificationMutation,
  useCreateOrderMutation,
  useInitiateCorporateVerificationMutation,
  useLazyGetUserInfoQuery,
  useVerifyPaymentMutation,
} from "@/store/apiSlice";
import { RootState } from "@/store/store";
import { setConnectBal, setUserDetail } from "@/store/userSlice";
import { getErrorMessage } from "@/utils/rtkQueryHelpers";

interface ProSubscriptionDialogProps {
  id: string;
}

enum ProSubscriptionStep {
  INFO = "INFO",
  LOGIN = "LOGIN",
  OTP = "OTP",
  CLAIM = "CLAIM",
  VERIFY_PAYMENT = "VERIFY_PAYMENT",
}

type ClaimStatus = "CLAIMING" | "SUCCESS" | "ERROR";

const ProSubscriptionDialog = ({ id }: ProSubscriptionDialogProps) => {
  const { isMobile } = useDeviceContext();
  const { closeDialog } = useDialog();
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { userDetail } = useSelector((state: RootState) => state.user);

  // Queries & Mutations
  const { data: bundleData, isLoading: isBundleLoading } = useBundleInfoQuery();
  const [createOrder, { isLoading: isCreatingOrder }] =
    useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const [triggerGetUserInfo] = useLazyGetUserInfoQuery();

  // Corporate verification mutations
  const [initiateVerify, { isLoading: isInitiating }] =
    useInitiateCorporateVerificationMutation();
  const [confirmVerify, { isLoading: isConfirming }] =
    useConfirmCorporateVerificationMutation();
  const [claimBenefits] = useClaimCorporateBenefitsMutation();

  // State
  const [step, setStep] = useState<ProSubscriptionStep>(
    ProSubscriptionStep.INFO,
  );
  const [paymentStatus, setPaymentStatus] = useState<PaymentVerificationStatus>(
    PaymentVerificationStatus.VERIFYING,
  );
  const [claimStatus, setClaimStatus] = useState<ClaimStatus>("CLAIMING");

  const [selectedOption, setSelectedOption] = useState<
    "corporate" | "no-corporate"
  >("corporate");
  const [email, setEmail] = useState("");
  const [verificationToken, setVerificationToken] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");

  // OTP State
  const [otpCode, setOtpCode] = useState<string[]>(["", "", "", ""]);

  // Refs for OTP inputs
  const ref1 = useRef<HTMLInputElement>(null);
  const ref2 = useRef<HTMLInputElement>(null);
  const ref3 = useRef<HTMLInputElement>(null);
  const ref4 = useRef<HTMLInputElement>(null);
  const inputRefs = useMemo(() => [ref1, ref2, ref3, ref4], []);

  const onClose = () => {
    closeDialog(id);
    // Reset state after animation
    setTimeout(() => {
      setStep(ProSubscriptionStep.INFO);
      setEmail("");
      setVerificationToken("");
      setOtpCode(["", "", "", ""]);
      setPaymentStatus(PaymentVerificationStatus.VERIFYING);
      setClaimStatus("CLAIMING");
      setSelectedOption("corporate");
    }, 300);
  };

  // Sync auth state
  useEffect(() => {
    if (isAuthenticated && step === ProSubscriptionStep.LOGIN) {
      // If we just logged in and we have an email queued from picking corporate, automatically trigger it
      if (email && selectedOption === "corporate") {
        handleInitiateVerification(email);
      } else {
        setStep(ProSubscriptionStep.INFO);
      }
    }
  }, [isAuthenticated, step]);

  // Focus first OTP input when entering OTP step
  useEffect(() => {
    if (step === ProSubscriptionStep.OTP && inputRefs[0].current) {
      setTimeout(() => {
        inputRefs[0].current?.focus();
      }, 100);
    }
  }, [step, inputRefs]);

  // --- Payment Flow ---

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePaymentSuccess = async (response: any) => {
    setStep(ProSubscriptionStep.VERIFY_PAYMENT);
    setPaymentStatus(PaymentVerificationStatus.VERIFYING);

    try {
      const result = await verifyPayment({
        paymentId: response.razorpay_payment_id,
        orderId: response.razorpay_order_id,
        signature: response.razorpay_signature,
      }).unwrap();

      dispatch(setConnectBal(result.connectBal));
      setPaymentStatus(PaymentVerificationStatus.SUCCESS);
      toast.success("Payment verified successfully!");
    } catch (e) {
      console.error("Payment verification failed:", e);
      setPaymentStatus(PaymentVerificationStatus.ERROR);
      toast.error(getErrorMessage(e));
    }
  };

  const handleProceedToPay = async () => {
    if (!isAuthenticated) {
      setStep(ProSubscriptionStep.LOGIN);
      return;
    }

    if (!bundleData) return;

    try {
      const response = await createOrder().unwrap();

      const options = {
        key: RAZORPAY_KEY,
        currency: "INR",
        name: "Houseclay",
        description: `Purchase of ${bundleData.connects} Connects`,
        order_id: response.orderId,
        handler: handlePaymentSuccess,
        prefill: {
          name: userDetail?.name || "Houseclay User",
          email: userDetail?.emailID || "",
          contact: userDetail?.phoneNo || "",
        },
      };

      const rzp = new window.Razorpay(options);

      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      rzp.on("payment.failed", function (response: any) {
        toast.error("Payment failed or cancelled.");
        console.log("Payment failed:", response);
      });
      rzp.open();
    } catch (error) {
      console.error("Error creating payment order:", error);
      toast.error(getErrorMessage(error));
    }
  };

  // --- Corporate Verification Flow ---

  const handleInitiateVerification = async (emailToVerify: string) => {
    if (!emailToVerify) {
      toast.error("Please enter a corporate email");
      return;
    }

    // basic regex to stop invalid emails before hitting API
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailToVerify)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!isAuthenticated) {
      setEmail(emailToVerify);
      setStep(ProSubscriptionStep.LOGIN);
      return;
    }

    try {
      const token = await initiateVerify(emailToVerify).unwrap();
      setVerificationToken(token);
      setEmail(emailToVerify);
      setStep(ProSubscriptionStep.OTP);
      toast.success("OTP sent to your corporate email");
    } catch (err) {
      console.error("Failed to initiate verification", err);
      toast.error(getErrorMessage(err));
      // if we were in LOGIN step and it auto triggered, reset it down to INFO
      setStep(ProSubscriptionStep.INFO);
    }
  };

  const triggerClaimProcess = async () => {
    setClaimStatus("CLAIMING");
    try {
      // Claim Benefits
      await claimBenefits().unwrap();

      // Sync User Data
      const userData = await triggerGetUserInfo().unwrap();
      dispatch(setUserDetail(userData));
      setClaimStatus("SUCCESS");
    } catch (err) {
      console.error("Failed to claim benefits", err);
      setClaimStatus("ERROR");
      toast.error(getErrorMessage(err));
    }
  };

  const handleConfirmVerification = async () => {
    const otp = otpCode.join("");
    if (otp.length !== 4) {
      toast.error("Please enter a valid 4-digit OTP");
      return;
    }

    try {
      await confirmVerify({
        otp,
        token: verificationToken,
        corporateEmail: email,
        companyName: companyName || undefined,
        jobTitle: jobTitle || undefined,
      }).unwrap();

      toast.success("Email verified successfully!");
      setStep(ProSubscriptionStep.CLAIM);
      // Automatically Trigger Claim
      await triggerClaimProcess();
    } catch (err) {
      console.error("Failed to confirm verification", err);
      toast.error(getErrorMessage(err));
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d*$/.test(value)) return;

    const newOtp = [...otpCode];
    // Take only the last char if multiple typed (though input controls this)
    newOtp[index] = value.slice(-1);
    setOtpCode(newOtp);

    // Auto-focus next input
    if (value && index < 3 && inputRefs[index + 1].current) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    // Handle backspace
    if (
      e.key === "Backspace" &&
      !otpCode[index] &&
      index > 0 &&
      inputRefs[index - 1].current
    ) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();
    if (/^\d{4}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtpCode(digits);
      // Focus last input
      if (inputRefs[3].current) {
        inputRefs[3].current.focus();
      }
    }
  };

  const handleVerifyEmailClick = () => {
    handleInitiateVerification(email);
  };

  const getTitle = () => {
    switch (step) {
      case ProSubscriptionStep.LOGIN:
        return "Login";
      case ProSubscriptionStep.OTP:
        return "Verification";
      case ProSubscriptionStep.CLAIM:
        return "Claim Benefits";
      case ProSubscriptionStep.VERIFY_PAYMENT:
        return paymentStatus === PaymentVerificationStatus.SUCCESS
          ? "Payment Successful"
          : "Processing Payment";
      default:
        return "Houseclay PRO";
    }
  };

  const renderContent = () => {
    switch (step) {
      case ProSubscriptionStep.LOGIN:
        return (
          <Login
            onClose={onClose}
            onSuccess={() => {
              /* Handled in useEffect */
            }}
          />
        );

      case ProSubscriptionStep.OTP:
        return (
          <div className="flex flex-col gap-6 p-4">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                Verify Email
              </h3>
              <p className="text-gray-500 text-sm">
                We&apos;ve sent a code to{" "}
                <span className="font-medium text-gray-800">{email}</span>
              </p>
            </div>
            <div className="flex justify-center gap-3 my-2">
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                style={{ position: "absolute", opacity: 0, zIndex: -1 }}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                  if (val.length === 4) setOtpCode(val.split(""));
                }}
              />
              {[0, 1, 2, 3].map((idx) => (
                <input
                  key={idx}
                  ref={inputRefs[idx]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className={`w-12 h-12 border-2 rounded-lg text-center text-xl font-bold focus:outline-none transition-colors ${
                    otpCode[idx]
                      ? "bg-white border-red-500"
                      : "bg-gray-50 border-gray-300"
                  }`}
                  value={otpCode[idx]}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  onPaste={handleOtpPaste}
                />
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <TextField
                name="companyName"
                value={companyName}
                onChange={(val) => setCompanyName(String(val))}
                label="Company Name (Optional)"
                placeholder="e.g. Houseclay"
                className="w-full"
              />
              <TextField
                name="jobTitle"
                value={jobTitle}
                onChange={(val) => setJobTitle(String(val))}
                label="Job Title (Optional)"
                placeholder="e.g. Software Engineer"
                className="w-full"
              />
              <Button
                onClick={handleConfirmVerification}
                isLoading={isConfirming}
                disabled={otpCode.some((d) => !d) || isConfirming}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl mt-2"
              >
                Verify & Continue
              </Button>
            </div>

            <div className="text-center">
              <button
                onClick={() => {
                  setStep(ProSubscriptionStep.INFO);
                  setOtpCode(["", "", "", ""]);
                  setVerificationToken("");
                }}
                className="text-gray-500 text-sm hover:text-gray-700 underline"
              >
                Back to Subscription Info
              </button>
            </div>
          </div>
        );

      case ProSubscriptionStep.CLAIM:
        return (
          <div className="flex flex-col gap-6 p-6 text-center items-center justify-center min-h-[300px]">
            {/* CLAIMING STATE */}
            {claimStatus === "CLAIMING" && (
              <>
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-2 animate-pulse">
                  <Loader2 className="text-blue-600 animate-spin" size={40} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Verification Successful
                  </h3>
                  <p className="text-gray-600">
                    Adding 30 Free Connects to your account...
                  </p>
                </div>
              </>
            )}

            {/* SUCCESS STATE */}
            {claimStatus === "SUCCESS" && (
              <>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <CircleCheck className="text-green-600" size={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Benefits Unlocked!
                  </h3>
                  <p className="text-gray-600">
                    You have successfully claimed your Free Access Pass.
                  </p>
                </div>
                <Button
                  onClick={onClose}
                  className="w-full py-3 rounded-xl font-bold text-lg"
                >
                  Continue
                </Button>
              </>
            )}

            {/* ERROR STATE */}
            {claimStatus === "ERROR" && (
              <>
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-2">
                  <XCircle className="text-red-600" size={40} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Claim Failed
                  </h3>
                  <p className="text-gray-600">
                    Verification passed, but we couldn&apos;t add the connects.
                  </p>
                </div>
                <div className="flex gap-3 w-full">
                  <Button
                    variant="secondary"
                    onClick={onClose}
                    className="w-1/2 py-3 rounded-xl text-lg"
                  >
                    Close
                  </Button>
                  <Button
                    variant="danger"
                    onClick={triggerClaimProcess}
                    className="w-1/2 py-3 rounded-xl text-lg"
                  >
                    Retry Claim
                  </Button>
                </div>
              </>
            )}
          </div>
        );

      case ProSubscriptionStep.VERIFY_PAYMENT: {
        // Helper function for rendering payment verification UI
        const getAnimationSrc = () => {
          switch (paymentStatus) {
            case PaymentVerificationStatus.VERIFYING:
              return "/animations/wallet.lottie";
            case PaymentVerificationStatus.SUCCESS:
              return "/animations/rupee-coin.lottie";
            case PaymentVerificationStatus.ERROR:
              return "/animations/payment-failed.lottie";
            default:
              return "/animations/rupee-coin.lottie";
          }
        };

        const getStatusText = () => {
          switch (paymentStatus) {
            case PaymentVerificationStatus.VERIFYING:
              return (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 w-full text-center text-green-700">
                  Verifying your payment...
                </div>
              );
            case PaymentVerificationStatus.SUCCESS:
              return (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 w-full flex justify-center gap-2 items-center text-yellow-800">
                  <span className="font-bold">
                    +{bundleData?.connects || 30}
                  </span>
                  <span>Connects added to account.</span>
                </div>
              );
            case PaymentVerificationStatus.ERROR:
              return (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 w-full text-center text-red-700">
                  Payment verification failed.
                </div>
              );
          }
        };

        return (
          <div className="flex flex-col items-center justify-center p-6 gap-6 h-full">
            <div className="relative w-64 h-64">
              <DotLottieReact
                src={getAnimationSrc()}
                autoplay
                loop={
                  paymentStatus === PaymentVerificationStatus.VERIFYING ||
                  paymentStatus === PaymentVerificationStatus.SUCCESS
                }
                className="w-full h-full"
              />
            </div>
            {getStatusText()}
            {paymentStatus === PaymentVerificationStatus.SUCCESS && (
              <Button
                onClick={onClose}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl mt-4"
              >
                Continue
              </Button>
            )}
            {paymentStatus === PaymentVerificationStatus.ERROR && (
              <div className="flex gap-4 w-full mt-4">
                <Button
                  variant="secondary"
                  onClick={onClose}
                  className="w-full"
                >
                  Close
                </Button>
                <Button
                  onClick={onClose}
                  className="w-full bg-red-600 text-white"
                >
                  Contact Support
                </Button>
              </div>
            )}
          </div>
        );
      }

      default:
      case ProSubscriptionStep.INFO: {
        if (isBundleLoading) {
          return (
            <div className="p-8 text-center text-gray-500">
              Loading options...
            </div>
          );
        }

        const isAlreadyVerified = userDetail?.corporateEmailVerified;

        return (
          <div className="flex flex-col h-full">
            {/* HERO SECTION */}
            <div className="px-6 py-6 flex flex-col gap-6">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold text-gray-900">
                  Unlock <span className="text-red-600">Houseclay Pro</span>
                </h2>
                <p className="text-sm text-gray-500">
                  Connect directly with owners. Zero Brokerage.
                </p>
              </div>

              {/* Benefits */}
              <div className="w-full rounded-xl p-px shadow-sm bg-gradient-to-r from-red-600 via-red-500 via-80% to-amber-300">
                <div className="bg-white rounded-lg p-4">
                  <ul className="flex flex-col gap-2">
                    {[
                      "100% Verified Listings",
                      "Zero Brokerage - Direct Owner Contact",
                      "No Spam",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm font-medium text-gray-700"
                      >
                        <CheckCircle2
                          size={18}
                          className="text-red-500 shrink-0 mt-0.5"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* INFO CARDS */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    icon: HandCoins,
                    label: "30 Connects",
                    sub: "For Contacts",
                  },
                  { icon: CalendarClock, label: "30 Days", sub: "Validity" },
                  { icon: UserStar, label: "Verified", sub: "Badge" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-neutral-100 text-center gap-2 shadow-sm"
                  >
                    <div className="p-2 bg-white rounded-full shadow-sm text-red-500">
                      <item.icon size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-900">
                        {item.label}
                      </span>
                      <span className="text-xxs text-gray-500">{item.sub}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SELECTION SECTION */}
            <div className="flex flex-col gap-3 px-6 pb-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Standard Plan
              </p>

              {/* Corporate Option */}
              <div
                onClick={() => {
                  if (!isAlreadyVerified) {
                    setSelectedOption("corporate");
                  }
                }}
                className={`relative border rounded-xl p-4 transition-all duration-200 ${
                  isAlreadyVerified && selectedOption !== "corporate"
                    ? "opacity-50 cursor-not-allowed bg-gray-50"
                    : "cursor-pointer"
                } ${
                  selectedOption === "corporate"
                    ? "border-red-500 bg-red-50 ring-1 ring-red-500 shadow-md"
                    : "border-neutral-100 hover:border-red-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        selectedOption === "corporate"
                          ? "border-red-600 bg-red-600"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {selectedOption === "corporate" && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span
                        className={`text-sm font-semibold ${selectedOption === "corporate" ? "text-red-900" : "text-gray-700"}`}
                      >
                        I have a Corporate Email
                      </span>
                      <span className="text-xs text-green-600 font-medium">
                        Get it for FREE
                      </span>
                    </div>
                  </div>
                  {/* Price Tag */}
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-400 line-through">
                      ₹{bundleData?.standardPrice || 1499}
                    </span>
                    <span className="text-lg font-bold text-green-600">₹0</span>
                  </div>
                </div>

                {selectedOption === "corporate" && (
                  <div className="mt-4 pl-8 animate-fade-in space-y-3">
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Verify your work email to unlock{" "}
                      {bundleData?.connects || 30} connects instantly.
                    </p>

                    {isAlreadyVerified ? (
                      <div className="bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-medium flex gap-2 items-center">
                        <CheckCircle2 size={16} /> Already Verified
                      </div>
                    ) : (
                      <input
                        type="email"
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-white"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleVerifyEmailClick();
                        }}
                      />
                    )}
                  </div>
                )}
              </div>

              {/* No Corporate Option */}
              <div
                onClick={() => setSelectedOption("no-corporate")}
                className={`border rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                  selectedOption === "no-corporate"
                    ? "border-red-500 bg-red-50 ring-1 ring-red-500 shadow-md"
                    : "border-gray-200 hover:border-red-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        selectedOption === "no-corporate"
                          ? "border-red-600 bg-red-600"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {selectedOption === "no-corporate" && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span
                      className={`text-sm font-semibold ${selectedOption === "no-corporate" ? "text-red-900" : "text-gray-700"}`}
                    >
                      I don&apos;t have a Corporate Email
                    </span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    ₹{bundleData?.standardPrice || 1499}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }
  };

  return (
    <Dialog
      id={id}
      type={isMobile ? "fullscreen" : "card"}
      width={isMobile ? 100 : step === ProSubscriptionStep.INFO ? 50 : 40}
      onClose={onClose}
      entryAnimation={isMobile ? "animate-slide-in-bottom" : "animate-fade-in"}
      exitAnimation={isMobile ? "animate-slide-out-bottom" : "animate-fade-out"}
    >
      <DialogHeader className={isMobile ? "-mx-4" : ""}>
        {isMobile ? (
          <MobileHeader className="relative border-b-0">
            <MobileHeader.Title>{getTitle()}</MobileHeader.Title>
            <MobileHeader.RightAction>
              <Button
                variant="secondary"
                size="custom"
                className="rounded-full p-2 hover:bg-neutral-100"
                onClick={onClose}
              >
                <X size={20} />
              </Button>
            </MobileHeader.RightAction>
          </MobileHeader>
        ) : (
          <div className="flex justify-between items-center w-full">
            <h2 className="text-xl font-semibold">{getTitle()}</h2>
            <Button
              variant="secondary"
              size="custom"
              className="rounded-full p-1 hover:bg-gray-100"
              onClick={onClose}
            >
              <X size={20} />
            </Button>
          </div>
        )}
      </DialogHeader>

      <DialogContent>
        <div className={isMobile ? "h-full" : ""}>{renderContent()}</div>
      </DialogContent>

      {step === ProSubscriptionStep.INFO && (
        <DialogFooter className="p-4 border-t bg-white/90 rounded-b-xl">
          <div className="flex gap-3 w-full">
            <Button
              variant="secondary"
              size="custom"
              onClick={onClose}
              className="flex-1 rounded-xl py-3"
            >
              Close
            </Button>
            <Button
              onClick={
                selectedOption === "corporate"
                  ? handleVerifyEmailClick
                  : handleProceedToPay
              }
              isLoading={isCreatingOrder || isInitiating}
              disabled={
                isCreatingOrder ||
                isInitiating ||
                (userDetail?.corporateEmailVerified &&
                  selectedOption === "corporate")
              }
              className="flex-1 rounded-xl py-3"
            >
              {selectedOption === "corporate"
                ? userDetail?.corporateEmailVerified
                  ? "Verified"
                  : "Verify & Unlock"
                : `Pay ₹${bundleData?.standardPrice || 1499}`}
            </Button>
          </div>
        </DialogFooter>
      )}
    </Dialog>
  );
};

export default ProSubscriptionDialog;
