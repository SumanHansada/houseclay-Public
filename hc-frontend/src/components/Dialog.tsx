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
  direction?: "top" | "bottom" | "left" | "right" | "center";
  height?: number;
  width?: number;
  stickyPosition?: boolean;
  overlayClose?: boolean;
  borderRadius?: "top" | "bottom" | "left" | "right" | "all";
  children: React.ReactNode;
}

interface DialogFooterProps {
  align?: "left" | "center" | "right";
  children: React.ReactNode;
}

const getBorderRadiusClass = (
  borderRadius: string,
  deviceContext?: DeviceContextProps,
) => {
  switch (borderRadius) {
    case "top":
      return `${deviceContext?.isMobile ? "rounded-t-3xl" : "rounded-t-lg"}`;
    case "bottom":
      return "rounded-b-lg";
    case "left":
      return "rounded-l-lg";
    case "right":
      return "rounded-r-lg";
    case "all":
    default:
      return "rounded-lg";
  }
};

const getDirectionClass = (
  direction?: string,
  deviceContext?: DeviceContextProps,
) => {
  if (deviceContext?.isMobile) {
    return "bottom-0";
  }
  switch (direction) {
    case "top":
      return "top-0";
    case "bottom":
      return "bottom-0";
    case "left":
      return "left-0";
    case "right":
      return "right-0";
    case "center":
    default:
      return "inset-0 m-auto";
  }
};

const getAnimationClass = (
  direction?: string,
  deviceContext?: DeviceContextProps,
  isClosing?: boolean,
) => {
  if (deviceContext?.isMobile) {
    return isClosing ? "animate-slide-out-bottom" : "animate-slide-in-bottom";
  }
  return isClosing ? "animate-zoom-out" : "animate-zoom-in";
};

export const Dialog: React.FC<DialogProps> = ({
  id,
  direction,
  height,
  width,
  stickyPosition = false,
  overlayClose = true,
  borderRadius = "all",
  children,
}) => {
  const { isDesktop, isMobile, isTablet } = useDeviceContext();
  const { isOpen, closeDialog } = useDialog();
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const dialogIsOpen = isOpen(id);
    if (!dialogIsOpen) {
      setIsClosing(true);
      setTimeout(() => setIsClosing(false), 300); // Match the animation duration
    }
  }, [id, isOpen]);

  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  if (!isOpen(id) && !isClosing) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (overlayClose) {
      closeDialog(id);
      setTimeout(() => {
        document.body.classList.remove("no-scroll");
      }, 300);
    }
  };

  const borderRadiusClass = getBorderRadiusClass(borderRadius, {
    isDesktop,
    isMobile,
    isTablet,
  });
  const directionClass = getDirectionClass(direction, {
    isDesktop,
    isMobile,
    isTablet,
  });
  const animationClass = getAnimationClass(
    direction,
    { isDesktop, isMobile, isTablet },
    isClosing,
  );

  return (
    <FocusTrap>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center bottom-16`}
        onClick={handleOverlayClick}
      >
        <div
          className={`bg-white border border-gray-200 ${directionClass} ${borderRadiusClass} ${animationClass} flex flex-col`}
          style={{
            height: `${height ? `${height}vh` : "auto"}`,
            maxHeight: `${height ? `${height}vh` : "80vh"}`,
            width: `${isMobile ? "100%" : width ? `${width}%` : "50%"}`,
            position: stickyPosition ? "sticky" : "relative",
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
    <div className="border-b border-gray-200 flex-shrink-0">
      {isMobile && (
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto my-1"></div>
      )}
      {children}
    </div>
  );
};

export const DialogContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="overflow-y-auto overflow-x-hidden flex-grow scroll-smooth max-md:scrollbar-hide">
    {children}
  </div>
);

export const DialogFooter: React.FC<DialogFooterProps> = ({
  children,
  align,
}) => {
  const { isMobile } = useDeviceContext();
  return (
    <div
      className={`border-t border-gray-200 flex flex-shrink-0 ${align || (isMobile ? "justify-around" : "justify-end")}`}
    >
      {children}
    </div>
  );
};
