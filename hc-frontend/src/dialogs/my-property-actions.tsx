import { X } from "lucide-react";

import { Dialog, DialogContent, DialogHeader } from "@/components/Dialog";
import { useDeviceContext } from "@/providers/DeviceContextProvider";

interface MyPropertyActionsDialogProps {
  id: string;
  propertyID: string;
  onDashboard: (propertyId: string) => void;
  onMarkSold: (propertyId: string) => void;
  onClose: () => void;
}

const MyPropertyActionsDialog: React.FC<MyPropertyActionsDialogProps> = ({
  id,
  propertyID,
  onDashboard,
  onMarkSold,
  onClose,
}) => {
  const { isMobile } = useDeviceContext();

  if (!isMobile) return null;

  const handleDashboard = () => {
    onDashboard(propertyID);
    onClose();
  };

  const handleMarkSold = () => {
    onMarkSold(propertyID);
    onClose();
  };

  return (
    <Dialog
      id={id}
      type="bottom-sheet"
      onClose={onClose}
      width={100}
      entryAnimation="animate-slide-in-bottom"
      exitAnimation="animate-slide-out-top"
    >
      <DialogHeader>
        <div className="py-2 px-8 flex flex-col justify-between items-center w-full">
          <h1 className="text-xl py-1.5 text-black">Options</h1>
          <button className="absolute top-4 right-4 rounded-full">
            <X onClick={onClose} size={24} />
          </button>
        </div>
      </DialogHeader>
      <DialogContent>
        <div className="flex flex-col items-center">
          <button
            className="w-full text-left px-5 py-3 hover:bg-gray-50 border-b"
            onClick={handleDashboard}
          >
            Dashboard
          </button>
          <button
            className="w-full text-left px-5 py-3 hover:bg-gray-50"
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
