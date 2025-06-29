"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { X } from "lucide-react";
import { useSelector } from "react-redux";

import { Dialog, DialogContent, DialogHeader } from "@/components/Dialog";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";
import { RootState } from "@/store/store";

interface UploadDialogProps {
  id: string;
}

export const UploadDialog: React.FC<UploadDialogProps> = ({ id }) => {
  const { closeDialog } = useDialog();
  const { isMobile } = useDeviceContext();

  const uploadState = useSelector((state: RootState) => state.uploadToS3);
  const { status, progress, totalFiles, fileProgress } = uploadState;

  const handleClose = () => {
    if (status === "uploading") {
      // Don't allow closing during upload
      return;
    }
    closeDialog(id);
  };

  const getStatusText = () => {
    if (status === "uploading") {
      const completedFiles = fileProgress.filter(
        (file) => file.status === "completed",
      ).length;
      return `Uploading photos (${completedFiles} of ${totalFiles} completed)`;
    }
    if (status === "success") {
      return "Upload completed successfully!";
    }
    if (status === "error") {
      return "Upload failed. Please try again.";
    }
    return "Preparing upload...";
  };

  const getProgressPercentage = () => {
    return Math.round((progress / 100) * 100);
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
          className={`${isMobile ? "py-2 px-8" : ""} flex flex-col justify-between items-center w-full`}
        >
          {isMobile && (
            <>
              <h1 className="text-xl py-1.5 text-black">Uploading Photos</h1>
              <button
                className="absolute top-4 right-4 rounded-full"
                onClick={handleClose}
                disabled={status === "uploading"}
              >
                <X size={25} />
              </button>
            </>
          )}
        </div>
      </DialogHeader>
      <DialogContent>
        <div className="flex flex-col items-center justify-center text-center p-6 gap-6">
          {/* Main Lottie Animation */}
          <div className="relative overflow-hidden rounded-lg">
            <div className="absolute inset-0 shadow-[inset_0_0_25px_25px_rgba(255,255,255,0.8)] z-20"></div>
            <DotLottieReact
              src="/animations/photo-upload.lottie"
              autoplay
              loop
              style={{ width: "100%", height: "100%" }}
            />
          </div>

          {/* Status Text */}
          {!isMobile && (
            <h2 className="text-2xl text-gray-800 font-semibold">
              Uploading Photos
            </h2>
          )}

          <p className="text-gray-600 text-lg">{getStatusText()}</p>

          {/* Progress Section */}
          {status === "uploading" && (
            <div className="w-full space-y-4">
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-red-500 h-3 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>

              {/* Progress Text */}
              <p className="text-sm text-gray-500 pt-2">
                {getProgressPercentage()}% Complete
              </p>
            </div>
          )}

          {/* Action Buttons */}
          {status !== "uploading" && (
            <div className="flex gap-4 w-full">
              <button
                onClick={handleClose}
                className="w-full py-3 text-black border font-medium rounded-lg hover:bg-red-600 hover:text-white transition duration-200"
              >
                Close
              </button>
              {status === "error" && (
                <button
                  onClick={() => {
                    // TODO: Implement retry functionality
                    handleClose();
                  }}
                  className="w-full py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition duration-200"
                >
                  Retry
                </button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
