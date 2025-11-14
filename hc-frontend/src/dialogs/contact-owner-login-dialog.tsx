import { X } from "lucide-react";

import { ContactLogin } from "@/app/property-details/[propertyID]/components/ContactLogin";
import { Button } from "@/base-components";
import { Dialog, DialogContent, DialogHeader } from "@/components/Dialog";
import { MobileHeader } from "@/layout-components";
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
        <ContactLogin onSuccess={onSuccess} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default ContactOwnerLoginDialog;
