"use client";

import { FocusTrap } from "focus-trap-react";
import React, { useEffect, useState } from "react";

import {
  DeviceContextProps,
  useDeviceContext,
} from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";

interface DialogProps {
  id: string;
  type: "fullscreen" | "bottom-sheet" | "card";
  onClose: () => void;
  height?: number;
  width?: number;
  children: React.ReactNode;
}

const getDialogStyles = (
  type: string,
  deviceContext?: DeviceContextProps,
): string => {
  const isMobile = deviceContext?.isMobile;
  switch (type) {
    case "fullscreen":
      return `fixed inset-0 bg-white flex flex-col ${
        isMobile ? "" : "rounded-lg"
      }`;
    case "bottom-sheet":
      return `fixed bottom-[4rem] bg-white rounded-t-lg ${
        isMobile ? "w-full h-auto" : "hidden"
      }`;
    case "card":
      return `fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg ${
        isMobile ? "hidden" : "w-1/2 h-auto"
      }`;
    default:
      return "";
  }
};

const overlayStyles = (type: string, isMobile?: boolean): string => {
  switch (type) {
    case "fullscreen":
      return `fixed inset-0 bg-black bg-opacity-50`;
    case "bottom-sheet":
      return `fixed inset-x-0 top-0 bg-black bg-opacity-50 ${
        isMobile ? "bottom-[4rem]" : "bottom-0"
      }`; // Stop overlay at sticky footer for mobile
    default:
      return `fixed inset-0 bg-black bg-opacity-50`;
  }
};

export const Dialog: React.FC<DialogProps> = ({
  id,
  type,
  onClose,
  height,
  width,
  children,
}) => {
  const { isDialogOpen, closeDialog } = useDialog();
  const isOpen = isDialogOpen(id);
  const deviceContext = useDeviceContext();
  const [isClosing, setIsClosing] = useState(false);
  const dialogOverlayStyles = overlayStyles(type, deviceContext?.isMobile);

  useEffect(() => {
    if (!isOpen) {
      setIsClosing(true);
      setTimeout(() => setIsClosing(false), 300); // Animation duration
    }
  }, [isOpen]);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isOpen);
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  if (!isOpen && !isClosing) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOpen) {
      closeDialog(id); // Close dialog via context
      onClose();
    }
  };

  const dialogStyles = getDialogStyles(type, deviceContext);

  return (
    <FocusTrap>
      <div
        id={id}
        className={`${dialogOverlayStyles} flex justify-center items-center z-50`}
        onClick={handleOverlayClick}
      >
        <div
          className={`${dialogStyles} flex flex-col transition-transform ${
            isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
          }`}
          style={{
            height: height ? `${height}%` : "auto",
            width: width ? `${width}%` : undefined,
            maxHeight: "calc(100vh - 4rem)", // Prevent dialog from exceeding viewport height
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
      className={`${isMobile ? "border-b border-gray-200" : ""} flex items-center justify-between`}
    >
      {children}
    </div>
  );
};

export const DialogContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="overflow-y-auto overflow-x-hidden flex-grow max-h-[calc(100vh-4rem)] scroll-smooth">
    {children}
  </div>
);

export const DialogFooter: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="border-t border-gray-200 py-2 px-4 flex justify-end">
    {children}
  </div>
);
