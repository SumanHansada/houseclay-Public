import { X } from "lucide-react";

import { ContactLogin } from "@/app/property-details/[propertyID]/components/ContactLogin";
import { Dialog, DialogContent, DialogHeader } from "@/components/Dialog";
import { useDeviceContext } from "@/providers/DeviceContextProvider";

interface ContactOwnerLoginDialogProps {
  id: string;
  onClose: () => void;
  onSuccess: () => void;
}

const ContactOwnerLoginDialog: React.FC<ContactOwnerLoginDialogProps> = ({
  id,
  onClose,
  onSuccess,
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
        <div className="relative flex h-full w-full items-center justify-center">
          {/* Title: Centered and only visible on mobile */}
          <h1 className="text-lg text-center truncate font-medium md:hidden">
            Unlock Owner Details
          </h1>

          {/* Close Button: Repositions itself based on screen size */}
          <button
            aria-label="Close"
            onClick={onClose}
            className="absolute p-2 right-2 top-1/2 -translate-y-1/2 rounded-full md:right-4 md:border md:border-gray-200 md:top-4 md:translate-y-0"
          >
            <X size={24} />
          </button>
        </div>
      </DialogHeader>
      <DialogContent>
        <ContactLogin onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default ContactOwnerLoginDialog;
