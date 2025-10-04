import { X } from "lucide-react";

import { UnlockOwnerDetails } from "@/app/property-details/[propertyID]/components/UnlockOwnerDetails";
import { Dialog, DialogContent, DialogHeader } from "@/components/Dialog";
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
      <DialogHeader>
        <div className="relative flex h-full w-full items-center justify-center">
          {/* Title: Centered and only visible on mobile */}
          <h1 className="text-lg text-center truncate font-medium md:hidden">
            Unlock Owner Details
          </h1>

          {/* Close Button: Repositions itself based on screen size */}
          <button
            aria-label="Close"
            onClick={onClose}
            className="absolute p-2 right-2 top-1/2 -translate-y-1/2 rounded-full border border-gray-200 md:border-0 md:right-4 md:top-4 md:translate-y-0"
          >
            <X size={24} />
          </button>
        </div>
      </DialogHeader>
      <DialogContent>
        <UnlockOwnerDetails propertyID={propertyID} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default UnlockOwnerDetailsDialog;
