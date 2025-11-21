import { X } from "lucide-react";

import { Button } from "@/base-components";
import { MARK_RENTED_ACTION_DIALOG_ID } from "@/common/constants";
import { Dialog, DialogContent, DialogHeader } from "@/components/Dialog";
import { MobileHeader } from "@/layout-components";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";

interface MyPropertyActionsDialogProps {
  id: string;
  propertyID: string;
  propertyCategory: string;
  onDashboard: (propertyCategory: string, propertyId: string) => void;
  onClose: () => void;
}

const MyPropertyActionsDialog: React.FC<MyPropertyActionsDialogProps> = ({
  id,
  propertyID,
  propertyCategory,
  onDashboard,
  onClose,
}) => {
  const { isMobile } = useDeviceContext();
  const { openDialog } = useDialog();

  if (!isMobile) return null;

  const handleDashboard = () => {
    onDashboard(propertyCategory, propertyID);
    onClose();
  };

  const handleMarkSold = () => {
    openDialog(MARK_RENTED_ACTION_DIALOG_ID);
    onClose();
  };

  return (
    <Dialog
      id={id}
      type="bottom-sheet"
      onClose={onClose}
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
              onClick={onClose}
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
          <button
            className="w-full px-5 py-3 text-left hover:bg-gray-50"
            onClick={handleMarkSold}
          >
            Mark property as sold
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MyPropertyActionsDialog;
