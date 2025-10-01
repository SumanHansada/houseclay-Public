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
      width={isMobile ? 100 : 45}
      onClose={onClose}
      entryAnimation={isMobile ? "animate-slide-in-right" : "animate-fade-in"}
      exitAnimation={isMobile ? "animate-slide-out-right" : "animate-fade-out"}
    >
      <DialogHeader>
        {isMobile ? (
          <div className="relative w-full h-[55px] border-b border-gray-200 bg-white flex items-center">
            <div className="absolute left-2 w-10 h-10" aria-hidden />
            <h1 className="mx-auto text-lg font-medium">
              Unlock Owner Details
            </h1>
            <button
              aria-label="Close"
              onClick={onClose}
              className="absolute right-2 rounded-full p-2 border border-gray-200"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <div className="relative w-full h-0">
            <button
              aria-label="Close"
              onClick={onClose}
              className="absolute top-4 right-4 rounded-full p-2 border border-gray-200"
            >
              <X size={20} />
            </button>
          </div>
        )}
      </DialogHeader>
      <DialogContent>
        <UnlockOwnerDetails propertyID={propertyID} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default UnlockOwnerDetailsDialog;
