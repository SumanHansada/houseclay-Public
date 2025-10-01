"use client";

import { Lightbulb, Mail, Phone, PhoneCall } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";

import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useContactOwnerMutation } from "@/store/apiSlice";
import { setConnectBal } from "@/store/authSlice";
import { ImageWithLoader, SvgIcon } from "@/utility-components";

interface UnlockOwnerDetailsProps {
  onClose: () => void;
  propertyID: string;
}

type Step = "confirm" | "unlocked" | "error";

type ApiError = {
  data?: {
    code?: string;
    message?: string;
  };
  error?:
    | string
    | {
        code?: string;
        message?: string;
      };
};

function getErrorMeta(err: unknown): {
  title: string;
  message: string;
  code?: string;
} {
  const apiError = err as ApiError;
  const errorPayload =
    apiError?.data ??
    (typeof apiError?.error === "object" ? apiError.error : undefined);

  const code = errorPayload?.code;
  const message =
    errorPayload?.message ||
    (typeof apiError?.error === "string" ? apiError.error : undefined) ||
    "Unable to unlock. Please try again.";

  if (code === "INSUFFICIENT_CONNECTS") {
    return {
      title: "Not enough Connects",
      message: "You don't have enough Connects to unlock owner details.",
      code,
    };
  }

  if (code === "ALREADY_UNLOCKED") {
    return {
      title: "Already unlocked",
      message: "You have already unlocked this owner's contact earlier.",
      code,
    };
  }

  return { title: "Something went wrong", message, code };
}

// ----------------------------------------------------------------------------

