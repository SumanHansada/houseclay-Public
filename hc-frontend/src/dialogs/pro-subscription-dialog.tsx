import { X } from "lucide-react";

import { Button } from "@/base-components";
import { Dialog, DialogContent, DialogHeader } from "@/components/Dialog";
import { MobileHeader } from "@/layout-components";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";

interface ProSubscriptionDialogProps {
  id: string;
}

const ProSubscriptionDialog = ({ id }: ProSubscriptionDialogProps) => {
  const { isMobile } = useDeviceContext();
  const { closeDialog } = useDialog();

  const onClose = () => {
    closeDialog(id);
  };

  return (
    <Dialog
      id={id}
      type={isMobile ? "fullscreen" : "card"}
      onClose={onClose}
      entryAnimation={isMobile ? "animate-slide-in-bottom" : "animate-fade-in"}
      exitAnimation={isMobile ? "animate-slide-out-bottom" : "animate-fade-out"}
    >
      <DialogHeader className="-mx-4">
        <MobileHeader className="relative">
          <MobileHeader.Title>Houseclay Pro</MobileHeader.Title>
          <MobileHeader.RightAction>
            <Button
              variant="secondary"
              size="custom"
              className="rounded-full p-1"
              onClick={onClose}
            >
              <X size={24} />
            </Button>
          </MobileHeader.RightAction>
        </MobileHeader>
      </DialogHeader>
      <DialogContent>
        <div className="px-6 py-4 max-md:px-4 max-md:py-2"></div>
      </DialogContent>
    </Dialog>
  );
};

export default ProSubscriptionDialog;
