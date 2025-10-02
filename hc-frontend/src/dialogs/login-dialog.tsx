"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
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

  useEffect(() => {
    dispatch(setHideStickyNavBar(true));
    return () => {
      dispatch(setHideStickyNavBar(false));
    };
  }, [dispatch]);

  const handleClose = () => {
    closeDialog(id);
    dispatch(setHideStickyNavBar(false));
  };

  return (
    <Dialog
      id={id}
      type={isMobile ? "fullscreen" : "card"}
      width={isMobile ? 100 : 45}
      onClose={handleClose}
      entryAnimation={isMobile ? "animate-slide-in-right" : "animate-fade-in"}
      exitAnimation={isMobile ? "animate-slide-out-right" : "animate-fade-out"}
    >
      <DialogHeader>
        {isMobile ? (
          <div className="relative w-full h-[55px] border-b border-gray-200 bg-white flex items-center">
            <div className="absolute left-2 w-10 h-10" aria-hidden />
            <h1 className="mx-auto text-lg font-medium">
              Log In to Your Account
            </h1>
            <button
              aria-label="Close"
              onClick={handleClose}
              className="absolute right-2 rounded-full p-2 border border-gray-200"
            >
              <X size={20} />
            </button>
          </div>
        ) : null}
      </DialogHeader>

      <DialogContent>
        <Login onClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
