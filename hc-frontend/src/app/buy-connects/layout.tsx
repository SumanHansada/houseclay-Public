"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useMemo, useState } from "react";

import { Button } from "@/base-components";
import { ConnectBundleID } from "@/interfaces/ConnectsBundle";
import {
  MobileFooter,
  MobileHeader,
  PageTransition,
} from "@/layout-components";
import Footer from "@/layout-components/Footer";
import { useDialog } from "@/providers/DialogContextProvider";
import { useBundleInfoQuery } from "@/store/apiSlice";

const MINIMUM_CUSTOM_CONNECTS = 1;
const MAXIMUM_CUSTOM_CONNECTS = 50;
const CUSTOM_CONNECT_PRICE = 99;

const fmt2 = (rupees: number) =>
  rupees.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// Shared state between page and layout
const buyConnectsState = {
  selectedBundle: "CUSTOM_CONNECTS" as ConnectBundleID,
  customConnects: MINIMUM_CUSTOM_CONNECTS,
  agreedToTerms: true,
  listeners: new Set<() => void>(),
  update(
    selectedBundle: ConnectBundleID,
    customConnects: number,
    agreedToTerms: boolean,
  ) {
    this.selectedBundle = selectedBundle;
    this.customConnects = customConnects;
    this.agreedToTerms = agreedToTerms;
    this.listeners.forEach((listener) => listener());
  },
  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  },
};

export const updateBuyConnectsState = (
  selectedBundle: ConnectBundleID,
  customConnects: number,
  agreedToTerms: boolean,
) => {
  buyConnectsState.update(selectedBundle, customConnects, agreedToTerms);
};

function BuyConnectsMobileFooter() {
  const { openDialog } = useDialog();
  const { data: bundleData } = useBundleInfoQuery();
  const [selectedBundle, setSelectedBundle] = useState<ConnectBundleID>(
    buyConnectsState.selectedBundle,
  );
  const [customConnects, setCustomConnects] = useState(
    buyConnectsState.customConnects,
  );
  const [agreedToTerms, setAgreedToTerms] = useState(
    buyConnectsState.agreedToTerms,
  );

  useEffect(() => {
    const unsubscribe = buyConnectsState.subscribe(() => {
      setSelectedBundle(buyConnectsState.selectedBundle);
      setCustomConnects(buyConnectsState.customConnects);
      setAgreedToTerms(buyConnectsState.agreedToTerms);
    });
    return unsubscribe;
  }, []);

  const customBundleInfo = useMemo(() => {
    return bundleData?.find((b) => b.id === "CUSTOM_CONNECTS");
  }, [bundleData]);

  const currentBundle = bundleData?.find(
    (bundle) => bundle.id === selectedBundle,
  );

  const customConnectPricePerUnit =
    customBundleInfo?.discountedPrice || CUSTOM_CONNECT_PRICE;
  const customConnectsPrice = customConnects * customConnectPricePerUnit;

  const price =
    selectedBundle === "CUSTOM_CONNECTS"
      ? customConnectsPrice
      : currentBundle?.discountedPrice || 0;

  const connectsToBuy =
    selectedBundle === "CUSTOM_CONNECTS"
      ? customConnects
      : currentBundle?.connects || 0;

  const canProceedToPay =
    agreedToTerms &&
    connectsToBuy >= MINIMUM_CUSTOM_CONNECTS &&
    connectsToBuy <= MAXIMUM_CUSTOM_CONNECTS;

  return (
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
        onClick={() => openDialog("connects-price-breakdown-dialog")}
        disabled={!canProceedToPay}
      >
        Price Breakdown
      </button>
    </MobileFooter>
  );
}

export default function BuyConnectsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  return (
    <>
      <MobileHeader>
        <MobileHeader.LeftAction>
          <Button
            variant="secondary"
            size="custom"
            className="rounded-full p-1"
            onClick={handleBackClick}
          >
            <ChevronLeft size={24} />
          </Button>
        </MobileHeader.LeftAction>
        <MobileHeader.Title>Buy Connects</MobileHeader.Title>
      </MobileHeader>

      <PageTransition
        transitionType="slideRight"
        backTransitionType="slideLeft"
      >
        {children}
      </PageTransition>

      <BuyConnectsMobileFooter />

      {/* Desktop Footer */}
      <Footer />
    </>
  );
}
