import { X } from "lucide-react";

import { Button } from "@/base-components";
import { PropertyStatus } from "@/common/enums";
import { Dialog, DialogContent, DialogHeader } from "@/components/Dialog";
import { MobileHeader } from "@/layout-components";
import { useDeviceContext } from "@/providers/DeviceContextProvider";

interface MyPropertyActionsDialogProps {
  id: string;
  propertyID: string;
  propertyState: string;
  propertyCategory: string;
  onDashboard: (propertyCategory: string, propertyId: string) => void;
  onMarkAsRented: (propertyId: string) => void;
  onClose: (isTransitioning: boolean) => void;
}

const MyPropertyActionsDialog: React.FC<MyPropertyActionsDialogProps> = ({
  id,
  propertyID,
  propertyState,
  propertyCategory,
  onDashboard,
  onMarkAsRented,
  onClose,
}) => {
  const { isMobile } = useDeviceContext();

  if (!isMobile) return null;

  const handleCloseWithoutTransition = () => {
    onClose(false);
  };

  const handleDashboard = () => {
    onDashboard(propertyCategory, propertyID);
    handleCloseWithoutTransition();
  };

  const handleMarkSold = () => {
    onMarkAsRented(propertyID);
    onClose(true);
  };

  return (
    <Dialog
      id={id}
      type="bottom-sheet"
      onClose={handleCloseWithoutTransition}
      width={100}
      entryAnimation="animate-slide-in-bottom"
      exitAnimation="animate-slide-out-bottom"
    >
      <DialogHeader className="-mx-4">
        <MobileHeader className="relative">
          <MobileHeader.Title>Options</MobileHeader.Title>
          <MobileHeader.RightAction>
            <Button
              variant="secondary"
              size="custom"
              className="p-1 rounded-full"
              onClick={handleCloseWithoutTransition}
            >
              <X size={24} />
            </Button>
          </MobileHeader.RightAction>
        </MobileHeader>
      </DialogHeader>
      <DialogContent>
        <div className="flex flex-col items-center">
          <button
            className="w-full px-5 py-3 text-left border-b hover:bg-gray-50"
            onClick={handleDashboard}
          >
            Dashboard
          </button>
          {propertyState === PropertyStatus.INACTIVE ? null : (
            <button
              className="w-full px-5 py-3 text-left hover:bg-gray-50"
              onClick={handleMarkSold}
            >
              Mark property as rented
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MyPropertyActionsDialog;
