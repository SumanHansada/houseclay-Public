"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import { PropertyCategory } from "@/common/enums";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/Dialog";
import { MobileHeader } from "@/layout-components";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";
import { setHideStickyNavBar } from "@/store/appSlice";
import { SvgIcon } from "@/utility-components";

interface ListPropertySuccessDialogProps {
  id: string;
  propertyID: string;
  propertyCategory: PropertyCategory;
}

const ListPropertySuccessDialog: React.FC<ListPropertySuccessDialogProps> = ({
  id,
  propertyID,
  propertyCategory,
}) => {
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
    // router.push(
    //   `/my-property-details/${propertyCategory.toLowerCase()}/${propertyID}`,
    // );
    const previewUrl = `/my-property-details/${propertyCategory.toLowerCase()}/${propertyID}?from=list-property`;
    router.push(previewUrl);
  };

  // const handleEditProperty = async () => {
  //   closeDialog(id);
  //   // router.push(
  //   //   `/edit-property/${propertyCategory.toLowerCase()}/${propertyID}`,
  //   // );
  //   const previewUrl = `/edit-property/${propertyCategory.toLowerCase()}/${propertyID}?from=list-property`;
  //   router.push(previewUrl);
  // };

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
                Woohoo! It&apos;s all done.
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
            <h2 className="text-3xl text-gray-800">Congratulations!</h2>
          )}
          <p className="text-gray-600 text-lg">
            You have successfully posted your property,
            <br />
            it will be live within 6 Hrs.
          </p>
        </div>
      </DialogContent>
      <DialogFooter>
        {/* Action buttons */}
        <div className="flex w-full">
          {/* <button
            onClick={handleEditProperty}
            className="w-full py-3 text-black border font-medium rounded-lg hover:bg-red-600 hover:text-white transition duration-200"
          >
            Edit
          </button> */}
          <button
            onClick={handlePreviewListing}
            className="w-full py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition duration-200"
          >
            {/* {isMobile ? "View Listing" : "Preview Listing"} */}
            View Listing
          </button>
        </div>
      </DialogFooter>
    </Dialog>
  );
};

export default ListPropertySuccessDialog;
