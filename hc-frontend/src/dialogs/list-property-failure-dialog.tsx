"use client";

import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/Dialog";
import { MobileHeader } from "@/layout-components";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";
import { SvgIcon } from "@/utility-components";

interface ListPropertyFailureDialogProps {
  id: string;
}

const ListPropertyFailureDialog: React.FC<ListPropertyFailureDialogProps> = ({
  id,
}) => {
  const { closeDialog } = useDialog();
  const { isMobile } = useDeviceContext();
  const router = useRouter();

  const handleClose = () => {
    closeDialog(id);
  };

  const handleRetry = () => {
    closeDialog(id);
    router.push("/list-property");
  };

  const redirectHome = () => {
    closeDialog(id);
    router.push("/");
  };

  return (
    <Dialog
      id={id}
      type={isMobile ? "bottom-sheet" : "card"}
      onClose={handleClose}
      disableOverlayClick={true}
      entryAnimation={isMobile ? "animate-slide-in-bottom" : "animate-fade-in"}
      exitAnimation={isMobile ? "animate-slide-out-bottom" : "animate-fade-out"}
    >
      <DialogHeader className="-mx-4">
        {isMobile && (
          <>
            <MobileHeader className="relative">
              <MobileHeader.Title>
                Oops! Something went wrong.
              </MobileHeader.Title>
            </MobileHeader>
          </>
        )}
      </DialogHeader>
      <DialogContent>
        <div className="flex flex-col items-center justify-center text-center px-6 pb-2 pt-6 gap-4">
          <div className="relative overflow-hidden rounded-lg">
            <div className="absolute inset-0 shadow-[inset_0_0_25px_25px_rgba(255,255,255,0.8)] z-20"></div>
            <SvgIcon iconSize="large" name="list-property-success" size={270} />
          </div>
          {!isMobile && (
            <h2 className="text-3xl text-gray-800">Something went wrong!</h2>
          )}
          <p className="text-gray-600 text-lg">
            Sorry we are facing some technical issue
            <br />
            Please try again!
          </p>
        </div>
      </DialogContent>
      <DialogFooter>
        {/* Action buttons */}
        <div className="flex w-full gap-2">
          <button
            onClick={handleRetry}
            className="w-full py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition duration-200"
          >
            Retry
          </button>
          <button
            onClick={redirectHome}
            className="w-full py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition duration-200"
          >
            Home
          </button>
        </div>
      </DialogFooter>
    </Dialog>
  );
};

export default ListPropertyFailureDialog;
