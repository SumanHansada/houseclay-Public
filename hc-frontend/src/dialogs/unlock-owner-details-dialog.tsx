import { X } from "lucide-react";

import { UnlockOwnerDetails } from "@/app/property-details/[propertyID]/components/UnlockOwnerDetails";
import { Button } from "@/base-components";
import { Dialog, DialogContent, DialogHeader } from "@/components/Dialog";
import { MobileHeader } from "@/layout-components";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";

interface UnlockOwnerDetailsProps {
  id: string;
  propertyID: string;
}

const UnlockOwnerDetailsDialog: React.FC<UnlockOwnerDetailsProps> = ({
  id,
  propertyID,
}) => {
  const { isMobile } = useDeviceContext();
  const { closeDialog } = useDialog();

  const handleClose = () => {
    closeDialog("unlock-owner-details-dialog");
  };

  return (
    <Dialog
      id={id}
      type={isMobile ? "fullscreen" : "card"}
      width={isMobile ? 100 : 55}
      onClose={handleClose}
      entryAnimation={isMobile ? "animate-slide-in-right" : "animate-fade-in"}
      exitAnimation={isMobile ? "animate-slide-out-right" : "animate-fade-out"}
    >
      <DialogHeader className="-mx-4">
        {isMobile && (
          <MobileHeader className="relative">
            <MobileHeader.Title>Unlock Owner Details</MobileHeader.Title>
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
        <UnlockOwnerDetails propertyID={propertyID} onClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
};

export default UnlockOwnerDetailsDialog;
