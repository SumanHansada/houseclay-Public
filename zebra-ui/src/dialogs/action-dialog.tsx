"use client";

import { AlertCircle, X } from "lucide-react";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/Dialog";
import { DialogLabelConfig } from "@/interfaces/Dialog";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";
import { getErrorMessage } from "@/utils/rtkError";

interface ActionDialogCommon extends DialogLabelConfig {
  id: string;
  onSuccess?: () => void;
}

export interface ActionDialogWithComment extends ActionDialogCommon {
  requireComment: true;
  onConfirm: (comment: string) => Promise<void>;
}

export interface ActionDialogWithoutComment extends ActionDialogCommon {
  requireComment?: false;
  onConfirm: () => Promise<void>;
}

export type ActionDialogProps =
  | ActionDialogWithComment
  | ActionDialogWithoutComment;

export const ActionDialog: React.FC<ActionDialogProps> = ({
  id,
  title,
  prompt,
  confirmLabel,
  colour,
  requireComment,
  onConfirm,
  onSuccess,
}) => {
  const { isMobile } = useDeviceContext();
  const { closeDialog } = useDialog();

  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const disabled =
    loading || (requireComment ? comment.trim().length < 3 : false);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      if (requireComment) {
        await onConfirm(comment.trim());
      } else {
        await onConfirm();
      }
      onSuccess?.();
      closeDialog(id);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
      setLoading(false);
    }
  };

  return (
    <Dialog
      id={id}
      type={isMobile ? "bottom-sheet" : "card"}
      onClose={() => closeDialog(id)}
    >
      <DialogHeader>
        <div className="flex justify-between items-center w-full">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <X className="cursor-pointer" onClick={() => closeDialog(id)} />
        </div>
      </DialogHeader>

      <DialogContent>
        <div className="px-6 py-2 flex flex-col gap-4">
          <p className="text-gray-800">{prompt}</p>

          {requireComment && (
            <textarea
              className="w-full border rounded-lg p-2 h-24 resize-none outline-none"
              placeholder="Enter a comment…"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>
      </DialogContent>

      <DialogFooter>
        <div className="w-full flex justify-end gap-4">
          <button
            onClick={() => closeDialog(id)}
            className="px-4 py-2 border rounded-lg text-gray-700"
          >
            Cancel
          </button>
          <button
            disabled={disabled}
            onClick={handleSubmit}
            className={`px-4 py-2 text-white rounded-lg disabled:opacity-50 bg-${colour}-600 hover:bg-${colour}-700`}
          >
            {loading ? "Processing…" : confirmLabel}
          </button>
        </div>
      </DialogFooter>
    </Dialog>
  );
};
