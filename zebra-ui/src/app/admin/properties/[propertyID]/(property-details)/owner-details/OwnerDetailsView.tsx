"use client";

import { dialogLabels } from "@/common/constants";
import { PropertyStatus } from "@/common/enums";
import { RenderPropertyStatus } from "@/components/status/RenderPropertyStatus";
import { ActionDialog } from "@/dialogs/action-dialog";
import { useDialog } from "@/providers/DialogContextProvider";
import {
  useDeactivatePropertyMutation,
  useGetPropertyByIdQuery,
} from "@/store/apiSlice";

import { OwnerDetails } from "../../components/OwnerDetails";

const DEACTIVATE_DIALOG_ID = "report-property-dialog";

interface Props {
  propertyID: string;
}

export const OwnerDetailsView = ({ propertyID }: Props) => {
  const { openDialog, isDialogOpen } = useDialog();
  const [deactivateProperty] = useDeactivatePropertyMutation();

  const { data: currentProperty, refetch } = useGetPropertyByIdQuery({
    propertyID: propertyID,
  });
  const ownerDetails = currentProperty!.owner;
  const verificationStatus = currentProperty!.property.propertyState;
  const propertyUpdates = currentProperty!.propertyUpdates;
  const latestUpdate = propertyUpdates[propertyUpdates.length - 1] ?? null;

  const handleDeactivate = async (commentFromDialog: string) => {
    await deactivateProperty({ propertyID, comment: commentFromDialog });
  };

  return (
    <div className="h-full bg-gray-100 flex flex-col overflow-auto px-16 py-8">
      <div className="flex-1 flex flex-col gap-5">
        <div className="p-5 rounded-xl bg-white shadow-sm flex flex-col gap-4">
          <OwnerDetails currentUser={ownerDetails} />
        </div>
        <div className="flex items-center justify-between bg-white rounded-xl p-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl">Verification Status:</h1>
            <RenderPropertyStatus status={verificationStatus} />
          </div>
          {verificationStatus === PropertyStatus.INACTIVE ? null : (
            <button
              type="button"
              onClick={() => openDialog(DEACTIVATE_DIALOG_ID)}
              className="border border-red-500 text-red-500 py-1 px-4 text-lg font-medium rounded-xl hover:bg-red-500 hover:text-white"
            >
              Deactivate Property
            </button>
          )}
        </div>
        {latestUpdate ? (
          <div className="bg-white rounded-xl p-6 flex flex-col gap-3">
            <h1 className="text-2xl">Property Updates:</h1>
            <ul className="ml-4 list-disc text-lg">
              <li>
                Update Type:&nbsp;
                <span className="">{latestUpdate.updateType}</span>
              </li>
              <li>
                Update Time:&nbsp;
                <span className="">
                  {new Date(latestUpdate.updateTime).toLocaleString("en-IN")}
                </span>
              </li>
              <li>
                Updated By:&nbsp;
                <span className="">{latestUpdate.updateBy}</span>
                <span className="text-sm text-gray-700 ml-1">
                  [{latestUpdate.userType}]
                </span>
              </li>
              <li>
                Comment: &nbsp;
                <span className="">{latestUpdate.comment}</span>
              </li>
            </ul>
          </div>
        ) : null}
      </div>

      {isDialogOpen(DEACTIVATE_DIALOG_ID) && (
        <ActionDialog
          id={DEACTIVATE_DIALOG_ID}
          {...dialogLabels.deactivate}
          onConfirm={handleDeactivate}
          onSuccess={refetch}
          requireComment
        />
      )}
    </div>
  );
};
