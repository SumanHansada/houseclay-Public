"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { Button } from "@/base-components";
import { Dialog, DialogContent, DialogHeader } from "@/components/Dialog";
import Login from "@/components/Login";
import { MobileHeader } from "@/layout-components";
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

  const handleCloseDialog = () => {
    closeDialog(id);
    dispatch(setHideStickyNavBar(false));
  };

  return (
    <Dialog
      id={id}
      type={isMobile ? "fullscreen" : "card"}
      width={isMobile ? 100 : 45}
      onClose={handleCloseDialog}
      entryAnimation={isMobile ? "animate-slide-in-right" : "animate-fade-in"}
      exitAnimation={isMobile ? "animate-slide-out-right" : "animate-fade-out"}
    >
      <DialogHeader>
        {isMobile ? (
          <MobileHeader>
            <MobileHeader.Title>Log In to Your Account</MobileHeader.Title>
            <MobileHeader.RightAction>
              <Button
                variant="secondary"
                size="custom"
                className="rounded-full p-1"
                onClick={handleCloseDialog}
              >
                <X size={24} />
              </Button>
            </MobileHeader.RightAction>
          </MobileHeader>
        ) : null}
      </DialogHeader>

      <DialogContent>
        <Login onClose={handleCloseDialog} />
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
