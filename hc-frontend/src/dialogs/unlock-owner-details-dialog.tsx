import { X } from "lucide-react";

import { UnlockOwnerDetails } from "@/app/property-details/[propertyID]/components/UnlockOwnerDetails";
import { Button } from "@/base-components";
import { Dialog, DialogContent, DialogHeader } from "@/components/Dialog";
import { MobileHeader } from "@/layout-components";
import { useDeviceContext } from "@/providers/DeviceContextProvider";

interface UnlockOwnerDetailsProps {
  id: string;
  onClose: () => void;
  propertyID: string;
}

const UnlockOwnerDetailsDialog: React.FC<UnlockOwnerDetailsProps> = ({
  id,
  onClose,
  propertyID,
}) => {
  const { isMobile } = useDeviceContext();

  return (
    <Dialog
      id={id}
      type={isMobile ? "fullscreen" : "card"}
      width={isMobile ? 100 : 55}
      onClose={onClose}
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
                onClick={onClose}
              >
                <X size={24} />
              </Button>
            </MobileHeader.RightAction>
          </MobileHeader>
        )}
      </DialogHeader>
      <DialogContent>
        <UnlockOwnerDetails propertyID={propertyID} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default UnlockOwnerDetailsDialog;
