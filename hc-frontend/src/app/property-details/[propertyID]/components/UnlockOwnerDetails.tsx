"use client";

import { Lightbulb, Mail, Phone, PhoneCall, UserRound, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useDispatch } from "react-redux";

import { Button } from "@/base-components";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useContactOwnerMutation } from "@/store/apiSlice";
import { setConnectBal } from "@/store/userSlice";
import { ImageWithLoader, SvgIcon } from "@/utility-components";

interface UnlockOwnerDetailsProps {
  onClose: () => void;
  propertyID: string;
}

type Step = "confirm" | "unlocked" | "error";

type ApiError = {
  status: string;
  originalStatus?: number;
  data?: string;
  error?: string;
};

function getErrorMeta(err: unknown): {
  title: string;
  message: string;
  code?: string;
} {
  const apiError = err as ApiError;
  // Handle parsing error from status 400 (insufficient connects)
  if (apiError.status === "PARSING_ERROR" && apiError.originalStatus === 400) {
    return {
      title: "Not enough Connects",
      message:
        // apiError.data ||
        "You don't have enough Connects to unlock owner details.",
      code: "INSUFFICIENT_CONNECTS",
    };
  }
  const message =
    apiError?.data ||
    (typeof apiError?.error === "string" ? apiError.error : undefined) ||
    "Unable to unlock. Please try again.";
  return { title: "Something went wrong", message, code: undefined };
}

