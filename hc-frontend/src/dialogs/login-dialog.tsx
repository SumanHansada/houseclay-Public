"use client";

import { X } from "lucide-react";
import { useDispatch } from "react-redux";

import { Dialog, DialogContent, DialogHeader } from "@/components/Dialog";
import Login from "@/components/Login";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";
import { setHideStickyNavBar } from "@/store/appSlice";

interface LoginDialogProps {
  id: string;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ id }) => {
  const { closeDialog } = useDialog();
  const { isMobile } = useDeviceContext();
  const dispatch = useDispatch();

  const handleClose = () => {
    closeDialog(id);
    dispatch(setHideStickyNavBar(false));
  };

  return (
    <Dialog
      id={id}
      type={isMobile ? "fullscreen" : "card"}
      onClose={handleClose}
      entryAnimation={isMobile ? "animate-slide-in-right" : "animate-fade-in"}
      exitAnimation={isMobile ? "animate-slide-out-right" : "animate-fade-out"}
    >
      <DialogHeader>
        <div
          className={`${isMobile ? "py-2 px-8" : ""}  flex flex-col justify-between items-center w-full`}
        >
          {isMobile && (
            <h1 className="text-xl py-1.5 text-black">
              Log In to Your Account
            </h1>
          )}
          <button className="absolute top-4 right-4 rounded-full">
            <X onClick={handleClose} size={24} />
          </button>
        </div>
      </DialogHeader>
      <DialogContent>
        <Login />
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
