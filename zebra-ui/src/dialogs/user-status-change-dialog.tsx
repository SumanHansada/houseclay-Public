"use client";

import { X } from "lucide-react";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/Dialog";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";

interface UserStatusChangeDialogProps {
  id: string;
  actionType: "blacklist" | "activate";
  onConfirm: (comment: string) => Promise<void>;
  onSuccess?: () => void;
}

const labels = {
  blacklist: {
    title: "Blacklist User",
    confirmText: "Blacklist User",
    prompt: "Are you sure you want to blacklist this user?",
    buttonColor: "bg-red-600",
  },
  activate: {
    title: "Activate User",
    confirmText: "Activate User",
    prompt: "Are you sure you want to activate this user?",
    buttonColor: "bg-green-600",
  },
};

export const UserStatusChangeDialog: React.FC<UserStatusChangeDialogProps> = ({
  id,
  actionType,
  onConfirm,
  onSuccess,
}) => {
  const { isMobile } = useDeviceContext();
  const { closeDialog } = useDialog();
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const { title, confirmText, prompt, buttonColor } = labels[actionType];

  const handleClose = () => closeDialog(id);

  const handleSubmit = async () => {
    setLoading(true);
    await onConfirm(comment);
    setLoading(false);
    onSuccess?.();
    handleClose();
  };

  return (
    <Dialog
      id={id}
      type={isMobile ? "bottom-sheet" : "card"}
      onClose={handleClose}
    >
      <DialogHeader>
        <div className="w-full px-6 py-3 flex justify-between items-center">
          <h2 className="text-xl font-semibold">{title}</h2>
          <X onClick={handleClose} className="cursor-pointer" />
        </div>
      </DialogHeader>
      <DialogContent>
        <div className="px-6 py-4 flex flex-col gap-4">
          <p className="text-gray-800">{prompt}</p>
          <textarea
            className="w-full border rounded-lg p-2"
            placeholder="Enter a comment..."
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
      </DialogContent>
      <DialogFooter>
        <div className="flex justify-end w-full px-6 py-3 gap-4">
          <button
            onClick={handleClose}
            className="px-4 py-2 border rounded-lg text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={comment.trim().length === 0 || loading}
            className={`px-4 py-2 text-white rounded-lg disabled:opacity-50 ${buttonColor}`}
          >
            {loading ? "Processing..." : confirmText}
          </button>
        </div>
      </DialogFooter>
    </Dialog>
  );
};