export const UnlockOwnerDetails = ({
  onClose,
  propertyID,
}: UnlockOwnerDetailsProps) => {
  const { isMobile } = useDeviceContext();
  const dispatch = useDispatch();

  const [step, setStep] = useState<Step>("confirm");
  const [errorMeta, setErrorMeta] = useState<{
    title: string;
    message: string;
    code?: string;
  } | null>(null);

  const [contactOwner, { data: apiResponse, isLoading, reset }] =
    useContactOwnerMutation();

  const handleConfirmAndUnlock = async () => {
    setErrorMeta(null);
    try {
      const res = await contactOwner({ propertyID }).unwrap();
      if (res) {
        dispatch(setConnectBal(res.connectBal));
      }
      setStep("unlocked");
    } catch (err: unknown) {
      console.log(err);
      const meta = getErrorMeta(err);
      setErrorMeta(meta);
      setStep("error");
    }
  };

  const renderConfirm = () => (
    <div className="px-6 space-y-8 max-md:pt-36">
      <div className="space-y-1 mt-5">
        <h1 className="text-2xl max-md:hidden">Unlock Owner Details</h1>
        <h1 className="text-2xl md:hidden">
          <b>No spam</b>, just updates.
        </h1>
        <p className="text-lg text-gray-700">
          You&apos;re one step away from connecting with the property owner.
          Using <span className="font-semibold">1 Connect</span> will show their
          contact info.
        </p>
      </div>

      <div className="flex flex-col gap-6 md:gap-4">
        <div className="bg-red-50 p-2 rounded-lg flex items-center gap-2">
          <SvgIcon iconSize="medium" name="coin-egg" size={40} />
          <p className="text-gray-800 max-md:hidden">
            <span className="font-bold">1 Connect</span> will be deducted now.
          </p>
          <p className="text-gray-800 md:hidden">
            <span className="font-bold">1 Connect</span> will be deducted from
            your account to access the owner&apos;s details.
          </p>
        </div>

        <div className="space-y-2">
          <button
            data-testid="confirm-unlock"
            className="w-full text-white py-3 px-4 rounded-lg bg-red-500 hover:bg-red-600 disabled:opacity-60 max-md:text-xl"
            onClick={handleConfirmAndUnlock}
            disabled={isLoading}
          >
            {isLoading ? "Unlocking..." : "Confirm & Unlock"}
          </button>
          <button
            className="w-full text-gray-700 py-3 px-4 hover:bg-gray-50 rounded-lg max-md:hidden"
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
    <>
      {/* Desktop */}
      <section className="px-8 space-y-5 max-md:hidden">
        <div className="space-y-1">
          <h1 className="text-lg lg:text-xl 2xl:text-2xl">
            Owner Details Unlocked Successfully!
          </h1>
          <p className="text-gray-700">Get in touch directly with the owner.</p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="flex gap-1 text-gray-700 lg:text-lg">
            Owner&apos;s Name{" "}
            <span className="text-black font-medium">
              {apiResponse?.owner.name ?? "Owner"}
            </span>
          </p>

          <div className="grid grid-cols-5 border rounded-xl p-4 gap-2 lg:gap-4">
            {apiResponse?.owner.phoneNo && (
              <a
                className="flex flex-col col-span-2 items-start gap-3 xl:border-r md:pr-2"
                href={`tel:${apiResponse.owner.phoneNo}`}
              >
                <Phone size={20} className="text-red-500 mt-1" />
                <h3 className="flex flex-col">
                  <span className="text-gray-700 text-sm">Phone Number</span>
                  <span>{apiResponse.owner.phoneNo}</span>
                </h3>
              </a>
            )}

            {apiResponse?.owner.emailID && (
              <a
                className="flex flex-col items-start gap-3 md:pl-2"
                href={`mailto:${apiResponse.owner.emailID}`}
              >
                <Mail size={20} className="text-red-500 mt-1" />
                <h3 className="flex flex-col">
                  <span className="text-gray-700 text-sm">Email Address</span>
                  <span>{apiResponse.owner.emailID}</span>
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
            {apiResponse?.owner.phoneNo && (
              <div className="flex w-full mt-4 gap-2">
                <Link
                  href={`tel:${apiResponse.owner.phoneNo}`}
                  className="flex items-center justify-center flex-1 gap-2 border border-red-500 rounded-lg py-2 hover:bg-red-100"
                >
                  <PhoneCall size={20} className="text-red-500" />
                  <span>Call Owner</span>
                </Link>
                <Link
                  className="flex items-center justify-center flex-1 gap-1 border border-green-500 rounded-lg py-2 hover:bg-green-100"
                  href={`https://wa.me/${apiResponse.owner.phoneNo}?text=${encodeURIComponent("Hey, I got your number regarding your property from HouseClay.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SvgIcon
                    iconSize="small"
                    name="whatsapp"
                    size={32}
                    className="text-green-500"
                  />
                  WhatsApp
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile */}
      <section className="md:hidden px-6 pt-32">
        <div className="space-y-2 mb-4">
          <h1 className="text-2xl">
            <b>Owner Details</b> Unlocked Successfully!
          </h1>
          <p className="text-gray-700">
            Here are the details of the property owner.
          </p>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex border rounded-xl py-2 px-4 gap-2">
            <UserRound size={20} className="text-red-500 mt-1" />
            <h3 className="flex flex-col py-1">
              <span className="text-sm text-gray-700">Owner&apos; Name</span>
              <span className="font-medium">
                {apiResponse?.owner.name ?? "Owner"}
              </span>
            </h3>
          </div>
          {apiResponse?.owner.phoneNo && (
            <a
              className="flex border rounded-xl py-2 px-4 gap-2"
              href={`tel:${apiResponse.owner.phoneNo}`}
            >
              <Phone size={20} className="text-red-500 mt-1" />
              <h3 className="flex flex-col py-1">
                <span className="text-gray-700 text-sm">Phone Number</span>
                <span>{apiResponse.owner.phoneNo}</span>
              </h3>
            </a>
          )}
          {apiResponse?.owner.emailID && (
            <a
              className="flex border rounded-xl py-2 px-4 gap-2"
              href={`mailto:${apiResponse.owner.emailID}`}
            >
              <Mail size={20} className="text-red-500 mt-1" />
              <h3 className="flex flex-col py-1">
                <span className="text-gray-700 text-sm">Email Address</span>
                <span>{apiResponse.owner.emailID}</span>
              </h3>
            </a>
          )}
        </div>

        <div>
          {/* Info Tip */}
          <div className="flex items-center justify-start gap-2 w-full rounded-lg bg-teal-100 p-3">
            <div className="flex items-center justify-center gap-1 px-3 py-1 my-2 rounded-md text-white bg-teal-400">
              <Lightbulb size={14} />
              <span className="text-sm">Tip</span>
            </div>
            <h4 className="text-gray-700 text-sm h-fit">
              Always visit the property before paying advance money.
            </h4>
          </div>

          <div className="flex">
            {apiResponse?.owner.phoneNo && (
              <div className="flex w-full mt-4 gap-2">
                <Link
                  href={`tel:${apiResponse.owner.phoneNo}`}
                  className="flex items-center justify-center flex-1 gap-2 border border-red-500 rounded-lg py-2 hover:bg-red-100"
                >
                  <PhoneCall size={20} className="text-red-500" />
                  <span>Call Owner</span>
                </Link>
                <Link
                  className="flex items-center justify-center flex-1 gap-1 border border-green-500 rounded-lg py-2 hover:bg-green-100"
                  href={`https://wa.me/${apiResponse.owner.phoneNo}?text=${encodeURIComponent("Hey, I got your number regarding your property from HouseClay.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SvgIcon
                    iconSize="small"
                    name="whatsapp"
                    size={32}
                    className="text-green-500"
                  />
                  WhatsApp
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );

  const renderError = () => (
    <div className="px-6 space-y-6">
      <div className="space-y-1 mt-5">
        <h1 className="text-2xl">{errorMeta?.title ?? "Couldn't unlock"}</h1>
        <p className="text-gray-700">
          {errorMeta?.message ?? "Something went wrong!"}
        </p>
      </div>
      <div className="space-y-2">
        <>
          <a
            href="/buy-connects"
            className="block w-full text-center text-white py-3 px-4 rounded-lg bg-red-500 hover:bg-red-600"
          >
            Buy Connects
          </a>
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
      </div>
    </div>
  );

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
          <div className="relative w-2/5 rounded-l-lg h-[440px] lg:h-[460px] 2xl:h-[480px] overflow-hidden">
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
    </>
  );
};
