"use client";

import { AnimatePresence } from "framer-motion";
import React from "react";
import { Toaster } from "react-hot-toast";

import { DeviceContextProvider } from "./DeviceContextProvider";
import { DialogContextProvider } from "./DialogContextProvider";
import QueryProvider from "./QueryProvider";
import ReduxProvider from "./ReduxProvider";
import { SkeletonProvider } from "./SkeletonProvider";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <ReduxProvider>
      <QueryProvider>
        <DeviceContextProvider>
          <DialogContextProvider>
            <SkeletonProvider>
              <AnimatePresence mode="wait">{children}</AnimatePresence>
              <Toaster position="top-right" />
            </SkeletonProvider>
          </DialogContextProvider>
        </DeviceContextProvider>
      </QueryProvider>
    </ReduxProvider>
  );
};

export default Providers;
