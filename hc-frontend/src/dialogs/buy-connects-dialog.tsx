"use client";

import { Form, Formik } from "formik";
import { CheckCircle2, CircleCheck, Loader2, X, XCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import { Button } from "@/base-components";
import { PaymentVerificationStatus } from "@/common/enums";
import { Dialog, DialogContent, DialogHeader } from "@/components/Dialog";
import Login from "@/components/Login";
import { FormTextField } from "@/form-components";
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
import { SvgIcon } from "@/utility-components";
import { getErrorMessage } from "@/utils/rtkQueryHelpers";

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

const fmt2 = (rupees: number) =>
  rupees.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

interface BuyConnectsDialogProps {
  id: string;
}

const corporateValidationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

enum BuyConnectsStep {
  INFO = "INFO",
  LOGIN = "LOGIN",
  OTP = "OTP",
  CLAIM = "CLAIM",
  VERIFY_PAYMENT = "VERIFY_PAYMENT",
}

type ClaimStatus = "CLAIMING" | "SUCCESS" | "ERROR";

const BuyConnectsDialog: React.FC<BuyConnectsDialogProps> = ({ id }) => {
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
  const [step, setStep] = useState<BuyConnectsStep>(BuyConnectsStep.INFO);
  const [paymentStatus, setPaymentStatus] = useState<PaymentVerificationStatus>(
    PaymentVerificationStatus.VERIFYING,
  );
  const [claimStatus, setClaimStatus] = useState<ClaimStatus>("CLAIMING");

  // Corporate Data
  const [corporateEmail, setCorporateEmail] = useState("");
  const [verificationToken, setVerificationToken] = useState("");

  // OTP State
  const [otpCode, setOtpCode] = useState<string[]>(["", "", "", ""]);

  // Refs for OTP inputs
  const ref1 = useRef<HTMLInputElement>(null);
  const ref2 = useRef<HTMLInputElement>(null);
  const ref3 = useRef<HTMLInputElement>(null);
  const ref4 = useRef<HTMLInputElement>(null);
  const inputRefs = useMemo(() => [ref1, ref2, ref3, ref4], []);

  const handleCloseDialog = () => {
    closeDialog(id);
    // Reset state after animation
    setTimeout(() => {
      setStep(BuyConnectsStep.INFO);
      setCorporateEmail("");
      setVerificationToken("");
      setOtpCode(["", "", "", ""]);
      setPaymentStatus(PaymentVerificationStatus.VERIFYING);
      setClaimStatus("CLAIMING");
    }, 300);
  };

  // Sync auth state
  useEffect(() => {
    if (isAuthenticated && step === BuyConnectsStep.LOGIN) {
      setStep(BuyConnectsStep.INFO);
    }
  }, [isAuthenticated, step]);

  // Focus first OTP input when entering OTP step
  useEffect(() => {
    if (step === BuyConnectsStep.OTP && inputRefs[0].current) {
      setTimeout(() => {
        inputRefs[0].current?.focus();
      }, 100);
    }
  }, [step, inputRefs]);

  // --- Payment Flow ---

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePaymentSuccess = async (response: any) => {
    setStep(BuyConnectsStep.VERIFY_PAYMENT);
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
      setStep(BuyConnectsStep.LOGIN);
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

  const handleInitiateVerification = async (email: string) => {
    if (!email) return;

    if (!isAuthenticated) {
      setCorporateEmail(email);
      setStep(BuyConnectsStep.LOGIN);
      return;
    }

    try {
      const token = await initiateVerify(email).unwrap();
      setVerificationToken(token);
      setCorporateEmail(email);
      setStep(BuyConnectsStep.OTP);
      toast.success("OTP sent to your corporate email");
    } catch (err) {
      console.error("Failed to initiate verification", err);
      toast.error(getErrorMessage(err));
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

  const handleConfirmVerification = async (values: {
    companyName?: string;
    jobTitle?: string;
  }) => {
    const otp = otpCode.join("");
    if (otp.length !== 4) {
      toast.error("Please enter a valid 4-digit OTP");
      return;
    }

    try {
      await confirmVerify({
        otp,
        token: verificationToken,
        corporateEmail,
        companyName: values.companyName,
        jobTitle: values.jobTitle,
      }).unwrap();

      toast.success("Email verified successfully!");
      setStep(BuyConnectsStep.CLAIM);
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

  // --- Render: Sub-Components ---
  const renderContent = () => {
    switch (step) {
      case BuyConnectsStep.LOGIN:
        return (
          <Login
            onClose={handleCloseDialog}
            onSuccess={() => {
              /* Handled in useEffect */
            }}
          />
        );

      case BuyConnectsStep.OTP:
        return (
          <div className="flex flex-col gap-6 p-4">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                Verify Email
              </h3>
              <p className="text-gray-500 text-sm">
                We&apos;ve sent a code to{" "}
                <span className="font-medium text-gray-800">
                  {corporateEmail}
                </span>
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
            <Formik
              initialValues={{ companyName: "", jobTitle: "" }}
              onSubmit={handleConfirmVerification}
            >
              {() => (
                <Form className="flex flex-col gap-4">
                  <FormTextField
                    name="companyName"
                    label="Company Name (Optional)"
                    placeholder="e.g. Houseclay"
                  />
                  <FormTextField
                    name="jobTitle"
                    label="Job Title (Optional)"
                    placeholder="e.g. Software Engineer"
                  />
                  <Button
                    type="submit"
                    isLoading={isConfirming}
                    disabled={otpCode.some((d) => !d) || isConfirming}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl mt-2"
                  >
                    Verify & Continue
                  </Button>
                </Form>
              )}
            </Formik>
            <div className="text-center">
              <button
                onClick={() => {
                  setStep(BuyConnectsStep.INFO);
                  setOtpCode(["", "", "", ""]);
                  setVerificationToken("");
                }}
                className="text-gray-500 text-sm hover:text-gray-700 underline"
              >
                Back to Bundle Info
              </button>
            </div>
          </div>
        );

      case BuyConnectsStep.CLAIM:
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
                  onClick={handleCloseDialog}
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
                    onClick={handleCloseDialog}
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

      case BuyConnectsStep.VERIFY_PAYMENT:
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
                    +{bundleData?.connects || 0}
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
                onClick={handleCloseDialog}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl mt-4"
              >
                Continue
              </Button>
            )}
            {paymentStatus === PaymentVerificationStatus.ERROR && (
              <div className="flex gap-4 w-full mt-4">
                <Button
                  variant="secondary"
                  onClick={handleCloseDialog}
                  className="w-full"
                >
                  Close
                </Button>
                <Button
                  onClick={() => handleCloseDialog()}
                  className="w-full bg-red-600 text-white"
                >
                  Contact Support
                </Button>
              </div>
            )}
          </div>
        );

      default:
      case BuyConnectsStep.INFO:
        if (isBundleLoading)
          return <div className="p-8 text-center">Loading options...</div>;
        if (!bundleData)
          return (
            <div className="p-8 text-center text-red-500">
              Failed to load info.
            </div>
          );

        const isAlreadyVerified = userDetail?.corporateEmailVerified;

        return (
          <div className="flex flex-col justify-center gap-6 p-6 h-full">
            <div className="flex flex-col gap-4">
              <div className="bg-gradient-to-br from-red-50 to-white border border-red-100 rounded-xl p-6 text-center shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {bundleData.title}
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  {bundleData.subTitle}
                </p>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="bg-yellow-100 p-2 rounded-full">
                    <SvgIcon iconSize="medium" name="coin" size={32} />
                  </div>
                  <span className="text-3xl font-bold text-gray-900">
                    {bundleData.connects}{" "}
                    <span className="text-lg font-medium text-gray-500">
                      Connects
                    </span>
                  </span>
                </div>
                <div className="text-2xl font-bold text-red-600">
                  ₹{fmt2(bundleData.standardPrice)}
                  <span className="text-xs font-normal text-gray-500 block mt-1">
                    (Inclusive of all taxes)
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-500 text-center">
                <p>This bundle expires in 30 days.</p>
              </div>
              <Button
                onClick={handleProceedToPay}
                isLoading={isCreatingOrder}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-lg font-medium"
                disabled={isCreatingOrder}
              >
                Proceed to Pay
              </Button>
            </div>

            {isAlreadyVerified ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full text-green-600">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Benefits Claimed
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    You have already verified your corporate email.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-1/2 h-0.5 bg-gray-200"></div>
                  <h2 className="font-bold text-gray-800">OR</h2>
                  <div className="w-1/2 h-0.5 bg-gray-200"></div>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-2">
                    Unlock Free Access Pass
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Verify your corporate email ID to get 30 Connects for free!
                  </p>
                  <Formik
                    enableReinitialize
                    initialValues={{ email: corporateEmail || "" }}
                    validationSchema={corporateValidationSchema}
                    validateOnBlur={false}
                    validateOnChange={false}
                    onSubmit={(values) =>
                      handleInitiateVerification(values.email)
                    }
                  >
                    {() => (
                      <Form className="flex flex-col md:flex-row gap-3">
                        <FormTextField
                          name="email"
                          label=""
                          placeholder="Enter corporate email"
                          className="w-full"
                        />
                        <Button
                          type="submit"
                          isLoading={isInitiating}
                          className="bg-gray-900 hover:bg-black text-white px-6 rounded-xl md:w-auto w-full max-h-12"
                        >
                          Verify
                        </Button>
                      </Form>
                    )}
                  </Formik>
                </div>
              </>
            )}
          </div>
        );
    }
  };

  const getTitle = () => {
    switch (step) {
      case BuyConnectsStep.LOGIN:
        return "Login";
      case BuyConnectsStep.OTP:
        return "Verification";
      case BuyConnectsStep.CLAIM:
        return "Claim Benefits";
      case BuyConnectsStep.VERIFY_PAYMENT:
        return paymentStatus === PaymentVerificationStatus.SUCCESS
          ? "Payment Successful"
          : "Processing Payment";
      default:
        return "Buy Connects";
    }
  };

  return (
    <Dialog
      id={id}
      type={isMobile ? "fullscreen" : "card"}
      width={isMobile ? 100 : step === BuyConnectsStep.INFO ? 50 : 40}
      onClose={handleCloseDialog}
      entryAnimation={isMobile ? "animate-slide-in-right" : "animate-fade-in"}
      exitAnimation={isMobile ? "animate-slide-out-right" : "animate-fade-out"}
    >
      <DialogHeader>
        {isMobile ? (
          <MobileHeader>
            <MobileHeader.Title>{getTitle()}</MobileHeader.Title>
            <MobileHeader.RightAction>
              <Button
                variant="secondary"
                size="custom"
                className="rounded-full p-1"
                onClick={handleCloseDialog}
              >
                <X size={24} />
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
              onClick={handleCloseDialog}
            >
              <X size={20} />
            </Button>
          </div>
        )}
      </DialogHeader>

      <DialogContent>
        <div className={isMobile ? "h-full" : ""}>{renderContent()}</div>
      </DialogContent>
    </Dialog>
  );
};

export default BuyConnectsDialog;
