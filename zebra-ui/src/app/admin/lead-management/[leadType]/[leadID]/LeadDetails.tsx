"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

import { LeadActionsEnum, LeadStatusEnum, LeadType } from "@/interfaces/Lead";
import {
  useGetLeadByIdQuery,
  useLeadAddCommentMutation,
  useLeadStatusUpdateMutation,
} from "@/store/apiSlice";

import { RenderLeadStatus } from "../../components/RenderLeadStatus";
import AsyncFallback from "@/components/AsyncFallback";

export const LeadDetails = () => {
  const router = useRouter();
  const params = useParams();
  const leadType = params.leadType as LeadType;
  const leadID = Number(params.leadID);

  const {
    data: currentLead,
    isLoading,
    isError,
    error,
  } = useGetLeadByIdQuery({ id: leadID });

  const [leadStatusUpdate, { isLoading: isUpdatingStatus }] =
    useLeadStatusUpdateMutation();
  const [leadAddComment, { isLoading: isPostingComment }] =
    useLeadAddCommentMutation();

  const [newCommentText, setNewCommentText] = useState<string>("");

  // ─── A ref to the scrollable container for all comments ───
  const commentsContainerRef = useRef<HTMLUListElement | null>(null);

  // ─── SCROLL TO BOTTOM LOGIC ───
  useEffect(() => {
    if (!commentsContainerRef.current) return;
    const container = commentsContainerRef.current;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [currentLead?.comments.length]);

  if (isLoading || isError || !currentLead) {
    return (
      <AsyncFallback
        isLoading={isLoading}
        isError={isError || !currentLead}
        error={error}
        loadingMessage="Loading lead details…"
        errorMessage={`Failed to fetch lead #${leadID}.`}
      />
    );
  }

  const isFollowUpDisabled = currentLead.status === LeadStatusEnum.FOLLOW_UP;
  const isResolvedDisabled = currentLead.status === LeadStatusEnum.RESOLVED;

  const isLeadTypeProperty = leadType === "property";

  const handleFollowUp = async () => {
    try {
      await leadStatusUpdate({
        id: leadID,
        newStatus: LeadActionsEnum.FOLLOW_UP,
      });
    } catch (err: unknown) {
      console.error("Failed to update to FOLLOW_UP:", err);
    }
  };
  const handleResolved = async () => {
    try {
      await leadStatusUpdate({
        id: leadID,
        newStatus: LeadActionsEnum.RESOLVED,
      });
    } catch (err: unknown) {
      console.error("Failed to update to RESOLVED:", err);
    }
  };

  const handleAddComment = async () => {
    const text = newCommentText.trim();
    if (!text) return;

    setNewCommentText("");

    try {
      await leadAddComment({ id: leadID, newComment: text });
    } catch (err: unknown) {
      console.error("Failed to post comment:", err);
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
              <div className="flex flex-col">
                <label className="text-gray-600 font-medium">Created At</label>
                <span className="mt-1">
                  {new Date(currentLead.createdAt).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex flex-col">
                <label className="text-gray-600 font-medium">Status</label>
                <span className="mt-1">
                  <RenderLeadStatus status={currentLead.status} />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ───── Comments ───── */}
        <div className="w-2/5 flex flex-col border-l border-gray-200 h-full min-h-0">
          <div className="bg-gray-100 px-4 py-3 border-b border-gray-300">
            <h3 className="text-lg font-semibold">Comment History</h3>
          </div>

          {/* ─── Scrollable Comments List ─── */}
          <ul
            ref={commentsContainerRef}
            className="flex-1 overflow-y-auto bg-white min-h-0 p-4 space-y-4"
          >
            {Array.isArray(currentLead.comments) &&
            currentLead.comments.length > 0 ? (
              currentLead.comments.map((comment, idx) => (
                <li
                  key={`${comment.date}-${comment.author}-${idx}`}
                  className="bg-gray-50 border border-gray-300 rounded-lg p-3"
                >
                  <p className="text-sm text-gray-800">{comment.comment}</p>
                  <div className="mt-1 flex justify-between text-xs text-gray-500">
                    <span>Author: {comment.author}</span>
                    <span>
                      {new Date(comment.date).toLocaleString("en-IN")}
                    </span>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-center text-gray-500 py-8">No Comments.</li>
            )}
          </ul>

          {/* ─── New Comment Input Area ─── */}
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
                className={`px-4 py-2 rounded-lg text-white cursor-pointer ${
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
      <div className="bg-gray-100 px-4 py-3 border-t border-gray-300 flex justify-between">
        <div className="flex gap-2">
          <button
            className="py-2 px-4 rounded-lg bg-gray-100 hover:bg-gray-300 border border-gray-400"
            onClick={() => router.back()}
          >
            Back
          </button>

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
        </div>

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
            {isUpdatingStatus && currentLead.status === LeadStatusEnum.NEW
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
            {isUpdatingStatus && currentLead.status === LeadStatusEnum.FOLLOW_UP
              ? "Updating…"
              : "Resolved"}
          </button>
        </div>
      </div>
    </div>
  );
};
