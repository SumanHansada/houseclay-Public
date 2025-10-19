import { X } from "lucide-react";
import { useDispatch } from "react-redux";

import { Button } from "@/base-components";
import { Dialog, DialogContent, DialogHeader } from "@/components/Dialog";
import Standouts from "@/components/Standouts";
import { PropertySearch } from "@/interfaces/PropertySearch";
import { useDialog } from "@/providers/DialogContextProvider";
import { setHideStickyNavBar } from "@/store/appSlice";

interface StandoutsDialogProps {
  id: string;
  activeTab: string;
  properties: PropertySearch[];
  setActiveTab: (tab: string) => void;
}
const StandoutsDialog: React.FC<StandoutsDialogProps> = ({
  id,
  activeTab,
  properties,
  setActiveTab,
}) => {
  const { closeDialog } = useDialog();
  const dispatch = useDispatch();
  const handleCloseDialog = () => {
    closeDialog("standouts-dialog");
    setTimeout(() => {
      dispatch(setHideStickyNavBar(false));
    }, 300);
  };
  return (
    <Dialog
      id={id}
      type="bottom-sheet"
      onClose={handleCloseDialog}
      entryAnimation="animate-slide-in-bottom"
      exitAnimation="animate-slide-out-bottom"
    >
      <DialogHeader>
        <div className="py-2 px-8 flex flex-col justify-between items-center w-full">
          <h1 className="text-xl mt-1 mb-2 text-black">Standouts</h1>
        </div>
        <Button
          variant="secondary"
          size="custom"
          className="rounded-full p-1"
          onClick={handleCloseDialog}
        >
          <X size={24} />
        </Button>
      </DialogHeader>
      <DialogContent>
        <Standouts
          listingType={activeTab}
          properties={properties}
          setActiveTab={setActiveTab}
        />
      </DialogContent>
    </Dialog>
  );
};

export default StandoutsDialog;
