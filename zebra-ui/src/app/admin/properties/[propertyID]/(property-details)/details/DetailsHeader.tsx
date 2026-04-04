"use client";

import { Clock, History, OctagonX } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";

import { dialogLabels } from "@/common/constants";
import { PropertyStatus } from "@/common/enums";
import Spinner from "@/components/Spinner";
import { ActionDialog } from "@/dialogs/action-dialog";
import { useDialog } from "@/providers/DialogContextProvider";
import {
  useDeactivatePropertyMutation,
  useGetPropertyByIdQuery,
} from "@/store/apiSlice";
import { RootState } from "@/store/store";

const DEACTIVATE_DIALOG_ID = "deactivate-property-dialog";

interface DetailsHeaderProps {
  propertyID: string;
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  isWorking: boolean;
  onDiscard: () => void;
  formIsValid: boolean;
  formIsDirty: boolean;
}

export const DetailsHeader = ({
  propertyID,
  editMode,
  setEditMode,
  isWorking,
  onDiscard,
  formIsValid,
  formIsDirty,
}: DetailsHeaderProps) => {
  const { openDialog, isDialogOpen } = useDialog();
  const [deactivateProperty] = useDeactivatePropertyMutation();
  const { refetch } = useGetPropertyByIdQuery({ propertyID });

  const { propertyState, propertyUpdates } = useSelector(
    (state: RootState) => state.propertyDetails.propertyDetails,
  );

  const sortedUpdates = [...propertyUpdates].sort(
    (a, b) =>
      new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime(),
  );
  const latestUpdate = sortedUpdates[0] ?? null;

  const isInactive = propertyState === PropertyStatus.INACTIVE;
  const showDeactivate = !editMode && !isInactive;

  const handleDeactivate = async (comment: string) => {
    await deactivateProperty({ propertyID, comment });
  };

  return (
    <>
      <div className="bg-white sticky top-0 rounded-xl z-10 border-b border-b-gray-400 shadow-sm">
        {/* Row 1: Mode + Actions */}
        <div className="flex items-center justify-between py-3 px-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl">{editMode ? "Edit Mode" : "View Mode"}</h1>
          </div>

          <div className="flex items-center gap-3">
            {editMode ? (
              <>
                <button
                  type="button"
                  onClick={onDiscard}
                  className="border border-red-500 text-red-500 py-1 px-4 text-lg font-medium rounded-xl hover:bg-red-500 hover:text-white"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="border border-red-500 text-red-500 py-1 px-4 text-lg font-medium rounded-xl hover:bg-red-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  disabled={!formIsValid || isWorking || !formIsDirty}
                >
                  {isWorking && <Spinner size="sm" />} Save Changes
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setEditMode(true)}
                className="border border-red-500 text-red-500 py-1 px-4 text-lg font-medium rounded-xl hover:bg-red-500 hover:text-white"
              >
                Edit
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Latest update + Deactivate */}
        <div className="flex items-center justify-between px-6 py-2 border-t border-gray-200 text-sm text-gray-600">
          {latestUpdate ? (
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-gray-400" />
              <span className="font-medium text-gray-800">
                {latestUpdate.updateType}
              </span>
              <span>
                by {latestUpdate.updateBy}
                {latestUpdate.userType && (
                  <span className="text-gray-400 ml-1">
                    [{latestUpdate.userType}]
                  </span>
                )}
              </span>
              <span className="text-gray-400">&middot;</span>
              <span>
                {new Date(latestUpdate.updateTime).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              {latestUpdate.comment && (
                <>
                  <span className="text-gray-400">&middot;</span>
                  <span className="text-gray-500 truncate max-w-[300px]">
                    &quot;{latestUpdate.comment}&quot;
                  </span>
                </>
              )}
              <span className="text-gray-300 mx-1">|</span>
              <Link
                href={`/admin/properties/${propertyID}/owner-details`}
                className="flex items-center gap-1 text-gray-500 hover:text-gray-800 hover:underline transition-colors"
              >
                <History size={14} />
                View all ({propertyUpdates.length})
              </Link>
            </div>
          ) : (
            <span className="text-gray-400">No updates yet</span>
          )}

          {showDeactivate && (
            <button
              type="button"
              onClick={() => openDialog(DEACTIVATE_DIALOG_ID)}
              className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-lg border border-red-200 transition-colors"
            >
              <OctagonX size={14} />
              Deactivate
            </button>
          )}
        </div>
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
    </>
  );
};
