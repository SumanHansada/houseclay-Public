"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { Dialog, DialogContent, DialogHeader } from "@/components/Dialog";
import Login from "@/components/Login";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";
import { setHideStickyNavBar } from "@/store/appSlice";
import { MobileHeader } from "@/layout-components";
import { useRouter } from "next/navigation";

interface LoginDialogProps {
  id: string;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ id }) => {
  const { closeDialog } = useDialog();
  const { isMobile } = useDeviceContext();
  const dispatch = useDispatch();
  const router = useRouter();

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
        <div
          className={`${isMobile ? "py-2 px-8" : ""}  flex flex-col justify-between items-center w-full`}
        >
          {isMobile ? (
            <MobileHeader
              title="Log In to Your Account"
              onBack={() => router.back()}
            />
          ) : (
            <button
              className="absolute top-4 right-4 rounded-full p-2 border border-gray-200"
              onClick={handleClose}
            >
              <X size={24} />
            </button>
          )}
        </div>
      </DialogHeader>
      <DialogContent>
        <Login />
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
