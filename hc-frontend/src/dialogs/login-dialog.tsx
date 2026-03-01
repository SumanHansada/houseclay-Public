"use client";

import { X } from "lucide-react";

import { Button } from "@/base-components";
import { Dialog, DialogContent, DialogHeader } from "@/components/Dialog";
import Login from "@/components/Login";
import { MobileHeader } from "@/layout-components";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";

interface LoginDialogProps {
  id: string;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ id }) => {
  const { closeDialog } = useDialog();
  const { isMobile } = useDeviceContext();

  const handleCloseDialog = () => {
    closeDialog(id);
  };

  return (
    <Dialog
      id={id}
      type={isMobile ? "fullscreen" : "card"}
      width={isMobile ? 100 : 50}
      onClose={handleCloseDialog}
      entryAnimation={isMobile ? "animate-slide-in-right" : "animate-fade-in"}
      exitAnimation={isMobile ? "animate-slide-out-right" : "animate-fade-out"}
    >
      <DialogHeader className="border-none">
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
        ) : (
          <div className="flex justify-end w-full">
            <Button
              variant="secondary"
              size="custom"
              className="rounded-full p-1"
              onClick={handleCloseDialog}
            >
              <X size={24} />
            </Button>
          </div>
        )}
      </DialogHeader>

      <DialogContent>
        <Login onClose={handleCloseDialog} />
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
