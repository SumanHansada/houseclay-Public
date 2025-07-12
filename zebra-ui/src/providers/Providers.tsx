"use client";

import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

import { DeviceContextProvider } from "./DeviceContextProvider";
import { DialogContextProvider } from "./DialogContextProvider";
import QueryProvider from "./QueryProvider";
import ReduxProvider from "./ReduxProvider";
import { InitializeAuthToken } from "./InitializeAuthToken";

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
      <InitializeAuthToken>
        <QueryProvider>
          <DeviceContextProvider>
            <DialogContextProvider>
              <AnimatePresence mode="wait">{children}</AnimatePresence>
              <Toaster
                position={toasterPosition}
                containerClassName="toaster-container"
              />
            </DialogContextProvider>
          </DeviceContextProvider>
        </QueryProvider>
      </InitializeAuthToken>
    </ReduxProvider>
  );
};

export default Providers;
