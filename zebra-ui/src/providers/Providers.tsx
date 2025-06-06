"use client";

import { AnimatePresence } from "framer-motion";
import React from "react";

import { DeviceContextProvider } from "./DeviceContextProvider";
import { DialogContextProvider } from "./DialogContextProvider";
import { InitializeAuthToken } from "./InitializeAuthToken";
import QueryProvider from "./QueryProvider";
import ReduxProvider from "./ReduxProvider";
import { SkeletonProvider } from "./SkeletonProvider";
import ToastProvider from "./ToastProvider";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <ReduxProvider>
      <InitializeAuthToken>
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
      </InitializeAuthToken>
    </ReduxProvider>
  );
};

export default Providers;
