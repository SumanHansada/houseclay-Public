import { X } from "lucide-react";

import { Button } from "@/base-components";
import { Dialog, DialogContent, DialogHeader } from "@/components/Dialog";
import Standouts from "@/components/Standouts";
import { PropertyCardWithImages } from "@/interfaces/User";
import { MobileHeader } from "@/layout-components";
import { useDialog } from "@/providers/DialogContextProvider";

interface StandoutsDialogProps {
  id: string;
  properties: PropertyCardWithImages[];
}
const StandoutsDialog: React.FC<StandoutsDialogProps> = ({
  id,
  properties,
}) => {
  const { closeDialog } = useDialog();
  const handleCloseDialog = () => {
    closeDialog("standouts-dialog");
  };

  if (properties.length < 1) return null;

  return (
    <Dialog
      id={id}
      type="bottom-sheet"
      onClose={handleCloseDialog}
      entryAnimation="animate-slide-in-bottom"
      exitAnimation="animate-slide-out-bottom"
    >
      <DialogHeader className="-mx-4">
        <MobileHeader className="relative">
          <MobileHeader.Title>Standouts</MobileHeader.Title>
          <MobileHeader.RightAction>
            <Button
              variant="secondary"
              size="custom"
              className="rounded-full p-1"
              onClick={handleCloseDialog}
            >
              <X size={24} />
            </Button>
          </MobileHeader.RightAction>
        </MobileHeader>
      </DialogHeader>
      <DialogContent>
        <Standouts properties={properties} />
      </DialogContent>
    </Dialog>
  );
};

export default StandoutsDialog;
