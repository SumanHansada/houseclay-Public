"use client";

import { CircleCheck, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";
import * as Yup from "yup";
import { Form, Formik } from "formik";

import { Button } from "@/base-components";
import { Dialog, DialogContent, DialogHeader } from "@/components/Dialog";
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
  useVerifyPaymentMutation,
} from "@/store/apiSlice";
import { RootState } from "@/store/store";
import { setConnectBal } from "@/store/userSlice";
import { SvgIcon } from "@/utility-components";
import { FormTextField } from "@/form-components";

// Lazy load Lottie to keep bundle size optimized
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

const corporateInitialValues = {
  email: "",
};

// Define types for internal state
type DialogStep = "INFO" | "LOGIN" | "OTP" | "CLAIM" | "VERIFY_PAYMENT";
type PaymentStatus = "VERIFYING" | "SUCCESS" | "ERROR";

const BuyConnectsDialog: React.FC<BuyConnectsDialogProps> = ({ id }) => {
  const { isMobile } = useDeviceContext();
  const { closeDialog } = useDialog();
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { userDetail } = useSelector((state: RootState) => state.user);

  const { data: bundleData, isLoading: isBundleLoading } = useBundleInfoQuery();
  const [createOrder, { isLoading: isCreatingOrder }] =
    useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  // Corporate verification mutations
  const [initiateVerify, { isLoading: isInitiating }] =
    useInitiateCorporateVerificationMutation();
  const [confirmVerify, { isLoading: isConfirming }] =
    useConfirmCorporateVerificationMutation();
  const [claimBenefits, { isLoading: isClaiming }] =
    useClaimCorporateBenefitsMutation();

  // Steps
  const [step, setStep] = useState<DialogStep>("INFO");

  // Payment Verification State
  const [paymentStatus, setPaymentStatus] =
    useState<PaymentStatus>("VERIFYING");

  // Pending action to resume after login
  const [pendingAction, setPendingAction] = useState<"BUY" | "VERIFY" | null>(
    null,
  );

  // State for corporate verification
  const [corporateEmail, setCorporateEmail] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [otpCode, setOtpCode] = useState(["", "", "", ""]);

  // Refs for OTP inputs
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleCloseDialog = () => {
    closeDialog(id);
    // Reset state after a short delay so animation finishes
    setTimeout(() => {
      setStep("INFO");
      setPendingAction(null);
      setCorporateEmail("");
      setVerificationToken("");
      setOtpCode(["", "", "", ""]);
      setPaymentStatus("VERIFYING");
    }, 300);
  };

  // Sync auth state
  useEffect(() => {
    if (isAuthenticated && step === "LOGIN") {
      if (pendingAction === "BUY") {
        setStep("INFO");
        setPendingAction(null);
      } else if (pendingAction === "VERIFY") {
        handleInitiateVerification(corporateEmail);
        setPendingAction(null);
      } else {
        setStep("INFO");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, step]);

  // --- Payment Flow Handlers ---

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePaymentSuccess = async (response: any) => {
    setStep("VERIFY_PAYMENT");
    setPaymentStatus("VERIFYING");

    try {
      const result = await verifyPayment({
        paymentId: response.razorpay_payment_id,
        orderId: response.razorpay_order_id,
        signature: response.razorpay_signature,
      }).unwrap();

      dispatch(setConnectBal(result.connectBal));
      setPaymentStatus("SUCCESS");
    } catch (e) {
      console.error("Payment verification failed:", e);
      setPaymentStatus("ERROR");
    }
  };

  const handleProceedToPay = async () => {
    if (!isAuthenticated) {
      setPendingAction("BUY");
      setStep("LOGIN");
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
        handler: handlePaymentSuccess, // Pass the handler
        prefill: {
          name: userDetail?.name || "Houseclay User",
          email: userDetail?.emailID || "",
          contact: userDetail?.phoneNo || "",
        },
        modal: {
          ondismiss: function () {
            // Optional: Handle if user closes razorpay without paying
            console.log("Payment modal closed");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        console.log("Payment failed:", response);
      });
      rzp.open();
    } catch (error) {
      console.error("Error creating payment order:", error);
    }
  };

  // --- Corporate Verification Handlers ---

  const handleInitiateVerification = async (email: string) => {
    if (!email) return;

    if (!isAuthenticated) {
      setCorporateEmail(email);
      setPendingAction("VERIFY");
      setStep("LOGIN");
      return;
    }

    try {
      const token = await initiateVerify(email).unwrap();
      setVerificationToken(token);
      setCorporateEmail(email);
      setStep("OTP");
    } catch (err) {
      console.error("Failed to initiate verification", err);
    }
  };

  const handleConfirmVerification = async (values: {
    companyName?: string;
    jobTitle?: string;
  }) => {
    const otp = otpCode.join("");
    if (otp.length !== 4) return;

    try {
      await confirmVerify({
        otp,
        token: verificationToken,
        corporateEmail,
        companyName: values.companyName,
        jobTitle: values.jobTitle,
      }).unwrap();
      setStep("CLAIM");
    } catch (err) {
      console.error("Failed to confirm verification", err);
    }
  };

  const handleClaimBenefits = async () => {
    try {
      await claimBenefits().unwrap();
      // Instead of opening another dialog, just close this one or show a success state
      // For now, assuming claim benefits auto-updates balance
      handleCloseDialog();
    } catch (err) {
      console.error("Failed to claim benefits", err);
    }
  };

  // OTP Logic
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    if (value.length > 1) return;
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  // --- Sub-Components ---

  const InfoContent = () => {
    if (isBundleLoading)
      return <div className="p-8 text-center">Loading options...</div>;
    if (!bundleData)
      return (
        <div className="p-8 text-center text-red-500">Failed to load info.</div>
      );

    // Check verification status from user slice
    const isAlreadyVerified = userDetail?.corporateEmailVerified;

    return (
      <div className="flex flex-col gap-6 p-6">
        {/* Purchase Section */}
        <div className="flex flex-col gap-4">
          <div className="bg-gradient-to-br from-red-50 to-white border border-red-100 rounded-xl p-6 text-center shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {bundleData.title}
            </h3>
            <p className="text-gray-600 mb-4 text-sm">{bundleData.subTitle}</p>

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

        {/* Corporate Verification Section - Only render if NOT verified */}
        {!isAlreadyVerified && (
          <>
            <div className="w-full h-px bg-gray-200"></div>
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-2">
                Unlock Free Access Pass
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Verify your corporate email ID to get 30 Connects for free!
              </p>

              <Formik
                initialValues={corporateInitialValues}
                validationSchema={corporateValidationSchema}
                validateOnBlur={false}
                validateOnChange={false}
                onSubmit={(values) => handleInitiateVerification(values.email)}
              >
                {({ isSubmitting }) => (
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
  };

  const PaymentVerificationContent = () => {
    const getAnimationSrc = () => {
      switch (paymentStatus) {
        case "VERIFYING":
          return "/animations/wallet.lottie";
        case "SUCCESS":
          return "/animations/rupee-coin.lottie";
        case "ERROR":
          return "/animations/payment-failed.lottie";
        default:
          return "/animations/rupee-coin.lottie";
      }
    };

    const getStatusText = () => {
      switch (paymentStatus) {
        case "VERIFYING":
          return (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 w-full text-center text-green-700">
              Verifying your payment...
            </div>
          );
        case "SUCCESS":
          return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 w-full flex justify-center gap-2 items-center text-yellow-800">
              <span className="font-bold">+{bundleData?.connects || 0}</span>
              <span>Connects added to account.</span>
            </div>
          );
        case "ERROR":
          return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 w-full text-center text-red-700">
              Payment verification failed.
            </div>
          );
      }
    };

    return (
      <div className="flex flex-col items-center justify-center p-6 gap-6 h-full">
        {/* Lottie Animation */}
        <div className="relative w-64 h-64">
          <DotLottieReact
            src={getAnimationSrc()}
            autoplay
            loop={paymentStatus === "VERIFYING" || paymentStatus === "SUCCESS"}
            className="w-full h-full"
          />
        </div>

        {getStatusText()}

        {paymentStatus === "SUCCESS" && (
          <Button
            onClick={handleCloseDialog}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl mt-4"
          >
            Continue
          </Button>
        )}

        {paymentStatus === "ERROR" && (
          <div className="flex gap-4 w-full mt-4">
            <Button
              variant="secondary"
              onClick={handleCloseDialog}
              className="w-full"
            >
              Close
            </Button>
            <Button
              onClick={handleCloseDialog} // Ideally retry, but usually retry means calling support
              className="w-full bg-red-600 text-white"
            >
              Contact Support
            </Button>
          </div>
        )}
      </div>
    );
  };

  const OtpContent = () => {
    return (
      <div className="flex flex-col gap-6 p-4">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-1">Verify Email</h3>
          <p className="text-gray-500 text-sm">
            We've sent a code to{" "}
            <span className="font-medium text-gray-800">{corporateEmail}</span>
          </p>
        </div>

        <div className="flex justify-center gap-3 my-2">
          {[0, 1, 2, 3].map((idx) => (
            <input
              key={idx}
              ref={inputRefs[idx]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="w-12 h-12 border-2 border-gray-300 rounded-lg text-center text-xl font-bold focus:border-red-500 focus:outline-none transition-colors"
              value={otpCode[idx]}
              onChange={(e) => handleOtpChange(idx, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(idx, e)}
            />
          ))}
        </div>

        <Formik
          initialValues={{ companyName: "", jobTitle: "" }}
          onSubmit={handleConfirmVerification}
        >
          {({ isSubmitting }) => (
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
                disabled={otpCode.some((d) => !d)}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl mt-2"
              >
                Verify & Continue
              </Button>
            </Form>
          )}
        </Formik>

        <div className="text-center">
          <button
            onClick={() => setStep("INFO")}
            className="text-gray-500 text-sm hover:text-gray-700"
          >
            Back to Bundle Info
          </button>
        </div>
      </div>
    );
  };

  const ClaimContent = () => {
    return (
      <div className="flex flex-col gap-6 py-8 text-center items-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-2">
          <CircleCheck className="text-green-600" size={40} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Verification Successful!
          </h3>
          <p className="text-gray-600">
            You are eligible for the Free Access Pass.
          </p>
        </div>
        <Button
          onClick={handleClaimBenefits}
          isLoading={isClaiming}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold text-lg shadow-lg shadow-green-200"
        >
          Claim 30 Free Connects
        </Button>
      </div>
    );
  };

  const getTitle = () => {
    switch (step) {
      case "LOGIN":
        return "Login";
      case "OTP":
        return "Verification";
      case "CLAIM":
        return "Claim Benefits";
      case "VERIFY_PAYMENT":
        return paymentStatus === "SUCCESS"
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
      width={isMobile ? 100 : 50}
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
        <div className={isMobile ? "h-full" : ""}>
          {step === "LOGIN" && (
            <Login
              onClose={handleCloseDialog}
              onSuccess={() => {
                // Handled in useEffect
              }}
            />
          )}
          {step === "INFO" && <InfoContent />}
          {step === "OTP" && <OtpContent />}
          {step === "CLAIM" && <ClaimContent />}
          {step === "VERIFY_PAYMENT" && <PaymentVerificationContent />}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BuyConnectsDialog;
