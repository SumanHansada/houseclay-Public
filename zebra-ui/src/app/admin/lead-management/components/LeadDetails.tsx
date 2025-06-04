"use client";

import React, { useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

import {
  useGetLeadByIdQuery,
  useLeadStatusUpdateMutation,
  useLeadAddCommentMutation,
} from "@/store/apiSlice";
import { LeadStatus, LeadActions } from "@/interfaces/Lead";

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
            ? (error as any).message
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

  const isFollowUpDisabled =
    currentLead.status === LeadStatus.FOLLOW_UP ||
    currentLead.status === LeadStatus.RESOLVED;
  const isResolvedDisabled = currentLead.status === LeadStatus.RESOLVED;

  const handleFollowUp = async () => {
    try {
      await leadStatusUpdate({
        id: leadId,
        newStatus: LeadActions.FOLLOW_UP,
      });
    } catch (err: any) {
      console.error(
        "Failed to update to FOLLOW_UP:",
        JSON.stringify(err, null, 2),
      );
    }
  };

  const handleResolved = async () => {
    try {
      await leadStatusUpdate({
        id: leadId,
        newStatus: LeadActions.RESOLVED,
      });
    } catch (err: any) {
      console.error(
        "Failed to update to RESOLVED:",
        JSON.stringify(err, null, 2),
      );
    }
  };

  const handleAddComment = async () => {
    const text = newCommentText.trim();
    if (!text) return;

    setNewCommentText("");

    try {
      await leadAddComment({ id: leadId, newComment: text });
    } catch (err: any) {
      console.error("Failed to post comment:", JSON.stringify(err, null, 2));
      setNewCommentText(text);
    }
  };

  return (
    <div className="flex flex-col w-full h-[calc(100vh-4rem)]">
      {/* ───────── This row fills all space above the footer ───────── */}
      <div className="flex flex-1 min-h-0">
        {/* ───── LEFT COLUMN: “Form”‐Style Info ───── */}
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
                <span className="mt-1">{currentLead.phone}</span>
              </div>
              <div className="flex flex-col">
                <label className="text-gray-600 font-medium">Status</label>
                <span className="mt-1">{renderStatus(currentLead.status)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ───── RIGHT COLUMN: Comments & Actions ───── */}
        {/* Note: “h-full” is required so this col matches the parent’s height */}
        <div className="w-2/5 flex flex-col border-l border-gray-200 h-full min-h-0">
          {/* Comment History Header (sticks to top) */}
          <div className="bg-gray-100 px-4 py-3 border-b border-gray-300">
            <h3 className="text-lg font-semibold">Comment History</h3>
          </div>

          {/* ─── Only this list scrolls ─── */}
          <div className="flex-1 overflow-y-auto bg-white min-h-0 scrollbar-thin">
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

          {/* Add Comment area (sticks to bottom of this column) */}
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

      {/* ───────── Actions Footer (outermost, always visible) ───────── */}
      <div className="bg-gray-100 px-4 py-3 border-t border-gray-300 flex justify-between">
        <button
          onClick={() => router.push("/admin/add-property")}
          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
        >
          Add Property
        </button>

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

// "use client";

// import React, { useState, ReactNode } from "react";
// import { useRouter } from "next/navigation";

// import {
//   useGetLeadByIdQuery,
//   useLeadStatusUpdateMutation,
//   useLeadAddCommentMutation,
// } from "@/store/apiSlice";
// import { LeadStatus, LeadActions } from "@/interfaces/Lead";

// interface LeadDetailsProps {
//   leadType: string;
//   leadId: number;
// }

// export const LeadDetails: React.FC<LeadDetailsProps> = ({
//   leadType,
//   leadId,
// }) => {
//   const router = useRouter();

//   const {
//     data: currentLead,
//     isLoading,
//     isError,
//     error,
//   } = useGetLeadByIdQuery({ id: leadId });

//   const [leadStatusUpdate, { isLoading: isUpdatingStatus }] =
//     useLeadStatusUpdateMutation();
//   const [leadAddComment, { isLoading: isPostingComment }] =
//     useLeadAddCommentMutation();

//   const [newCommentText, setNewCommentText] = useState<string>("");

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
//         <span className="text-gray-500">Loading lead details…</span>
//       </div>
//     );
//   }

//   if (isError || !currentLead) {
//     return (
//       <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
//         <span className="text-red-500">
//           {typeof error === "object" && "message" in error
//             ? (error as any).message
//             : `Failed to fetch lead #${leadId}.`}
//         </span>
//       </div>
//     );
//   }

//   const renderStatus = (status: LeadStatus): ReactNode => {
//     switch (status) {
//       case LeadStatus.NEW:
//         return (
//           <span className="px-2 py-1 bg-blue-400 text-blue-900 rounded-full text-sm">
//             New
//           </span>
//         );
//       case LeadStatus.FOLLOW_UP:
//         return (
//           <span className="px-2 py-1 bg-red-300 text-red-800 rounded-full text-sm">
//             Follow Up
//           </span>
//         );
//       case LeadStatus.RESOLVED:
//         return (
//           <span className="px-2 py-1 bg-green-400 text-green-900 rounded-full text-sm">
//             Resolved
//           </span>
//         );
//       default:
//         return null;
//     }
//   };

//   const isFollowUpDisabled =
//     currentLead.status === LeadStatus.FOLLOW_UP ||
//     currentLead.status === LeadStatus.RESOLVED;
//   const isResolvedDisabled = currentLead.status === LeadStatus.RESOLVED;

//   const handleFollowUp = async () => {
//     try {
//       await leadStatusUpdate({
//         id: leadId,
//         newStatus: LeadActions.FOLLOW_UP,
//       });
//     } catch (err: any) {
//       console.error(
//         "Failed to update to FOLLOW_UP:",
//         JSON.stringify(err, null, 2),
//       );
//     }
//   };

//   const handleResolved = async () => {
//     try {
//       await leadStatusUpdate({
//         id: leadId,
//         newStatus: LeadActions.RESOLVED,
//       });
//     } catch (err: any) {
//       console.error(
//         "Failed to update to RESOLVED:",
//         JSON.stringify(err, null, 2),
//       );
//     }
//   };

//   const handleAddComment = async () => {
//     const text = newCommentText.trim();
//     if (!text) return;

//     setNewCommentText("");

//     try {
//       await leadAddComment({ id: leadId, newComment: text });
//     } catch (err: any) {
//       console.error("Failed to post comment:", JSON.stringify(err, null, 2));
//       setNewCommentText(text);
//     }
//   };

//   return (
//     <div className="flex flex-col w-full h-[calc(100vh-4rem)]">
//       <div className="flex">
//         {/* ───── LEFT COLUMN: “Form”‐Style Info ───── */}
//         <div className="w-3/5 p-8">
//           <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-6">
//             <h2 className="text-2xl font-semibold mb-4">Lead Information</h2>
//             <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-lg">
//               {/* Name */}
//               <div className="flex flex-col">
//                 <label className="text-gray-600 font-medium">Name</label>
//                 <span className="mt-1">{currentLead.name}</span>
//               </div>
//               {/* Email */}
//               <div className="flex flex-col">
//                 <label className="text-gray-600 font-medium">Email</label>
//                 <span className="mt-1">{currentLead.email}</span>
//               </div>

//               {/* Phone */}
//               <div className="flex flex-col">
//                 <label className="text-gray-600 font-medium">Phone</label>
//                 <span className="mt-1">{currentLead.phone}</span>
//               </div>
//               {/* Status */}
//               <div className="flex flex-col">
//                 <label className="text-gray-600 font-medium">Status</label>
//                 <span className="mt-1">{renderStatus(currentLead.status)}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ───── RIGHT COLUMN: Comments & Actions ───── */}
//         <div className="w-2/5 flex flex-col border-l border-gray-200">
//           {/* Comment History Header (sticky at top) */}
//           <div className="bg-gray-100 px-4 py-3 border-b border-gray-300">
//             <h3 className="text-lg font-semibold">Comment History</h3>
//           </div>

//           {/* Scrollable comments list */}
//           <div className="flex-1 overflow-y-auto bg-white">
//             <ul className="p-4 space-y-4">
//               {Array.isArray(currentLead.comments) &&
//               currentLead.comments.length > 0 ? (
//                 currentLead.comments.map((comment) => (
//                   <li
//                     key={`${comment.date}-${comment.author}`}
//                     className="bg-gray-50 border border-gray-300 rounded-lg p-3"
//                   >
//                     <p className="text-sm text-gray-800">{comment.comment}</p>
//                     <div className="mt-1 flex justify-between text-xs text-gray-500">
//                       <span>Author: {comment.author}</span>
//                       <span>{new Date(comment.date).toLocaleString()}</span>
//                     </div>
//                   </li>
//                 ))
//               ) : (
//                 <li className="text-center text-gray-500 py-8">No Comments.</li>
//               )}
//             </ul>
//           </div>

//           {/* Add Comment textarea & button (sticky at bottom) */}
//           <div className="bg-gray-100 px-4 py-3 border-t border-gray-300">
//             <textarea
//               name="comment"
//               id="lead-comment"
//               value={newCommentText}
//               onChange={(e) => setNewCommentText(e.target.value)}
//               rows={3}
//               placeholder="Add a comment..."
//               className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//             <div className="mt-2 flex justify-end">
//               <button
//                 onClick={handleAddComment}
//                 disabled={isPostingComment || !newCommentText.trim()}
//                 className={`px-4 py-2 rounded-lg text-white ${
//                   isPostingComment
//                     ? "bg-gray-400 cursor-not-allowed"
//                     : "bg-black hover:bg-gray-800"
//                 }`}
//               >
//                 {isPostingComment ? "Posting…" : "Comment"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Actions footer (sticks below everything) */}
//       <div className="bg-gray-100 px-4 py-3 border-t border-gray-300 flex justify-between">
//         <button
//           onClick={() => router.push("/admin/add-property")}
//           className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
//         >
//           Add Property
//         </button>

//         <div className="flex gap-2">
//           <button
//             disabled={isFollowUpDisabled || isUpdatingStatus}
//             onClick={handleFollowUp}
//             className={`px-4 py-2 rounded-lg text-white ${
//               isFollowUpDisabled
//                 ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                 : "bg-red-500 hover:bg-red-600"
//             }`}
//           >
//             {isUpdatingStatus && currentLead.status === LeadStatus.NEW
//               ? "Updating…"
//               : "Follow Up"}
//           </button>

//           <button
//             disabled={isResolvedDisabled || isUpdatingStatus}
//             onClick={handleResolved}
//             className={`px-4 py-2 rounded-lg text-white ${
//               isResolvedDisabled
//                 ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                 : "bg-green-600 hover:bg-green-700"
//             }`}
//           >
//             {isUpdatingStatus && currentLead.status === LeadStatus.FOLLOW_UP
//               ? "Updating…"
//               : "Resolved"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// "use client";

// import React, { useState, ReactNode } from "react";
// import { useRouter } from "next/navigation";
// import { User } from "lucide-react";

// import {
//   useGetLeadByIdQuery,
//   useLeadStatusUpdateMutation,
//   useLeadAddCommentMutation,
// } from "@/store/apiSlice";
// import { LeadStatus, LeadActions } from "@/interfaces/Lead";

// interface LeadDetailsProps {
//   leadType: string;
//   leadId: number;
// }

// export const LeadDetails: React.FC<LeadDetailsProps> = ({
//   leadType,
//   leadId,
// }) => {
//   const router = useRouter();

//   const {
//     data: currentLead,
//     isLoading,
//     isError,
//     error,
//   } = useGetLeadByIdQuery({ id: leadId });

//   const [leadStatusUpdate, { isLoading: isUpdatingStatus }] =
//     useLeadStatusUpdateMutation();
//   const [leadAddComment, { isLoading: isPostingComment }] =
//     useLeadAddCommentMutation();

//   const [newCommentText, setNewCommentText] = useState<string>("");

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
//         <span className="text-gray-500">Loading lead details…</span>
//       </div>
//     );
//   }

//   if (isError || !currentLead) {
//     return (
//       <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
//         <span className="text-red-500">
//           {typeof error === "object" && "message" in error
//             ? (error as any).message
//             : `Failed to fetch lead #${leadId}.`}
//         </span>
//       </div>
//     );
//   }

//   const renderStatus = (status: LeadStatus): ReactNode => {
//     switch (status) {
//       case LeadStatus.NEW:
//         return (
//           <div className="px-2 py-1 bg-blue-400 text-blue-900 rounded-full">
//             New
//           </div>
//         );
//       case LeadStatus.FOLLOW_UP:
//         return (
//           <div className="px-2 py-1 bg-red-300 text-red-800 rounded-full">
//             Follow Up
//           </div>
//         );
//       case LeadStatus.RESOLVED:
//         return (
//           <div className="px-2 py-1 bg-green-400 text-green-900 rounded-full">
//             Resolved
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   const isFollowUpDisabled =
//     currentLead.status === LeadStatus.FOLLOW_UP ||
//     currentLead.status === LeadStatus.RESOLVED;
//   const isResolvedDisabled = currentLead.status === LeadStatus.RESOLVED;

//   const handleFollowUp = async () => {
//     try {
//       console.log(LeadActions.FOLLOW_UP);
//       await leadStatusUpdate({
//         id: leadId,
//         newStatus: LeadActions.FOLLOW_UP,
//       });
//     } catch (err: any) {
//       console.error(
//         "Failed to update to FOLLOW_UP:",
//         JSON.stringify(err, null, 2),
//       );
//     }
//   };

//   const handleResolved = async () => {
//     try {
//       console.log(LeadActions.RESOLVED);
//       await leadStatusUpdate({
//         id: leadId,
//         newStatus: LeadActions.RESOLVED,
//       });
//     } catch (err: any) {
//       console.error(
//         "Failed to update to RESOLVED:",
//         JSON.stringify(err, null, 2),
//       );
//     }
//   };

//   const handleAddComment = async () => {
//     const text = newCommentText.trim();
//     if (!text) return;
//     setNewCommentText("");

//     try {
//       console.log(text);
//       await leadAddComment({ id: leadId, newComment: text });
//     } catch (err: any) {
//       console.error("Failed to post comment:", JSON.stringify(err, null, 2));
//     }
//   };

//   return (
//     <div className="flex w-full h-[calc(100vh-4rem)]">
//       <div className="flex flex-col w-full">
//         <div className="flex flex-1">
//           {/* ───────── Info ───────── */}
//           <div className="w-3/5">
//             <div
//               className="flex items-center gap-3 mb-6 cursor-pointer"
//               onClick={() =>
//                 router.push(`/admin/user-details/${currentLead.phone}`)
//               }
//             >
//               {/* <div className="w-40 h-40 bg-gray-300 rounded-xl flex items-center justify-center">
//                 <User className="w-40 h-40 text-gray-600" />
//               </div> */}
//               <div className="flex flex-col">
//                 <span className="text-4xl font-semibold hover:underline">
//                   {currentLead.name}
//                 </span>
//                 <span className="text-2xl text-gray-600">
//                   {currentLead.email}
//                 </span>
//               </div>
//             </div>

//             <div className="space-y-4 text-xl">
//               <div className="flex items-center">
//                 <span className="w-20 font-medium">Phone:</span>
//                 <span>{currentLead.phone}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="w-20 font-medium">Status:</span>
//                 {renderStatus(currentLead.status)}
//               </div>
//             </div>
//           </div>

//           {/* ───────── Comment ───────── */}
//           <div className="w-2/5 bg-black">
//             {/* Header */}
//             <div className="w-full text-center py-2 text-xl bg-gray-100">
//               Comment History
//             </div>

//             <ul className="flex-1 overflow-y-auto py-3 flex flex-col gap-4">
//               {Array.isArray(currentLead.comments) &&
//               currentLead.comments.length > 0 ? (
//                 currentLead.comments.map((comment) => (
//                   <li
//                     className="flex flex-col p-3 border border-black bg-white rounded-xl mx-auto w-11/12"
//                     key={`${comment.date}-${comment.author}`}
//                   >
//                     <div className="font-medium">
//                       Comment:
//                       <span className="font-normal">{comment.comment}</span>
//                     </div>
//                     <div className="flex w-full justify-between text-sm text-gray-600">
//                       <span>Author: {comment.author}</span>
//                       <span>
//                         Date: {new Date(comment.date).toLocaleString()}
//                       </span>
//                     </div>
//                   </li>
//                 ))
//               ) : (
//                 <h2 className="text-center text-gray-600 mt-8">No Comments.</h2>
//               )}
//             </ul>

//             <div className="flex px-2 py-3 border-t border-gray-400 bg-gray-100">
//               {/* <input
//                 type="text"
//                 placeholder="Add Comment"
//                 value={newCommentText}
//                 onChange={(e) => setNewCommentText(e.target.value)}
//                 className="flex-1 bg-white border rounded-lg px-4 py-3 mr-2 focus:outline-none border-black"
//               /> */}
//               <textarea
//                 name="comment"
//                 id="lead-comment"
//                 value={newCommentText}
//                 onChange={(e) => setNewCommentText(e.target.value)}
//                 rows={4}
//                 placeholder="Add Comment..."
//                 className="flex-1 bg-white border rounded-lg px-4 py-3 mr-2 focus:outline-none border-black"
//               />
//               <div className="flex items-end">
//                 <button
//                   onClick={handleAddComment}
//                   disabled={isPostingComment || !newCommentText.trim()}
//                   className={`h-fit rounded-xl px-4 py-3 text-white cursor-pointer ${
//                     isPostingComment
//                       ? "bg-gray-500 cursor-not-allowed"
//                       : "bg-black hover:bg-gray-800"
//                   }`}
//                 >
//                   {isPostingComment ? "Posting…" : "Comment"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="sticky bottom-0 z-10 border-t border-gray-400 bg-gray-100 shadow-sm px-8 py-3 flex justify-between">
//           <button
//             onClick={() => router.push("/admin/add-property")}
//             className="px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white"
//           >
//             Add Property
//           </button>

//           <div className="flex gap-2">
//             <button
//               disabled={isFollowUpDisabled || isUpdatingStatus}
//               onClick={handleFollowUp}
//               className={`px-4 py-3 rounded-xl ${
//                 isFollowUpDisabled
//                   ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                   : "bg-red-500 hover:bg-red-600 text-white"
//               }`}
//             >
//               {isUpdatingStatus && currentLead.status === LeadStatus.NEW
//                 ? "Updating…"
//                 : "Follow Up"}
//             </button>
//             <button
//               disabled={isResolvedDisabled || isUpdatingStatus}
//               onClick={handleResolved}
//               className={`px-4 py-3 rounded-xl ${
//                 isResolvedDisabled
//                   ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                   : "bg-green-600 hover:bg-green-700 text-white"
//               }`}
//             >
//               {isUpdatingStatus && currentLead.status === LeadStatus.FOLLOW_UP
//                 ? "Updating…"
//                 : "Resolved"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
