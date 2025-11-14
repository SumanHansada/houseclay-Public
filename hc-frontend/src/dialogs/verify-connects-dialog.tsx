"use client";

import dynamic from "next/dynamic";

import { PaymentVerificationStatus } from "@/common/enums";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/Dialog";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";
import { SvgIcon } from "@/utility-components";

// Lazy load DotLottieReact component
const DotLottieReact = dynamic(
  () =>
    import("@lottiefiles/dotlottie-react").then((mod) => mod.DotLottieReact),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-pulse bg-gray-200 rounded-lg w-full h-full"></div>
      </div>
    ),
  },
);

interface VerifyConnectsDialogProps {
  id: string;
  status: PaymentVerificationStatus;
  connects: number;
  onClose: () => void;
}

const VerifyConnectsDialog: React.FC<VerifyConnectsDialogProps> = ({
  id,
  status,
  connects,
  onClose,
}) => {
  const { isMobile } = useDeviceContext();
  const { closeDialog } = useDialog();

  const getHeaderText = () => {
    if (status === PaymentVerificationStatus.VERIFYING) {
      return "Verifying Payment";
    }
    if (status === PaymentVerificationStatus.SUCCESS) {
      return "Payment Verification Successful!";
    }
    return "Payment Verification Failed!";
  };

  const getStatusText = () => {
    switch (status) {
      case PaymentVerificationStatus.VERIFYING:
        return (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 w-full">
            <div className="flex items-center justify-center gap-2">
              <span className="text-green-600 text-sm md:text-lg">
                Verifying your payment
              </span>
            </div>
          </div>
        );
      case PaymentVerificationStatus.SUCCESS:
        return (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 w-full">
            <div className="flex items-center justify-center gap-2">
              <span className="text-yellow-600 text-sm md:text-lg w-full contents">
                <span className="font-semibold">+{connects} Connects</span>
                <SvgIcon
                  iconSize="medium"
                  name="connects"
                  size={isMobile ? 12 : 20}
                />
                <span className="">added to account.</span>
              </span>
            </div>
          </div>
        );
      case PaymentVerificationStatus.ERROR:
        return (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 w-full">
            <div className="flex items-center justify-center gap-2">
              <span className="text-red-600 text-sm md:text-lg">
                Payment verification failed. Please try again.
              </span>
            </div>
          </div>
        );
      default:
        return <span>Preparing verification...</span>;
    }
  };

  const getAnimationSrc = () => {
    switch (status) {
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

  return (
    <Dialog
      id={id}
      type={isMobile ? "bottom-sheet" : "card"}
      onClose={onClose}
      entryAnimation={isMobile ? "animate-slide-in-bottom" : "animate-fade-in"}
      exitAnimation={isMobile ? "animate-slide-out-bottom" : "animate-fade-out"}
      disableOverlayClick={true}
    >
      <DialogHeader>
        <div
          className={`px-6 flex flex-col justify-between items-center w-full`}
        >
          <h1 className="text-lg md:text-xl text-black">{getHeaderText()}</h1>
        </div>
      </DialogHeader>
      <DialogContent>
        <div className="flex flex-col items-center justify-center text-center px-6 py-2 gap-6 text-sm md:text-base">
          {status === "verifying" && (
            <div>
              This will only take a few seconds
              <span className="animate-ping" style={{ animationDelay: "0s" }}>
                .
              </span>
              <span
                className="animate-ping"
                style={{ animationDelay: "0.12s" }}
              >
                .
              </span>
              <span
                className="animate-ping"
                style={{ animationDelay: "0.24s" }}
              >
                .
              </span>
            </div>
          )}
          {/* Main Lottie Animation */}
          <div className="relative overflow-hidden rounded-lg">
            <div className="absolute inset-0 shadow-[inset_0_0_25px_25px_rgba(255,255,255,0.8)] z-20"></div>
            <DotLottieReact
              src={getAnimationSrc()}
              autoplay
              loop={
                status === PaymentVerificationStatus.VERIFYING ||
                status === PaymentVerificationStatus.SUCCESS
              }
              style={{ width: "400px", height: "auto" }}
            />
          </div>
          {/* Show Status Text */}
          {getStatusText()}
        </div>
      </DialogContent>
      <DialogFooter>
        {/* Action Buttons */}
        {status !== PaymentVerificationStatus.VERIFYING && (
          <div className="flex gap-4 w-full">
            <button
              onClick={onClose}
              className={`w-full py-3 font-medium rounded-lg transition duration-200 ${
                status === PaymentVerificationStatus.SUCCESS
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "text-black border hover:bg-red-600 hover:text-white"
              }`}
            >
              {status === PaymentVerificationStatus.SUCCESS
                ? "Continue"
                : "Close"}
            </button>
            {status === PaymentVerificationStatus.ERROR && (
              <button
                onClick={() => {
                  closeDialog("verify-connects-dialog");
                }}
                className="w-full py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition duration-200"
              >
                Retry
              </button>
            )}
          </div>
        )}
      </DialogFooter>
    </Dialog>
  );
};

export default VerifyConnectsDialog;
