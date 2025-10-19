"use client";
import { ChevronLeft, Info, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/base-components";
import NumberField from "@/base-components/NumberField";
import RadioGroup from "@/base-components/RadioGroup";
import { PaymentVerificationStatus } from "@/common/enums";
import Carousel3D from "@/components/Carousel3D";
import ConnectsBundleCard from "@/components/ConnectsBundleCard";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/Dialog";
import ConnectsBundleData from "@/data/ConnectsBundleData.json";
import VerifyConnectsDialog from "@/dialogs/verify-connects-dialog";
import { MobileFooter, MobileHeader } from "@/layout-components";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";
import {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
} from "@/store/apiSlice";
import {
  setHideFooter,
  setHideHeader,
  setHideStickyNavBar,
} from "@/store/appSlice";
import { RootState } from "@/store/store";
import { setConnectBal } from "@/store/userSlice";
import { ImageWithLoader } from "@/utility-components";
import { Tab, TabContent, TabHeader, Tabs } from "@/utility-components/Tabs";

export default function BuyConnectsPage() {
  const router = useRouter();
  const [selectedBundle, setSelectedBundle] = useState("premium");
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [customConnects, setCustomConnects] = useState(5);
  const dispatch = useDispatch();
  const [createOrder] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const { isMobile } = useDeviceContext();
  const { isDialogOpen, closeDialog, openDialog } = useDialog();
  const [paymentStatus, setPaymentStatus] = useState<PaymentVerificationStatus>(
    PaymentVerificationStatus.VERIFYING,
  );
  const [newConnectBalanceFromAPI, setNewConnectBalanceFromAPI] = useState(0);

  const connectBalance = useSelector(
    (state: RootState) => state.user.userDetail.connectBal,
  );
  const currentBundle = ConnectsBundleData.bundles.find(
    (bundle) => bundle.id === selectedBundle,
  );
  const customConnectsPrice = customConnects * 99;
  const gstAmount = currentBundle
    ? currentBundle.originalPrice * 0.18
    : customConnectsPrice * 0.18;
  const totalAmount = currentBundle
    ? currentBundle.originalPrice + gstAmount
    : customConnectsPrice + gstAmount;
  const connectsToBuy = currentBundle ? currentBundle.connects : customConnects;
  const newConnectsBalance = connectBalance + connectsToBuy;

  const bundleOptions = ConnectsBundleData.bundles.map((bundle) => ({
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
  expiryDate.setDate(expiryDate.getDate() + 60);

  const handleCloseDialog = () => {
    closeDialog("connects-price-breakdown-dialog");
  };

  useEffect(() => {
    if (isMobile) {
      dispatch(setHideHeader(true));
      dispatch(setHideFooter(true));
      dispatch(setHideStickyNavBar(true));
    } else {
      dispatch(setHideHeader(false));
      dispatch(setHideFooter(false));
      dispatch(setHideStickyNavBar(false));
    }
  }, [dispatch, isMobile]);

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Razorpay = (window as any).Razorpay;

  const handleTabChange = (value: string) => {
    if (value === "bundles") {
      setSelectedBundle("premium");
    } else {
      setSelectedBundle(value);
    }
  };

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePaymentSuccess = async (response: any) => {
    console.log("Payment success response:", response);
    try {
      openDialog("verify-connects-dialog");
      setPaymentStatus(PaymentVerificationStatus.VERIFYING);
      const result = await verifyPayment({
        paymentId: response.razorpay_payment_id,
        orderId: response.razorpay_order_id,
        signature: response.razorpay_signature,
        amount: totalAmount * 100,
        connects: currentBundle?.connects || 0,
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
    if (!agreedToTerms) return;

    if (isDialogOpen("connects-price-breakdown-dialog")) {
      handleCloseDialog();
    }

    try {
      const response = await createOrder({
        amount: totalAmount * 100,
      });

      console.log("Payment order created successfully:", response);
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const options = Object.assign({}, response.data) as any;
      options.key = "REDACTED_RAZORPAY_KEY_ID";
      options.handler = handlePaymentSuccess;
      // options.callback_url = `${window.location.origin}/payment-success`;
      options.order_id = options.id;
      const rzp = new Razorpay(options);
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      rzp.on("payment.failed", function (response: any) {
        console.log(response);
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
            <div className="flex items-center gap-2 justify-between mb-6">
              <span className="font-medium">Your available Connects</span>
              <div className="flex items-center gap-1 px-3 py-1 rounded-full">
                <ImageWithLoader
                  src="/icons/coin.svg"
                  alt="coin"
                  width={25}
                  height={25}
                />
                <span className="font-medium">{connectBalance} Connects</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {/* Left Column - Bundle Selection */}
              <div className="lg:col-span-2">
                <Tabs
                  defaultActive="bundles"
                  className="mb-8"
                  onTabChange={handleTabChange}
                >
                  <TabHeader
                    containerClassName="border-b border-gray-200"
                    tabsClassName="flex"
                  >
                    <Tab
                      label="Buy Connects in Bundles"
                      value="bundles"
                      containerClassName="px-6 py-3 font-medium"
                      activeClassName="text-red-500 border-b-2 border-red-500"
                      inactiveClassName="text-gray-500 hover:text-gray-700"
                    />
                    <Tab
                      label="Buy Custom Connects"
                      value="custom"
                      containerClassName="px-6 py-3 font-medium"
                      activeClassName="text-red-500 border-b-2 border-red-500"
                      inactiveClassName="text-gray-500 hover:text-gray-700"
                    />
                  </TabHeader>

                  <TabContent value="bundles">
                    <h2 className="text-2xl mb-6">
                      Select the connects bundle to buy
                    </h2>

                    <RadioGroup
                      name="bundle-selection"
                      options={bundleOptions}
                      value={selectedBundle}
                      onChange={(value) => setSelectedBundle(value as string)}
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

                  <TabContent value="custom">
                    <div className="py-4">
                      {/* Connects Input Section */}
                      <NumberField
                        name="customConnects"
                        label="Enter Connects to buy"
                        value={customConnects}
                        onChange={setCustomConnects}
                        min={0}
                        required
                        className="mb-3"
                      />

                      {/* Error Message */}
                      {customConnects < 5 && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm">
                            A minimum of <strong>5 Connects</strong> is required
                            to proceed.
                          </p>
                        </div>
                      )}
                    </div>
                  </TabContent>
                </Tabs>
              </div>

              {/* Right Column - Purchase Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg sticky">
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Your account will be charged
                      </span>
                      <span className="font-medium">
                        ₹
                        {currentBundle?.originalPrice.toLocaleString() ||
                          customConnectsPrice.toLocaleString()}{" "}
                        + 18% GST
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Your new Connects balance will be
                      </span>
                      <div className="flex items-center gap-1">
                        <ImageWithLoader
                          src="/icons/coin.svg"
                          alt="coin"
                          width={24}
                          height={24}
                        />
                        <span className="font-medium">
                          {newConnectsBalance} Connects
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        These Connects will expire on
                      </span>
                      <span className="font-medium">
                        {expiryDate.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total Amount</span>
                        <span>₹{totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className=" mb-6">
                    <p className="text-sm text-gray-600 mb-2">
                      This bundle of Connects will expire in 60 Days from today.
                      Unused Connects rollover to the next month.
                    </p>
                    <a
                      href="#"
                      className="text-red-500 text-sm hover:underline"
                    >
                      Learn more
                    </a>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-4">
                      You&apos;re authorizing HouseClay to charge your account.
                    </p>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="h-5 w-5 accent-red-500"
                      />
                      <span className="text-sm text-gray-600">
                        I agree to{" "}
                        <button className="text-red-500 hover:underline">
                          Terms & Conditions
                        </button>
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
                      onClick={handleProceedToPay}
                      className={`flex px-8 py-3 rounded-xl ${
                        agreedToTerms && connectsToBuy >= 5
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                      disabled={!agreedToTerms && connectsToBuy < 5}
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
        {/* Mobile Header */}
        <MobileHeader>
          <MobileHeader.LeftAction>
            <Button
              variant="secondary"
              size="custom"
              className="rounded-full p-1"
              onClick={() => router.back()}
            >
              <ChevronLeft size={24} />
            </Button>
          </MobileHeader.LeftAction>
          <MobileHeader.Title>Buy Connects</MobileHeader.Title>
        </MobileHeader>
        {/* Mobile Content */}
        <div className="px-6 pt-4 pb-16 ">
          <div className="flex justify-between items-start w-full py-4 rounded-lg mb-4">
            {/* Available Connects */}
            <div className="flex gap-2 items-center w-2/3 justify-between">
              <span className="font-medium text-xl">Your Connects</span>
              <div className="text-lg flex items-center">
                <ImageWithLoader
                  src="/icons/coin.svg"
                  alt="coin icon"
                  width={32}
                  height={32}
                />
                <span className="text-gray-700 text-2xl font-medium">
                  {connectBalance}
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultActive="bundles" onTabChange={handleTabChange}>
            <TabHeader tabsClassName="justify-between border rounded-xl p-2 w-full flex gap-2">
              <Tab
                label="Bundles"
                value="bundles"
                containerClassName="w-1/2 p-2 md:p-3 text-base font-medium max-md:font-normal rounded-lg border transition-colors duration-300"
                activeClassName="text-red-600 border-red-500"
                inactiveClassName="text-gray-700 border-transparent"
              />
              <Tab
                label="Custom"
                value="custom"
                containerClassName="w-1/2 p-2 md:p-3 text-base font-medium max-md:font-normal rounded-lg border transition-colors duration-300"
                activeClassName="text-red-600 border-red-500"
                inactiveClassName="text-gray-700 border-transparent"
              />
            </TabHeader>

            <TabContent value="bundles" className="-mx-6">
              <Carousel3D
                items={ConnectsBundleData.bundles.map((bundle) => (
                  <ConnectsBundleCard
                    bundle={bundle}
                    key={bundle.id}
                    selectedBundle={selectedBundle}
                  />
                ))}
                onChange={(currentIndex) => {
                  const currentBundle =
                    ConnectsBundleData.bundles[currentIndex];
                  setSelectedBundle(currentBundle.id);
                }}
                width={275}
                height={450}
                gap={5}
                initialIndex={1}
              />
            </TabContent>

            <TabContent value="custom">
              {/* Connects Input Section */}
              <div className="py-4">
                <NumberField
                  name="customConnects"
                  label="Enter Connects to buy"
                  value={customConnects}
                  onChange={setCustomConnects}
                  min={0}
                  required
                  className="mb-3 w-full"
                />

                {/* Error Message */}
                {customConnects < 5 && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm">
                      A minimum of <strong>5 Connects</strong> is required to
                      proceed.
                    </p>
                  </div>
                )}
              </div>
            </TabContent>
          </Tabs>

          {/* Mobile Purchase Summary */}
          <div className="mt-2 mb-6">
            <p className="text-xs text-gray-600 mb-2">
              This bundle of Connects will expire in 60 Days from today. Unused
              Connects rollover to the next month.{" "}
              <a href="#" className="text-red-500 text-xs hover:underline">
                Learn more
              </a>
            </p>
          </div>

          <div className="mb-6">
            <p className="text-xs text-gray-600 mb-4">
              You&apos;re authorizing HouseClay to charge your account.
            </p>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="h-5 w-5 accent-red-500"
              />
              <span className="text-xs text-gray-600">
                I agree to{" "}
                <button className="text-red-500 hover:underline">
                  Terms & Conditions
                </button>
              </span>
            </label>
          </div>
        </div>
        {/* Mobile Footer */}
        <MobileFooter>
          <div className="flex flex-col justify-around items-start w-full">
            <div className="text-gray-600 text-xs">Total Amount</div>
            <div className="text-sm font-bold flex gap-2 items-center">
              {totalAmount.toFixed(2)} <Info size={16} />
            </div>
          </div>
          <button
            className={`text-center px-6 py-3 border rounded-xl w-full transition duration-200 ${
              agreedToTerms && connectsToBuy >= 5
                ? "bg-red-500 border-red-500 text-white hover:bg-red-600"
                : "bg-gray-300 border-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={() => openDialog("connects-price-breakdown-dialog")}
            disabled={!agreedToTerms && connectsToBuy < 5}
          >
            Proceed to Pay
          </button>
        </MobileFooter>
      </section>

      {/* Connects Price Dialog */}
      {isDialogOpen("connects-price-breakdown-dialog") && (
        <Dialog
          id="connects-price-breakdown-dialog"
          type="bottom-sheet"
          onClose={() => {
            closeDialog("connects-price-breakdown-dialog");
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
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Your account will be charged
                </span>
                <span className="font-medium">
                  ₹
                  {currentBundle?.originalPrice.toLocaleString() ||
                    customConnectsPrice.toLocaleString()}{" "}
                  + <span className="text-xs">18% GST</span>
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">
                  Your new Connects balance will be
                </span>
                <div className="flex items-center gap-1">
                  <ImageWithLoader
                    src="/icons/coin.svg"
                    alt="coin"
                    width={24}
                    height={24}
                  />
                  <span className="font-medium">{newConnectsBalance}</span>
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">
                  These Connects will expire on
                </span>
                <span className="font-medium">
                  {expiryDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </DialogContent>
          <DialogFooter>
            <div className="flex flex-col justify-around items-start w-full">
              <div className="text-gray-600 text-xs">Total Amount</div>
              <div className="text-sm font-bold flex gap-2 items-center">
                {totalAmount.toFixed(2)} <Info size={16} />
              </div>
            </div>
            <button
              className={`text-center px-6 py-3 border rounded-xl w-full transition duration-200 ${
                agreedToTerms && connectsToBuy >= 5
                  ? "bg-red-500 border-red-500 text-white hover:bg-red-600"
                  : "bg-gray-300 border-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              onClick={handleProceedToPay}
              disabled={!agreedToTerms && connectsToBuy < 5}
            >
              Proceed to Pay
            </button>
          </DialogFooter>
        </Dialog>
      )}

      {/* Verify Connects Dialog */}
      {isDialogOpen("verify-connects-dialog") && (
        <VerifyConnectsDialog
          id="verify-connects-dialog"
          status={paymentStatus}
          connects={currentBundle ? currentBundle.connects : customConnects}
          onClose={handleVerifyConnectsDialogClose}
        />
      )}
    </>
  );
}
