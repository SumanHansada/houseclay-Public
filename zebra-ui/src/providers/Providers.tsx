"use client";

import { AnimatePresence } from "framer-motion";
import React from "react";

import { DeviceContextProvider } from "./DeviceContextProvider";
import { DialogContextProvider } from "./DialogContextProvider";
import QueryProvider from "./QueryProvider";
import ReduxProvider from "./ReduxProvider";
import { SkeletonProvider } from "./SkeletonProvider";
import ToastProvider from "./ToastProvider";
import { TokenHydrator } from "./TokenHydrator";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <ReduxProvider>
      <TokenHydrator>
        <QueryProvider>
          <DeviceContextProvider>
            <DialogContextProvider>
              <SkeletonProvider>
                <ToastProvider>
                  <AnimatePresence mode="wait">{children}</AnimatePresence>
                </ToastProvider>
              </SkeletonProvider>
            </DialogContextProvider>
          </DeviceContextProvider>
        </QueryProvider>
      </TokenHydrator>
    </ReduxProvider>
  );
};

export default Providers;
