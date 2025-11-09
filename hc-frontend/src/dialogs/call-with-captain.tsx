"use client";

import { X } from "lucide-react";
import React from "react";
import { useDispatch } from "react-redux";

import { Button } from "@/base-components";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/Dialog";
import { MobileHeader } from "@/layout-components";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";
import { setHideStickyNavBar } from "@/store/appSlice";
import { SvgIcon } from "@/utility-components";

interface CallWithCaptainDialogProps {
  id: string;
}

const CallWithCaptainDialog: React.FC<CallWithCaptainDialogProps> = ({
  id,
}) => {
  const { isMobile } = useDeviceContext();
  const { closeDialog } = useDialog();
  const dispatch = useDispatch();

  const handleClose = () => {
    closeDialog("call-with-captain-dialog");
    dispatch(setHideStickyNavBar(true));
  };

  return (
    <Dialog
      id={id}
      type={isMobile ? "bottom-sheet" : "card"}
      onClose={handleClose}
      width={isMobile ? 100 : 40}
      entryAnimation={isMobile ? "animate-slide-in-bottom" : "animate-fade-in"}
      exitAnimation={isMobile ? "animate-slide-out-bottom" : "animate-fade-out"}
    >
      <DialogHeader className="-mx-4">
        {isMobile && (
          <MobileHeader className="relative">
            <MobileHeader.Title>Awesome!</MobileHeader.Title>
            <MobileHeader.RightAction>
              <Button
                variant="secondary"
                size="custom"
                className="rounded-full p-1"
                onClick={handleClose}
              >
                <X size={24} />
              </Button>
            </MobileHeader.RightAction>
          </MobileHeader>
        )}
      </DialogHeader>
      <DialogContent>
        <div
          className={`flex flex-col items-center justify-center text-center ${isMobile ? "pt-6 pb-2 px-6" : "p-8"}`}
        >
          <div className="relative overflow-hidden rounded-lg">
            <div className="absolute inset-0 shadow-[inset_0_0_25px_25px_rgba(255,255,255,0.8)] z-20"></div>
            <SvgIcon iconSize="medium" name="houseclay-captain" size={150} />
          </div>
          {!isMobile && <h2 className="text-2xl font-medium">Awesome!</h2>}
          {!isMobile && (
            <h2 className="text-2xl font-medium">We&apos;re Getting Started</h2>
          )}
          <p className="text-base text-gray-500 my-4">
            One of our team members will call you shortly to guide you through
            the property listing process.
          </p>
        </div>
      </DialogContent>
      <DialogFooter>
        <button
          key="call-with-captain-button"
          className={`py-3 px-24 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition duration-200 ${isMobile ? "w-full" : ""}`}
          onClick={handleClose}
          tabIndex={0}
          autoFocus
        >
          Great!
        </button>
      </DialogFooter>
    </Dialog>
  );
};

export default CallWithCaptainDialog;
