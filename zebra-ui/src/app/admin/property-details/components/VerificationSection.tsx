"use client";

import { CheckCircle2, Pencil } from "lucide-react";
import clsx from "clsx";

interface VerificationSectionProps {
  title: string;
  comment: string;
  setComment: (value: string) => void;
  onVerify: () => void;
  onEdit: () => void;
  isVerified: boolean;
  isCommentValid: boolean;
}

export const VerificationSection = ({
  title,
  comment,
  setComment,
  onVerify,
  onEdit,
  isVerified,
  isCommentValid,
}: VerificationSectionProps) => {
  const verifyButtonClasses = clsx(
    "w-fit px-4 py-2 rounded-xl transition-colors font-medium",
    {
      "bg-gray-200 text-gray-500 cursor-not-allowed": !isCommentValid,
      "bg-white text-red-600 border border-red-600 hover:bg-red-600 hover:text-white":
        isCommentValid,
    },
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {isVerified && (
          <CheckCircle2 className="size-6 text-green-500 flex-shrink-0" />
        )}
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <div className="flex flex-col items-end gap-2 pl-4">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="bg-gray-100 rounded-xl p-3 placeholder:text-gray-400 outline-none w-full text-base focus:ring-2 focus:ring-red-400"
          placeholder="Enter verification notes (min. 3 chars)..."
          rows={2}
          disabled={isVerified}
        />

        {isVerified ? (
          <div className="w-full flex justify-end items-center gap-4">
            <p className="text-green-600 font-bold">Section Verified</p>
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Pencil className="size-4" />
              Edit
            </button>
          </div>
        ) : (
          <button
            onClick={onVerify}
            disabled={!isCommentValid}
            className={verifyButtonClasses}
          >
            Mark as Verified
          </button>
        )}
      </div>
    </div>
  );
};
