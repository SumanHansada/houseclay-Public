"use client";

import { FocusTrap } from "focus-trap-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  DeviceContextProps,
  useDeviceContext,
} from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";
import { setHideStickyNavBar } from "@/store/appSlice";
import { RootState } from "@/store/store";

interface DialogProps {
  id: string;
  type: "fullscreen" | "bottom-sheet" | "card";
  onClose: () => void;
  height?: number;
  width?: number;
  children: React.ReactNode;
  entryAnimation?: string; // New prop for entry animation
  exitAnimation?: string; // New prop for exit animation
  disableOverlayClick?: boolean; // New prop to disable overlay click
}

const getDialogStyles = (
  type: string,
  deviceContext?: DeviceContextProps,
  hideStickyFooter?: boolean,
): string => {
  const isMobile = deviceContext?.isMobile;
  switch (type) {
    case "fullscreen":
      return `fixed inset-0 bg-white flex flex-col ${
        isMobile ? "h-auto" : "rounded-lg max-h-[calc(100svh-4rem)]"
      }`;
    case "bottom-sheet":
      return `fixed ${hideStickyFooter ? "bottom-0" : "bottom-[4rem]"} bg-white rounded-t-xl ${
        isMobile ? "w-full h-auto" : "hidden"
      }`;
    case "card":
      return `fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl ${
        isMobile
          ? "hidden"
          : "max-lg:w-1/2 xl:w-1/3 2xl:w-1/4 max-h-[calc(100svh-4rem)] min-w-[700px]"
      }`;
    default:
      return "";
  }
};

const overlayStyles = (type: string, hideStickyFooter?: boolean): string => {
  switch (type) {
    case "fullscreen":
      return `fixed inset-0 bg-black bg-opacity-25`;
    case "bottom-sheet":
      return `fixed inset-x-0 top-0 bg-black bg-opacity-25 ${
        hideStickyFooter ? "bottom-0" : "bottom-[4rem]"
      }`; // Stop overlay at sticky footer for mobile
    default:
      return `fixed inset-0 bg-black bg-opacity-25`;
  }
};

export const Dialog: React.FC<DialogProps> = ({
  id,
  type,
  onClose,
  height,
  width,
  children,
  entryAnimation = "animate-fade-in", // Default entry animation
  exitAnimation = "animate-fade-out", // Default exit animation
  disableOverlayClick = false, // Default to allowing overlay click
}) => {
  const { isDialogOpen, isDialogClosing, closeDialog } = useDialog();
  const isOpen = isDialogOpen(id);
  const isClosing = isDialogClosing(id);
  const deviceContext = useDeviceContext();
  const dispatch = useDispatch();
  const hideStickyFooter = useSelector(
    (state: RootState) => state.app.hideStickyNavBar,
  );
  const [shouldRender, setShouldRender] = useState(isOpen);
  const dialogOverlayStyles = overlayStyles(type, hideStickyFooter);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    } else if (!isOpen && !isClosing) {
      // Only unmount when dialog is fully closed (not open and not closing)
      setShouldRender(false);
    }
  }, [isOpen, isClosing]);

  useEffect(() => {
    if (deviceContext?.isMobile && type === "fullscreen") {
      dispatch(setHideStickyNavBar(true));
    } else if (deviceContext?.isMobile && type === "bottom-sheet") {
      dispatch(setHideStickyNavBar(true));
    }
  }, [deviceContext?.isMobile, type, dispatch]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("dialog-open");
    } else {
      document.body.classList.remove("dialog-open");
    }

    return () => {
      document.body.classList.remove("dialog-open");
    };
  }, [isOpen]);

  if (!shouldRender) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOpen && !disableOverlayClick) {
      closeDialog(id); // Close dialog via context
      onClose();
    }
  };

  const dialogStyles = getDialogStyles(type, deviceContext, hideStickyFooter);

  return (
    <FocusTrap
      focusTrapOptions={{
        allowOutsideClick: true,
        fallbackFocus: `#${id}`,
        clickOutsideDeactivates: true,
        returnFocusOnDeactivate: true,
        // Make focus trap more lenient for dialogs without tabbable elements
        initialFocus: false,
        setReturnFocus: false,
      }}
    >
      <div
        id={id}
        className={`${dialogOverlayStyles} flex justify-center items-center z-50`}
        onClick={handleOverlayClick}
        tabIndex={-1} // Make the container focusable as fallback
      >
        <div
          className={`${dialogStyles} flex flex-col transition-transform ${
            isClosing ? exitAnimation : entryAnimation
          }`}
          style={{
            height: height ? `${height}%` : undefined,
            width: width ? `${width}%` : undefined,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </FocusTrap>
  );
};

export const DialogHeader: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isMobile } = useDeviceContext();

  return (
    <div
      className={`${isMobile ? " h-[55px] " : ""} ${children ? "border-b border-gray-200" : ""} flex items-center justify-between `}
    >
      {children}
    </div>
  );
};

export const DialogContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="overflow-y-auto overflow-x-hidden flex-grow max-h-svh scroll-smooth">
    {children}
  </div>
);

export const DialogFooter: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div
    className={`${children ? "border-t border-t-gray-200" : ""} flex pb-safe-bottom-2 pt-2 md:px-6 px-4`}
  >
    {children}
  </div>
);
