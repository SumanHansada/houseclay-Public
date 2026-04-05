"use client";

import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

import { PWAInstallHandler } from "@/components/PWAInstallHandler";

import { DeviceContextProvider } from "./DeviceContextProvider";
import { DialogContextProvider } from "./DialogContextProvider";
import QueryProvider from "./QueryProvider";
import ReduxProvider from "./ReduxProvider";
import { SkeletonProvider } from "./SkeletonProvider";
import { StickyNavbarVisibilityProvider } from "./StickyNavbarVisibilityProvider";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  const [toasterPosition, setToasterPosition] = useState<
    "top-right" | "top-center"
  >("top-right");

  useEffect(() => {
    const updatePosition = () => {
      if (window.innerWidth <= 768) {
        setToasterPosition("top-center"); // Mobile
      } else {
        setToasterPosition("top-right"); // Desktop
      }
    };

    updatePosition(); // Set initial
    window.addEventListener("resize", updatePosition);

    return () => window.removeEventListener("resize", updatePosition);
  }, []);

  return (
    <ReduxProvider>
      <QueryProvider>
        <DeviceContextProvider>
          <DialogContextProvider>
            <StickyNavbarVisibilityProvider>
              <SkeletonProvider>
                <PWAInstallHandler />
                {children}
                <Toaster
                  position={toasterPosition}
                  containerClassName="toaster-container"
                />
              </SkeletonProvider>
            </StickyNavbarVisibilityProvider>
          </DialogContextProvider>
        </DeviceContextProvider>
      </QueryProvider>
    </ReduxProvider>
  );
};

export default Providers;
