"use client";
import { Check, ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import NumberField from "@/base-components/NumberField";
import {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
} from "@/store/apiSlice";
import { Tab, TabContent, TabHeader, Tabs } from "@/utility-components/Tabs";

// Bundle data
const bundles = [
  {
    id: "basic",
    title: "Basic Blue Bundle",
    connects: 10,
    originalPrice: 990,
    discountedPrice: 891,
    discount: "10% Off",
    validity: "60 Days",
    color: "from-blue-400 to-blue-600",
    selected: false,
  },
  {
    id: "premium",
    title: "Premium Gold Bundle",
    connects: 30,
    originalPrice: 2970,
    discountedPrice: 2524,
    discount: "15% Off",
    validity: "60 Days",
    color: "from-yellow-400 to-yellow-600",
    selected: true,
    recommended: true,
  },
  {
    id: "elite",
    title: "Elite Purple Bundle",
    connects: 50,
    originalPrice: 4950,
    discountedPrice: 3960,
    discount: "20% Off",
    validity: "60 Days",
    color: "from-purple-400 to-purple-600",
    selected: false,
  },
];

export default function BuyConnectsPage() {
  const router = useRouter();
  const [selectedBundle, setSelectedBundle] = useState("premium");
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [customConnects, setCustomConnects] = useState(5);
  const [createOrder] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  const currentBundle = bundles.find((bundle) => bundle.id === selectedBundle);
  const gstAmount = currentBundle ? currentBundle.originalPrice * 0.18 : 0;
  const totalAmount = currentBundle
    ? currentBundle.originalPrice + gstAmount
    : 0;
  const newBalance = 8 + (currentBundle?.connects || 0);

  // Calculate expiry date (60 days from today)
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 60);

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Razorpay = (window as any).Razorpay;

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePaymentSuccess = async (response: any) => {
    console.log(response);
    alert(response.razorpay_payment_id);
    alert(response.razorpay_order_id);
    alert(response.razorpay_signature);

    try {
      const userId = 1; // TODO: replace with actual user id from auth
      const result = await verifyPayment({
        paymentId: response.razorpay_payment_id,
        orderId: response.razorpay_order_id,
        signature: response.razorpay_signature,
        userId,
        amount: totalAmount * 100,
        connects: currentBundle?.connects || 0,
      });
      console.log("Payment verification response:", result);
    } catch (e) {
      console.error("Payment verification failed:", e);
    }
  };

  const handleProceedToPay = async () => {
    if (!agreedToTerms) return;

    try {
      // TODO: Replace with actual userId from auth context
      const userId = 1; // Placeholder - should come from auth state
      const response = await createOrder({
        userId,
        amount: totalAmount * 100,
      });

      console.log("Payment order created successfully:", response);
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const options = Object.assign({}, response.data) as any;
      options.key = "REDACTED_RAZORPAY_KEY_ID";
      options.handler = handlePaymentSuccess;
      options.callback_url = `${window.location.origin}/payment-success`;
      const rzp = new Razorpay(options);
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      rzp.on("payment.failed", function (response: any) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
      });
      rzp.open();
    } catch (error) {
      console.error("Error creating payment order:", error);
    }
  };

  return (
    <>
      {/* Desktop */}
      <section className="w-full max-md:hidden">
        <div className="flex justify-between items-start xl:px-28 lg:px-14 md:px-14 px-8 py-12 gap-16">
          <div className="left-0 flex-1">
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
                <Image
                  src="/icons/coin.svg"
                  alt="coin"
                  width={20}
                  height={20}
                />
                <span className="font-medium">8 Connects</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {/* Left Column - Bundle Selection */}
              <div className="lg:col-span-2">
                <Tabs defaultActive="bundles" className="mb-8">
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {bundles.map((bundle) => (
                        <div
                          key={bundle.id}
                          className={`relative cursor-pointer h-72 rounded-xl p-6 border-2  transition-all bg-gradient-to-r ${bundle.color}  ${
                            selectedBundle === bundle.id
                              ? "border-red-500 shadow-lg border-2"
                              : "border-white hover:border-gray-300 "
                          }`}
                          onClick={() => setSelectedBundle(bundle.id)}
                        >
                          {bundle.recommended && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                Recommended
                              </span>
                            </div>
                          )}

                          {selectedBundle === bundle.id && (
                            <div className="absolute -top-2 -right-2">
                              <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                                <Check size={16} />
                              </div>
                            </div>
                          )}

                          <h3 className="font-semibold text-2xl mb-4 text-white">
                            {bundle.title}
                          </h3>
                          <div className="flex items-center gap-1 rounded-full mb-4">
                            <Image
                              src="/icons/coin.svg"
                              alt="coin"
                              width={20}
                              height={20}
                            />
                            <span className="font-medium text-white text-sm">
                              {bundle.connects} Connects
                            </span>
                          </div>

                          <div className="mb-2">
                            <span className="line-through text-white">
                              ₹{bundle.originalPrice.toLocaleString()}/-
                            </span>
                          </div>
                          <div>
                            <span className="text-2xl font-bold text-white mb-4">
                              ₹{bundle.discountedPrice.toLocaleString()}/-
                            </span>
                          </div>

                          <div className="flex items-center justify-between mb-8 bg-transparent p-1 text-white rounded-full">
                            <span className="text-white font-medium text-xs">
                              {bundle.discount}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-white text-xs">
                              Validity:
                            </span>
                            <span className="text-white text-base">
                              {bundle.validity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabContent>

                  <TabContent value="custom">
                    <div className="mt-4">
                      {/* Connects Input Section */}
                      <div className="mb-6">
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
                            <p className="text-red-600 text-sm text-center">
                              A minimum of <strong>5 Connects</strong> is
                              required to proceed.
                            </p>
                          </div>
                        )}
                      </div>
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
                        ₹{currentBundle?.originalPrice.toLocaleString()} + 18%
                        GST
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Your new Connects balance will be
                      </span>
                      <div className="flex items-center gap-1">
                        <Image
                          src="/icons/coin.svg"
                          alt="coin"
                          width={20}
                          height={20}
                        />
                        <span className="font-medium">
                          {newBalance} Connect
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

                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-600 mb-2">
                      This bundle of Connects will expire in 60 Days from today.
                      Unused Connects rollover to the next month.
                    </p>
                    <button className="text-red-500 text-sm hover:underline">
                      Learn more
                    </button>
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
                        className="rounded border-gray-300 text-red-500 focus:ring-red-500"
                      />
                      <span className="text-sm">
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
                      disabled={!agreedToTerms}
                      className={`flex px-8 py-3 rounded-xl font-medium ${
                        agreedToTerms
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Proceed to Pay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="right-0 w-[33.33%] top-0">
            <Image
              src="/images/buy-connects-graphic.svg"
              alt="Buy Connects Graphic"
              height={100}
              width={100}
              className="w-full h-full max-xl:hidden"
              priority
            />
          </div>
        </div>
      </section>

      {/* Mobile */}
      <section className="md:hidden min-h-screen bg-gray-50">
        <header className="fixed top-0 inset-x-0 z-50 h-[55px] border-b border-gray-200 bg-white">
          <div className="grid grid-cols-3 items-center h-full px-4">
            <button
              aria-label="Go back"
              className="justify-self-start rounded-full size-10 border flex items-center justify-center"
              onClick={() => router.back()}
            >
              <ChevronLeft size={25} />
            </button>

            <h1 className="col-start-2 text-center font-medium truncate">
              Buy Connects
            </h1>
          </div>
        </header>

        <div className="px-4 pt-16 pb-20">
          {/* Available Connects */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-gray-600">Your available Connects</span>
            <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
              <Image src="/icons/coin.svg" alt="coin" width={20} height={20} />
              <span className="font-medium">8 Connect</span>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultActive="bundles" className="mb-6">
            <TabHeader
              containerClassName="border-b border-gray-200"
              tabsClassName="flex w-full"
            >
              <Tab
                label="Bundles"
                value="bundles"
                containerClassName="flex-1 px-4 py-3 text-center font-medium"
                activeClassName="text-red-500 border-b-2 border-red-500"
                inactiveClassName="text-gray-500"
              />
              <Tab
                label="Custom"
                value="custom"
                containerClassName="flex-1 px-4 py-3 text-center font-medium"
                activeClassName="text-red-500 border-b-2 border-red-500"
                inactiveClassName="text-gray-500"
              />
            </TabHeader>

            <TabContent value="bundles">
              <h2 className="text-xl mb-4">
                Select the connects bundle to buy
              </h2>

              <div className="space-y-4 mb-6">
                {bundles.map((bundle) => (
                  <div
                    key={bundle.id}
                    className={`relative cursor-pointer rounded-lg p-4 border-2 ${
                      selectedBundle === bundle.id
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200"
                    }`}
                    onClick={() => setSelectedBundle(bundle.id)}
                  >
                    {bundle.recommended && (
                      <div className="absolute -top-2 left-4">
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Recommended
                        </span>
                      </div>
                    )}

                    {selectedBundle === bundle.id && (
                      <div className="absolute top-2 right-2">
                        <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                          <Check size={12} />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-r ${bundle.color} flex items-center justify-center`}
                      >
                        <span className="text-white font-bold text-lg">
                          {bundle.connects}
                        </span>
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold">{bundle.title}</h3>
                        <p className="text-gray-600 text-sm">
                          {bundle.connects} Connects
                        </p>

                        <div className="mt-2">
                          <span className="line-through text-gray-400 text-sm">
                            ₹{bundle.originalPrice.toLocaleString()}/-
                          </span>
                          <span className="text-lg font-bold text-gray-900 ml-2">
                            ₹{bundle.discountedPrice.toLocaleString()}/-
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <span className="text-green-600 font-medium text-sm">
                            {bundle.discount}
                          </span>
                          <span className="text-gray-600 text-sm">
                            {bundle.validity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabContent>

            <TabContent value="custom">
              <div className="text-center py-12">
                <p className="text-gray-600">
                  Custom connects feature coming soon...
                </p>
              </div>
            </TabContent>
          </Tabs>

          {/* Mobile Purchase Summary */}
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Purchase Summary</h3>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Account charge</span>
                <span className="font-medium">
                  ₹{currentBundle?.originalPrice.toLocaleString()} + 18% GST
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">New balance</span>
                <div className="flex items-center gap-1">
                  <Image
                    src="/icons/coin.svg"
                    alt="coin"
                    width={16}
                    height={16}
                  />
                  <span className="font-medium">{newBalance} Connect</span>
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Expires on</span>
                <span className="font-medium text-sm">
                  {expiryDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between font-semibold">
                  <span>Total Amount</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-xs text-gray-600">
                This bundle expires in 60 Days. Unused Connects rollover.
              </p>
            </div>

            <div className="mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="rounded border-gray-300 text-red-500 focus:ring-red-500"
                />
                <span className="text-sm">
                  I agree to{" "}
                  <button className="text-red-500 hover:underline">
                    Terms & Conditions
                  </button>
                </span>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => router.back()}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleProceedToPay}
                disabled={!agreedToTerms}
                className={`flex-1 px-4 py-3 rounded-lg font-medium ${
                  agreedToTerms
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Proceed to Pay
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
