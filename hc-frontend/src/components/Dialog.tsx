"use client";

import { FocusTrap } from "focus-trap-react";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Drawer } from "vaul";

import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";

interface DialogProps {
  id: string;
  type: "fullscreen" | "bottom-sheet" | "card";
  onClose: () => void;
  height?: number;
  width?: number;
  children: React.ReactNode;
  /** Tailwind `animate-*` class for panel (defaults use iOS-like easing from tailwind.config) */
  entryAnimation?: string;
  exitAnimation?: string;
  disableOverlayClick?: boolean; // New prop to disable overlay click
}

const getDialogStyles = (type: string, isMobile?: boolean): string => {
  switch (type) {
    case "fullscreen":
      return `fixed inset-0 bg-white flex flex-col ${
        isMobile ? "h-auto" : "rounded-lg max-h-[calc(100svh-4rem)]"
      }`;
    case "bottom-sheet":
      return `fixed bottom-0 ${
        isMobile
          ? "left-0 right-0 w-full h-auto"
          : "bg-white rounded-t-xl hidden"
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
  const { isMobile } = useDeviceContext();
  const [shouldRender, setShouldRender] = useState(isOpen);
  const nativeDialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    } else if (!isOpen && !isClosing) {
      // Only unmount when dialog is fully closed (not open and not closing)
      setShouldRender(false);
    }
  }, [isOpen, isClosing]);

  useLayoutEffect(() => {
    const el = nativeDialogRef.current;
    if (!el || !shouldRender) return;
    if (isOpen && !isClosing) {
      if (!el.open) {
        el.showModal();
      }
    } else if (!isOpen && !isClosing && el.open) {
      el.close();
    }
  }, [shouldRender, isOpen, isClosing]);

  useLayoutEffect(() => {
    return () => {
      nativeDialogRef.current?.close();
    };
  }, []);

  if (!shouldRender) return null;

  const handleOverlayClose = () => {
    if (isOpen && !disableOverlayClick) {
      closeDialog(id);
      onClose();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleOverlayClose();
  };

  const handleNativeCancel = (e: React.SyntheticEvent<HTMLDialogElement>) => {
    e.preventDefault();
    if (!disableOverlayClick) {
      closeDialog(id);
      onClose();
    }
  };

  const handleDialogSurfaceClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) {
      handleOverlayClick(e);
    }
  };

  const dialogStyles = getDialogStyles(type, isMobile);
  const isBottomSheetMobile = isMobile && type === "bottom-sheet";

  const drawerOpen = isOpen && !isClosing;

  if (isBottomSheetMobile) {
    return (
      <Drawer.Root
        open={drawerOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog(id);
            onClose();
          }
        }}
        dismissible={!disableOverlayClick}
        shouldScaleBackground={false}
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-50 bg-black/25" />
          <Drawer.Content
            className="fixed bottom-0 left-0 right-0 z-50 flex max-h-[96vh] flex-col rounded-t-xl bg-white pb-safe-bottom outline-none"
            style={height ? { height: `${height}%` } : undefined}
          >
            <FocusTrap
              active={drawerOpen}
              focusTrapOptions={{
                allowOutsideClick: true,
                fallbackFocus: `#${id}`,
                clickOutsideDeactivates: true,
                returnFocusOnDeactivate: true,
                initialFocus: false,
                setReturnFocus: false,
                preventScroll: true,
              }}
            >
              <div
                id={id}
                className="flex min-h-0 flex-1 flex-col outline-none"
                tabIndex={-1}
              >
                <Drawer.Title className="sr-only">Dialog</Drawer.Title>
                <Drawer.Handle className="mx-auto mb-2 mt-2 h-1 w-12 shrink-0 rounded-full bg-gray-300" />
                {children}
              </div>
            </FocusTrap>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  const backdropAnim = isClosing
    ? "[&::backdrop]:animate-dialog-backdrop-out"
    : "[&::backdrop]:animate-dialog-backdrop-in";
  const panelAnim = isClosing ? exitAnimation : entryAnimation;

  return (
    <dialog
      ref={nativeDialogRef}
      id={id}
      className={`fixed inset-0 z-50 m-0 flex h-full max-h-none w-full max-w-none items-center justify-center border-0 bg-transparent p-0 [backface-visibility:hidden] [&::backdrop]:bg-black/25 ${backdropAnim} motion-reduce:[&::backdrop]:animate-none`}
      onCancel={handleNativeCancel}
      onClick={handleDialogSurfaceClick}
    >
      <div
        className={`pointer-events-auto z-10 flex min-h-0 flex-col pb-safe-bottom [backface-visibility:hidden] ${dialogStyles} ${panelAnim} motion-reduce:animate-none`}
        style={{
          height: height ? `${height}%` : undefined,
          width: width ? `${width}%` : undefined,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </dialog>
  );
};

export const DialogHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <div
      className={`relative ${children ? "h-14 border-b border-gray-200 flex max-md:px-4 max-md:py-2 max-md:shadow-sm max-md:items-center max-md:justify-center md:px-6 md:py-4 md:items-start md:justify-start" : ""} ${className}`}
    >
      {children}
    </div>
  );
};

export const DialogContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div
    data-dialog-scrollable
    className={`overflow-y-auto overflow-x-hidden flex-grow max-h-svh scroll-smooth ${className}`}
  >
    {children}
  </div>
);

export const DialogFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div
    className={`${children ? "flex py-2 md:px-6 px-4 justify-center" : ""} ${className}`}
  >
    {children}
  </div>
);
