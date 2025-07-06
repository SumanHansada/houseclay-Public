"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import ListPropertySuccessSvg from "public/icons/list-property-success.svg";
import { useDispatch } from "react-redux";

import { PropertyCategory } from "@/common/enums";
import { Dialog, DialogContent, DialogHeader } from "@/components/Dialog";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";
import { setHideStickyNavBar } from "@/store/appSlice";

const ListPropertySuccess = ListPropertySuccessSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;

interface ListPropertySuccessDialogProps {
  id: string;
  propertyID: string;
  propertyCategory: PropertyCategory;
}

export const ListPropertySuccessDialog: React.FC<
  ListPropertySuccessDialogProps
> = ({ id, propertyID, propertyCategory }) => {
  const { closeDialog } = useDialog();
  const { isMobile } = useDeviceContext();
  const router = useRouter();
  const dispatch = useDispatch();

  const handleClose = () => {
    closeDialog(id);
    dispatch(setHideStickyNavBar(false));
  };

  const handlePreviewListing = async () => {
    closeDialog(id);
    router.push(`/property-details/${propertyCategory}/${propertyID}`);
  };

  return (
    <Dialog
      id={id}
      type={isMobile ? "bottom-sheet" : "card"}
      onClose={handleClose}
      entryAnimation="animate-fade-in"
      exitAnimation="animate-fade-out"
    >
      <DialogHeader>
        <div
          className={`${isMobile ? "py-2 px-8" : ""}  flex flex-col justify-between items-center w-full`}
        >
          {isMobile && (
            <>
              <h1 className="text-xl py-1.5 text-black">
                Woohoo! It&apos;s all done.
              </h1>
              <button className="absolute top-4 right-4 rounded-full">
                <X onClick={handleClose} size={25} />
              </button>
            </>
          )}
        </div>
      </DialogHeader>
      <DialogContent>
        <div className="flex flex-col items-center justify-center text-center px-6 pb-2 pt-6 gap-4">
          <div className="relative overflow-hidden rounded-lg">
            <div className="absolute inset-0 shadow-[inset_0_0_25px_25px_rgba(255,255,255,0.8)] z-20"></div>
            <ListPropertySuccess />
          </div>
          {!isMobile && (
            <h2 className="text-3xl text-gray-800">Congratulations!</h2>
          )}
          <p className="text-gray-600 text-lg">
            You have successfully posted your property,
            <br />
            it will be live within 2 Hrs.
          </p>

          {/* Action buttons */}
          <div className="flex gap-4 w-full">
            <button
              onClick={handleClose}
              className="w-full py-3 text-black border font-medium rounded-lg hover:bg-red-600 hover:text-white transition duration-200"
            >
              Edit
            </button>
            <button
              onClick={handlePreviewListing}
              className="w-full py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition duration-200"
            >
              {isMobile ? "View Listing" : "Preview Listing"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
