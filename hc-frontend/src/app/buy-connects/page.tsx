"use client";

import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/base-components";
import NumberField from "@/base-components/NumberField";
import RadioGroup from "@/base-components/RadioGroup";
import {
  CONNECTS_PRICE_BREAKDOWN_DIALOG_ID,
  VERIFY_CONNECTS_DIALOG_ID,
} from "@/common/dialogConstants";
import { PaymentVerificationStatus } from "@/common/enums";
import Carousel3D from "@/components/Carousel3D";
import ConnectsBundleCard from "@/components/ConnectsBundleCard";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/Dialog";
import { VerifyConnectsDialog } from "@/dialogs";
import { ConnectBundleID } from "@/interfaces/ConnectsBundle";
import { MobileFooter } from "@/layout-components";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";
import {
  useBundleInfoQuery,
  useCreateOrderMutation,
  useVerifyPaymentMutation,
} from "@/store/apiSlice";
import { RootState } from "@/store/store";
import { setConnectBal } from "@/store/userSlice";
import { SvgIcon } from "@/utility-components";
import { Tab, TabContent, TabHeader, Tabs } from "@/utility-components/Tabs";

const MINIMUM_CUSTOM_CONNECTS = 1;
const MAXIMUM_CUSTOM_CONNECTS = 50;
const CUSTOM_CONNECT_PRICE = 99;
const BUNDLE_VALIDITY_DAYS = 60;
const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_LIVE_API_KEY ?? "";