export const UnlockOwnerDetails = ({
  onClose,
  propertyID,
}: UnlockOwnerDetailsProps) => {
  const { isMobile } = useDeviceContext();
  const dispatch = useDispatch();

  const [step, setStep] = useState<Step>("confirm");
  const [lastError, setLastError] = useState<{
    title: string;
    message: string;
    code?: string;
  }>();

  const [contactOwner, { data: ownerDetails, isLoading, reset }] =
    useContactOwnerMutation();

  const handleConfirmAndUnlock = async () => {
    setLastError(undefined);
    try {
      const res = await contactOwner({ propertyID }).unwrap();
      if (typeof res?.connectBal === "number") {
        dispatch(setConnectBal(res.connectBal));
      }
      setStep("unlocked");
    } catch (err) {
      setLastError(getErrorMeta(err));
      setStep("error");
    }
  };

  const handleRetry = async () => {
    reset();
    setStep("confirm");
  };

  const renderConfirm = () => (
    <div className="px-8 space-y-8">
      <div className="space-y-1 mt-5">
        <h1 className="text-2xl">Unlock Owner Details</h1>
        <p className="text-lg text-gray-700">
          You&apos;re one step away from connecting with the property owner.
          Using <span className="font-semibold">1 Connect</span> will show their
          contact info.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="bg-red-50 p-2 rounded-lg flex items-center gap-2">
          <SvgIcon iconSize="medium" name="coin-egg" size={40} />
          <p className="text-gray-800">
            <span className="font-bold">1 Connect</span> will be deducted now.
          </p>
        </div>

        <div className="space-y-2">
          <button
            data-testid="confirm-unlock"
            className="w-full text-white py-3 px-4 rounded-lg bg-red-500 hover:bg-red-600 disabled:opacity-60"
            onClick={handleConfirmAndUnlock}
            disabled={isLoading}
          >
            {isLoading ? "Unlocking..." : "Confirm & Unlock"}
          </button>
          <button
            className="w-full text-gray-700 py-3 px-4 hover:bg-gray-50 rounded-lg"
            onClick={() => {
              reset();
              onClose();
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  const renderUnlocked = () => (
    <div className="px-8 space-y-5">
      <div className="space-y-1">
        <h1 className="text-xl xl:text-2xl">
          Owner Details Unlocked Successfully!
        </h1>
        <p className="text-gray-700">Get in touch directly with the owner.</p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="flex gap-1 text-gray-700 text-lg">
          Owner&apos;s Name{" "}
          <span className="text-black font-medium">
            {ownerDetails?.name ?? "Owner"}
          </span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 border rounded-xl p-4 gap-4">
          {ownerDetails?.phone && (
            <a
              className="flex items-start gap-3 border-r md:border-r md:pr-4"
              href={`tel:${ownerDetails.phone}`}
            >
              <Phone size={20} className="text-red-500 mt-1" />
              <h3 className="flex flex-col gap-1">
                <span className="text-gray-700 text-sm">Phone Number</span>
                <span>{ownerDetails.phone}</span>
              </h3>
            </a>
          )}

          {ownerDetails?.email && (
            <a
              className="flex items-start gap-3 md:pl-4"
              href={`mailto:${ownerDetails.email}`}
            >
              <Mail size={20} className="text-red-500 mt-1" />
              <h3 className="flex flex-col gap-1">
                <span className="text-gray-700 text-sm">Email Address</span>
                <span>{ownerDetails.email}</span>
              </h3>
            </a>
          )}
        </div>
      </div>

      <div>
        {/* Info Tip */}
        <div className="flex gap-2 w-full rounded-lg bg-teal-100 p-2">
          <div className="flex items-center gap-1 px-2 py-1 rounded-md text-white bg-teal-400">
            <Lightbulb size={20} />
            Tip
          </div>
          <h4 className="text-gray-700 text-sm">
            Always visit the property before paying advance money.
          </h4>
        </div>

        <div className="flex">
          {ownerDetails?.phone && (
            <div className="flex w-full mt-4 gap-2">
              <a
                href={`tel:${ownerDetails.phone}`}
                className="flex items-center justify-center w-1/2 gap-2 border border-red-500 rounded-lg py-2 hover:bg-red-100"
              >
                <PhoneCall size={20} className="text-red-500" />
                <span>Call Owner</span>
              </a>
              <a
                className="flex items-center justify-center w-1/2 gap-1 border border-green-500 rounded-lg py-2 hover:bg-green-100"
                href={`https://wa.me/${ownerDetails.phone}`}
                target="_blank"
                rel="noreferrer"
              >
                <SvgIcon
                  iconSize="small"
                  name="whatsapp"
                  size={32}
                  className="text-green-500"
                />
                WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderError = () => (
    <div className="px-8 space-y-6">
      <div className="space-y-1 mt-5">
        <h1 className="text-2xl">{lastError?.title ?? "Couldn’t unlock"}</h1>
        <p className="text-gray-700">
          {lastError?.message ?? "Please try again."}
        </p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
        {lastError?.code
          ? `Error code: ${lastError.code}`
          : "An error occurred while unlocking owner details."}
      </div>

      <div className="space-y-2">
        {lastError?.code === "INSUFFICIENT_CONNECTS" ? (
          <>
            <a
              href="/buy-connects"
              className="block w-full text-center text-white py-3 px-4 rounded-lg bg-gray-900 hover:bg-black"
            >
              Buy Connects
            </a>
            <button
              className="w-full py-3 px-4 rounded-lg border hover:bg-gray-50"
              onClick={handleRetry}
            >
              Try Again
            </button>
          </>
        ) : (
          <>
            <button
              className="w-full text-white py-3 px-4 rounded-lg bg-red-500 hover:bg-red-600"
              onClick={handleRetry}
            >
              Retry Unlock
            </button>
            <button
              className="w-full py-3 px-4 rounded-lg border hover:bg-gray-50"
              onClick={() => {
                reset();
                onClose();
              }}
            >
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-center h-full bg-white rounded-lg">
      {!isMobile && (
        <div className="relative w-2/5 rounded-l-lg h-[420px] 2xl:h-[480px] overflow-hidden">
          <ImageWithLoader
            src="/images/contact-owner.svg"
            alt="Contact owner"
            fill
            className="object-center"
            sizes="100vw"
            priority
          />
        </div>
      )}
      <div className="flex-1 h-full">
        {step === "confirm" && renderConfirm()}
        {step === "unlocked" && renderUnlocked()}
        {step === "error" && renderError()}
      </div>
    </div>
  );
};
