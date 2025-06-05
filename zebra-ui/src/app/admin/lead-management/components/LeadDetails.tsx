"use client";

import { useRouter } from "next/navigation";
import React, { ReactNode, useState } from "react";

import { LeadActions, LeadStatus } from "@/interfaces/Lead";
import {
  useGetLeadByIdQuery,
  useLeadAddCommentMutation,
  useLeadStatusUpdateMutation,
} from "@/store/apiSlice";

interface LeadDetailsProps {
  leadType: string;
  leadId: number;
}

export const LeadDetails: React.FC<LeadDetailsProps> = ({
  leadType,
  leadId,
}) => {
  const router = useRouter();

  const {
    data: currentLead,
    isLoading,
    isError,
    error,
  } = useGetLeadByIdQuery({ id: leadId });

  const [leadStatusUpdate, { isLoading: isUpdatingStatus }] =
    useLeadStatusUpdateMutation();
  const [leadAddComment, { isLoading: isPostingComment }] =
    useLeadAddCommentMutation();

  const [newCommentText, setNewCommentText] = useState<string>("");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <span className="text-gray-500">Loading lead details…</span>
      </div>
    );
  }

  if (isError || !currentLead) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <span className="text-red-500">
          {typeof error === "object" && "message" in error
            ? error.message
            : `Failed to fetch lead #${leadId}.`}
        </span>
      </div>
    );
  }

  const renderStatus = (status: LeadStatus): ReactNode => {
    switch (status) {
      case LeadStatus.NEW:
        return (
          <span className="px-2 py-1 bg-blue-400 text-blue-900 rounded-full text-sm">
            New
          </span>
        );
      case LeadStatus.FOLLOW_UP:
        return (
          <span className="px-2 py-1 bg-red-300 text-red-800 rounded-full text-sm">
            Follow Up
          </span>
        );
      case LeadStatus.RESOLVED:
        return (
          <span className="px-2 py-1 bg-green-400 text-green-900 rounded-full text-sm">
            Resolved
          </span>
        );
      default:
        return null;
    }
  };

  const isFollowUpDisabled = currentLead.status === LeadStatus.FOLLOW_UP;
  const isResolvedDisabled = currentLead.status === LeadStatus.RESOLVED;

  const isLeadTypeProperty = leadType === "property";

  const handleFollowUp = async () => {
    try {
      console.log(LeadActions.FOLLOW_UP);
      await leadStatusUpdate({
        id: leadId,
        newStatus: LeadActions.FOLLOW_UP,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Failed to update to FOLLOW_UP:", err.message);
      } else {
        console.error("Failed to update to FOLLOW_UP (non‐Error):", err);
      }
    }
  };

  const handleResolved = async () => {
    try {
      console.log(LeadActions.RESOLVED);
      await leadStatusUpdate({
        id: leadId,
        newStatus: LeadActions.RESOLVED,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Failed to update to RESOLVE:", err.message);
      } else {
        console.error("Failed to update to RESOLVE (non‐Error):", err);
      }
    }
  };

  const handleAddComment = async () => {
    const text = newCommentText.trim();
    if (!text) return;

    setNewCommentText("");

    try {
      await leadAddComment({ id: leadId, newComment: text });
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Failed to post comment:", err.message);
      } else {
        console.error("Failed to post comment (non‐Error):", err);
      }
      setNewCommentText(text);
    }
  };

  return (
    <div className="flex flex-col w-full h-[calc(100vh-4rem)]">
      <div className="flex flex-1 min-h-0">
        {/* ───── Info ───── */}
        <div className="w-3/5 p-8">
          <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">Lead Information</h2>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-lg">
              <div className="flex flex-col">
                <label className="text-gray-600 font-medium">Name</label>
                <span className="mt-1">{currentLead.name}</span>
              </div>
              <div className="flex flex-col">
                <label className="text-gray-600 font-medium">Email</label>
                <span className="mt-1">{currentLead.email}</span>
              </div>
              <div className="flex flex-col">
                <label className="text-gray-600 font-medium">Phone</label>
                <span className="mt-1">{currentLead.phoneNo}</span>
              </div>
              {/* {currentLead.createdAt && ( */}
              <div className="flex flex-col">
                <label className="text-gray-600 font-medium">Created At</label>
                <span className="mt-1">{currentLead.createdAt}</span>
              </div>
              {/* )} */}
              <div className="flex flex-col">
                <label className="text-gray-600 font-medium">Status</label>
                <span className="mt-1">{renderStatus(currentLead.status)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ───── Comments ───── */}
        <div className="w-2/5 flex flex-col border-l border-gray-200 h-full min-h-0">
          <div className="bg-gray-100 px-4 py-3 border-b border-gray-300">
            <h3 className="text-lg font-semibold">Comment History</h3>
          </div>

          <div className="flex-1 overflow-y-auto bg-white min-h-0">
            {/* <div className="flex-1 overflow-y-auto bg-white min-h-0 scrollbar-thin"> */}
            <ul className="p-4 space-y-4">
              {Array.isArray(currentLead.comments) &&
              currentLead.comments.length > 0 ? (
                currentLead.comments.map((comment) => (
                  <li
                    key={`${comment.date}-${comment.author}`}
                    className="bg-gray-50 border border-gray-300 rounded-lg p-3"
                  >
                    <p className="text-sm text-gray-800">{comment.comment}</p>
                    <div className="mt-1 flex justify-between text-xs text-gray-500">
                      <span>Author: {comment.author}</span>
                      <span>{new Date(comment.date).toLocaleString()}</span>
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-center text-gray-500 py-8">No Comments.</li>
              )}
            </ul>
          </div>

          <div className="bg-gray-100 px-4 py-3 border-t border-gray-300">
            <textarea
              name="comment"
              id="lead-comment"
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              rows={3}
              placeholder="Add a comment..."
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="mt-2 flex justify-end">
              <button
                onClick={handleAddComment}
                disabled={isPostingComment || !newCommentText.trim()}
                className={`px-4 py-2 rounded-lg text-white ${
                  isPostingComment
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800"
                }`}
              >
                {isPostingComment ? "Posting…" : "Comment"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ───────── Footer ───────── */}
      <div
        className={`bg-gray-100 px-4 py-3 border-t border-gray-300 flex ${isLeadTypeProperty ? "justify-between" : "justify-end"}`}
      >
        {isLeadTypeProperty && (
          <button
            onClick={() =>
              router.push(`/admin/add-property/${currentLead.phoneNo}`)
            }
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
          >
            Add Property
          </button>
        )}

        <div className="flex gap-2">
          <button
            disabled={isFollowUpDisabled || isUpdatingStatus}
            onClick={handleFollowUp}
            className={`px-4 py-2 rounded-lg text-white ${
              isFollowUpDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {isUpdatingStatus && currentLead.status === LeadStatus.NEW
              ? "Updating…"
              : "Follow Up"}
          </button>

          <button
            disabled={isResolvedDisabled || isUpdatingStatus}
            onClick={handleResolved}
            className={`px-4 py-2 rounded-lg text-white ${
              isResolvedDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isUpdatingStatus && currentLead.status === LeadStatus.FOLLOW_UP
              ? "Updating…"
              : "Resolved"}
          </button>
        </div>
      </div>
    </div>
  );
};