const fmt2 = (rupees: number) =>
  rupees.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function BuyConnectsPage() {
  const router = useRouter();
  const [selectedBundle, setSelectedBundle] =
    useState<ConnectBundleID>("CUSTOM_CONNECTS");
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [customConnects, setCustomConnects] = useState(MINIMUM_CUSTOM_CONNECTS);
  const dispatch = useDispatch();
  const [createOrder] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const { isMobile } = useDeviceContext();
  const { isDialogOpen, closeDialog, openDialog, closeAllDialogs } =
    useDialog();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { userDetail } = useSelector((state: RootState) => state.user);
  const [paymentStatus, setPaymentStatus] = useState<PaymentVerificationStatus>(
    PaymentVerificationStatus.VERIFYING,
  );
  const [newConnectBalanceFromAPI, setNewConnectBalanceFromAPI] = useState(0);

  const connectBalance = useSelector(
    (state: RootState) => state.user.userDetail.connectBal,
  );

  const { data: bundleData } = useBundleInfoQuery();

  const displayBundles =
    bundleData?.filter((bundle) => bundle.id !== "CUSTOM_CONNECTS") || [];

  const customBundleInfo = bundleData?.find((b) => b.id === "CUSTOM_CONNECTS");

  // Find the currently selected bundle object from the full API list
  const currentBundle = bundleData?.find(
    (bundle) => bundle.id === selectedBundle,
  );

  // Price calculations
  const customConnectPricePerUnit =
    customBundleInfo?.discountedPrice || CUSTOM_CONNECT_PRICE;
  const customConnectsPrice = customConnects * customConnectPricePerUnit;

  // This basePrice is for display purposes, using the same logic as before
  // (discounted price for bundles, calculated price for custom)
  const price =
    selectedBundle === "CUSTOM_CONNECTS"
      ? customConnectsPrice
      : currentBundle?.discountedPrice || 0;

  // Calculate the total connects to be purchased
  const connectsToBuy =
    selectedBundle === "CUSTOM_CONNECTS"
      ? customConnects
      : currentBundle?.connects || 0;

  const newConnectsBalance = isAuthenticated
    ? connectBalance + connectsToBuy
    : connectsToBuy;

  const bundleOptions = displayBundles.map((bundle) => ({
    value: bundle.id,
    label: bundle.title,
    icon: (
      <ConnectsBundleCard
        bundle={bundle}
        selectedBundle={selectedBundle}
        isMobile={isMobile}
      />
    ),
  }));

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + BUNDLE_VALIDITY_DAYS);

  const handleCloseDialog = () => {
    closeDialog(CONNECTS_PRICE_BREAKDOWN_DIALOG_ID);
  };

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Razorpay = (window as any).Razorpay;

  const handleTabChange = (value: string) => {
    if (value === "bundles") {
      const recommendedBundle = displayBundles.find((b) => b.recommended);
      const defaultBundleId =
        recommendedBundle?.id || displayBundles[0]?.id || "PREMIUM_GOLD_BUNDLE";
      setSelectedBundle(defaultBundleId as ConnectBundleID);
    } else {
      setSelectedBundle("CUSTOM_CONNECTS");
    }
  };

  const onLogin = () => {
    closeAllDialogs();
    openDialog("login-dialog");
  };

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePaymentSuccess = async (response: any) => {
    console.log("Payment success response:", response);
    try {
      openDialog(VERIFY_CONNECTS_DIALOG_ID);
      setPaymentStatus(PaymentVerificationStatus.VERIFYING);
      const result = await verifyPayment({
        paymentId: response.razorpay_payment_id,
        orderId: response.razorpay_order_id,
        signature: response.razorpay_signature,
      }).unwrap();
      console.log("Payment verification response:", result);
      setPaymentStatus(PaymentVerificationStatus.SUCCESS);
      setNewConnectBalanceFromAPI(result.connectBal);
    } catch (e) {
      console.error("Payment verification failed:", e);
      setPaymentStatus(PaymentVerificationStatus.ERROR);
    }
  };

  const handleProceedToPay = async () => {
    if (!canProceedToPay) {
      return;
    }

    if (isDialogOpen(CONNECTS_PRICE_BREAKDOWN_DIALOG_ID)) {
      handleCloseDialog();
    }

    try {
      const response = await createOrder({
        connects: connectsToBuy,
        bundle: selectedBundle,
      }).unwrap();

      const options = {
        key: RAZORPAY_KEY,
        currency: "INR",
        name: "Houseclay",
        description: `Purchase of ${connectsToBuy} Connects`,
        order_id: response.orderId,
        handler: handlePaymentSuccess,
        prefill: {
          name: userDetail?.name || "Houseclay User",
          email: userDetail?.emailID || "",
          contact: userDetail?.phoneNo || "",
        },
      };

      const rzp = new Razorpay(options);
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      rzp.on("payment.failed", function (response: any) {
        console.log("Payment failed:", response);
      });
      rzp.open();
    } catch (error) {
      console.error("Error creating payment order:", error);
    }
  };

  const handleVerifyConnectsDialogClose = () => {
    if (paymentStatus === PaymentVerificationStatus.VERIFYING) {
      // Don't allow closing during verification
      return;
    }
    if (paymentStatus === PaymentVerificationStatus.SUCCESS) {
      dispatch(setConnectBal(newConnectBalanceFromAPI));
    }
    closeDialog("verify-connects-dialog");
    router.push("/manage-account/connects");
  };

  const canProceedToPay =
    agreedToTerms &&
    connectsToBuy >= MINIMUM_CUSTOM_CONNECTS &&
    connectsToBuy <= MAXIMUM_CUSTOM_CONNECTS;

  return (
    <>
      {/* Desktop */}
      <section className="w-full max-md:hidden">
        <div className="flex justify-between items-start xl:px-28 lg:px-14 md:px-14 px-8 py-12 gap-8 md:gap-8 xl:gap-8 2xl:gap-24 relative">
          <div className="relative w-2/3 max-xl:w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-medium text-gray-900">
                  Buy Connects
                </h1>
              </div>
            </div>
            <div className="flex items-center justify-between mb-6">
              <span className="font-medium text-lg">
                Your available Connects
              </span>
              <div className="flex items-center">
                <SvgIcon iconSize="medium" name="coin" size={28} />
                <span className="font-medium text-lg">
                  {connectBalance} Connects
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {/* Bundle Selection */}
              <div className="lg:col-span-2">
                <Tabs
                  defaultActive="custom"
                  className="mb-6"
                  onTabChange={handleTabChange}
                >
                  <TabHeader
                    containerClassName="border-b border-gray-200"
                    tabsClassName="flex"
                  >
                    <Tab
                      label="Buy Custom Connects"
                      value="custom"
                      containerClassName="px-6 py-3 font-medium"
                      activeClassName="text-red-500 border-b-2 border-red-500"
                      inactiveClassName="text-gray-500 hover:text-gray-700"
                    />
                    <Tab
                      label="Buy Connects in Bundles"
                      value="bundles"
                      containerClassName="px-6 py-3 font-medium"
                      activeClassName="text-red-500 border-b-2 border-red-500"
                      inactiveClassName="text-gray-500 hover:text-gray-700"
                    />
                  </TabHeader>

                  <TabContent value="custom">
                    <div className="py-4">
                      {/* Connects Input Section */}
                      <NumberField
                        name="customConnects"
                        label="Enter Connects to buy"
                        value={customConnects}
                        onChange={setCustomConnects}
                        min={MINIMUM_CUSTOM_CONNECTS}
                        max={MAXIMUM_CUSTOM_CONNECTS}
                        required
                        className="mb-3"
                      />

                      {/* Error Message */}
                      {customConnects <= MINIMUM_CUSTOM_CONNECTS && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm">
                            A minimum of{" "}
                            <strong>{MINIMUM_CUSTOM_CONNECTS} Connect</strong>{" "}
                            is required to proceed.
                          </p>
                        </div>
                      )}
                      {customConnects >= MAXIMUM_CUSTOM_CONNECTS && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm">
                            A maximum of{" "}
                            <strong>{MAXIMUM_CUSTOM_CONNECTS} Connects</strong>{" "}
                            can be purchased at a time.
                          </p>
                        </div>
                      )}
                    </div>
                  </TabContent>

                  <TabContent value="bundles">
                    <h2 className="text-2xl mb-6">
                      Select the connects bundle to buy
                    </h2>

                    <RadioGroup
                      name="bundle-selection"
                      options={bundleOptions}
                      value={selectedBundle}
                      onChange={(value) =>
                        setSelectedBundle(value as ConnectBundleID)
                      }
                      columns={3}
                      horizontal={true}
                      withIcons={true}
                      selectedColor="shadow-2xl"
                      radioOptionClassName="rounded-xl relative transition-all"
                      radioGroupClassName="gap-8 md:gap-10 xl:gap-12 !grid-cols-3"
                      radioLabelClassName="block p-0 w-full h-full"
                      radioTextClassName="hidden"
                      containerClassName="my-4 container mx-auto"
                    />
                  </TabContent>
                </Tabs>
              </div>

              {/* Purchase Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg sticky">
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Connects to buy</span>
                      <div className="flex items-center gap-1">
                        <SvgIcon iconSize="medium" name="coin" size={24} />
                        <span className="font-medium">
                          {connectsToBuy} Connects
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        These new connects will expire on
                      </span>
                      <span className="font-medium">
                        {expiryDate.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    {isAuthenticated ? (
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Your new Connects balance will be
                        </span>
                        <div className="flex items-center gap-1">
                          <SvgIcon iconSize="medium" name="coin" size={24} />
                          <span className="font-medium">
                            {newConnectsBalance} Connects
                          </span>
                        </div>
                      </div>
                    ) : null}

                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>
                          Total Amount{" "}
                          <span className="text-sm text-gray-500">
                            (Inclusive of all taxes)
                          </span>
                        </span>
                        <span>₹{fmt2(price)}</span>
                      </div>
                    </div>
                  </div>

                  <div className=" mb-6">
                    <p className="text-sm text-gray-600 mb-2">
                      This bundle of Connects will expire in 60 Days from today.
                    </p>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-4">
                      You&apos;re authorizing Houseclay to charge your account.
                    </p>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="h-5 w-5 accent-red-500 cursor-pointer"
                      />
                      <span className="text-sm text-gray-600">
                        I agree to{" "}
                        <Link
                          href="/terms-and-conditions"
                          className="text-red-500 hover:underline"
                        >
                          Terms & Conditions
                        </Link>
                      </span>
                    </label>
                  </div>

                  <hr className="mb-6" />

                  <div className="flex justify-between gap-3">
                    <button
                      onClick={() => router.back()}
                      className="flex px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={isAuthenticated ? handleProceedToPay : onLogin}
                      className={`flex px-8 py-3 rounded-xl ${
                        canProceedToPay
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                      disabled={!canProceedToPay}
                    >
                      Proceed to Pay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="sticky top-8 w-1/3 max-xl:hidden">
            <Image
              src="/images/buy-connects-graphic.svg"
              alt="Buy Connects Graphic"
              height={100}
              width={100}
              className="w-full h-full max-xl:hidden object-scale-down"
              priority
            />
          </div>
        </div>
      </section>

      {/* Mobile */}
      <section className="w-full md:hidden">
        {/* Mobile Content */}
        <div className="px-6 pt-4 pb-16 ">
          <div className="flex justify-between items-start w-full py-4 rounded-lg mb-4">
            {/* Available Connects */}
            <div className="flex items-center w-full justify-between">
              <span className="font-medium text-xl">Your Connects</span>
              <div className="flex items-center">
                <SvgIcon iconSize="medium" name="coin" size={28} />
                <span className="text-gray-700 text-xl font-medium">
                  {connectBalance} Connects
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultActive="custom" onTabChange={handleTabChange}>
            <TabHeader tabsClassName="justify-between border rounded-xl p-2 w-full flex gap-2">
              <Tab
                label="Custom"
                value="custom"
                containerClassName="w-1/2 p-2 md:p-3 text-base font-medium max-md:font-normal rounded-lg border transition-colors duration-300"
                activeClassName="text-red-600 border-red-500"
                inactiveClassName="text-gray-700 border-transparent"
              />
              <Tab
                label="Bundles"
                value="bundles"
                containerClassName="w-1/2 p-2 md:p-3 text-base font-medium max-md:font-normal rounded-lg border transition-colors duration-300"
                activeClassName="text-red-600 border-red-500"
                inactiveClassName="text-gray-700 border-transparent"
              />
            </TabHeader>

            <TabContent value="custom">
              {/* Connects Input Section */}
              <div className="py-4">
                <NumberField
                  name="customConnects"
                  label="Enter Connects to buy"
                  value={customConnects}
                  onChange={setCustomConnects}
                  min={MINIMUM_CUSTOM_CONNECTS}
                  max={MAXIMUM_CUSTOM_CONNECTS}
                  required
                  className="mb-3 w-full"
                />

                {/* Error Message */}
                {customConnects <= MINIMUM_CUSTOM_CONNECTS && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm">
                      A minimum of{" "}
                      <strong>{MINIMUM_CUSTOM_CONNECTS} Connect</strong> is
                      required to proceed.
                    </p>
                  </div>
                )}
                {customConnects >= MAXIMUM_CUSTOM_CONNECTS && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm">
                      A maximum of{" "}
                      <strong>{MAXIMUM_CUSTOM_CONNECTS} Connects</strong> can be
                      purchased at a time.
                    </p>
                  </div>
                )}
              </div>
            </TabContent>
            <TabContent value="bundles" className="-mx-6">
              <Carousel3D
                items={displayBundles.map((bundle) => (
                  <ConnectsBundleCard
                    bundle={bundle}
                    key={bundle.id}
                    selectedBundle={selectedBundle}
                  />
                ))}
                onChange={(currentIndex) => {
                  const currentBundle = displayBundles[currentIndex];
                  setSelectedBundle(currentBundle.id as ConnectBundleID);
                }}
                width={275}
                height={450}
                gap={5}
                initialIndex={1}
              />
            </TabContent>
          </Tabs>

          {/* Mobile Purchase Summary */}
          <div className="mt-2 mb-6">
            <p className="text-xs text-gray-600 mb-2">
              This bundle of Connects will expire in 60 Days from today.
            </p>
          </div>

          <div className="mb-6">
            <p className="text-xs text-gray-600 mb-4">
              You&apos;re authorizing Houseclay to charge your account.
            </p>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="h-5 w-5 accent-red-500 cursor-pointer"
              />
              <span className="text-xs text-gray-600">
                I agree to{" "}
                <Link
                  href="/terms-and-conditions"
                  className="text-red-500 hover:underline"
                >
                  Terms & Conditions
                </Link>
              </span>
            </label>
          </div>
        </div>

        <MobileFooter>
          <div className="flex flex-col justify-around items-start w-full">
            <div className="text-gray-600 text-xs flex flex-col font-bold">
              Total Amount
              <span className="font-light">(Inclusive of all taxes)</span>
            </div>
            <div className="text-sm font-bold flex gap-2 items-center">
              ₹{fmt2(price)}
            </div>
          </div>
          <button
            className={`text-center px-6 py-3 border rounded-xl w-full transition duration-200 ${
              canProceedToPay
                ? "bg-red-500 border-red-500 text-white hover:bg-red-600"
                : "bg-gray-300 border-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={() => openDialog(CONNECTS_PRICE_BREAKDOWN_DIALOG_ID)}
            disabled={!canProceedToPay}
          >
            Price Breakdown
          </button>
        </MobileFooter>
      </section>

      {/* Connects Price Dialog */}
      {isDialogOpen(CONNECTS_PRICE_BREAKDOWN_DIALOG_ID) && isMobile && (
        <Dialog
          id={CONNECTS_PRICE_BREAKDOWN_DIALOG_ID}
          type="bottom-sheet"
          onClose={() => {
            closeDialog(CONNECTS_PRICE_BREAKDOWN_DIALOG_ID);
          }}
          entryAnimation="animate-slide-in-bottom"
          exitAnimation="animate-slide-out-bottom"
        >
          <DialogHeader>
            <div className="py-2 px-8 flex flex-col justify-between items-center w-full">
              <h1 className="text-xl mt-1 mb-2 text-black">Price Breakdown</h1>
            </div>
            <Button
              variant="secondary"
              size="custom"
              className="rounded-full p-1"
              onClick={handleCloseDialog}
            >
              <X size={24} />
            </Button>
          </DialogHeader>
          <DialogContent>
            <div className="space-y-4 my-6 px-6 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-xs">Connects to buy</span>
                <div className="flex items-center gap-1">
                  <SvgIcon iconSize="medium" name="coin" size={24} />
                  <span className="font-medium">{connectsToBuy} Connects</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-xs">Expires on</span>
                <span className="font-medium">
                  {expiryDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              {isAuthenticated ? (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-xs">
                    New Connects balance
                  </span>
                  <div className="flex items-center gap-1">
                    <SvgIcon iconSize="medium" name="coin" size={24} />
                    <span className="font-medium">
                      {newConnectsBalance} Connects
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          </DialogContent>
          <DialogFooter>
            <div className="flex flex-col justify-around items-start w-full">
              <div className="text-gray-600 text-xs flex flex-col font-bold">
                Total Amount
                <span className="font-light">(Inclusive of all taxes)</span>
              </div>
              <div className="text-sm font-bold flex gap-2 items-center">
                ₹{fmt2(price)}
              </div>
            </div>
            <button
              className={`text-center px-6 py-3 border rounded-xl w-full transition duration-200 ${
                agreedToTerms && connectsToBuy >= MINIMUM_CUSTOM_CONNECTS
                  ? "bg-red-500 border-red-500 text-white hover:bg-red-600"
                  : "bg-gray-300 border-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              onClick={isAuthenticated ? handleProceedToPay : onLogin}
              disabled={
                !agreedToTerms || connectsToBuy < MINIMUM_CUSTOM_CONNECTS
              }
            >
              Proceed to Pay
            </button>
          </DialogFooter>
        </Dialog>
      )}

      {/* Verify Connects Dialog */}
      {isDialogOpen(VERIFY_CONNECTS_DIALOG_ID) && (
        <VerifyConnectsDialog
          id={VERIFY_CONNECTS_DIALOG_ID}
          status={paymentStatus}
          connects={connectsToBuy}
          onClose={handleVerifyConnectsDialogClose}
        />
      )}
    </>
  );
}
