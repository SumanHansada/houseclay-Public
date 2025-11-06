import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { UploadState } from "../interfaces/UploadState";

const initialState: UploadState = {
  progress: 0,
  status: "idle",
  currentFileIndex: 0,
  totalFiles: 0,
  fileProgress: [],
};

const deleteFromS3Slice = createSlice({
  name: "deleteFromS3",
  initialState,
  reducers: {
    setDeleteProgress: (state, action: PayloadAction<number>) => {
      state.progress = action.payload;
    },
    startDelete: (state, action: PayloadAction<{ files: string[] }>) => {
      state.status = "uploading"; // Using 'uploading' as the in-progress status for consistency
      state.progress = 0;
      state.currentFileIndex = 0;
      state.totalFiles = action.payload.files.length;
      state.fileProgress = action.payload.files.map((name) => ({
        name,
        progress: 0,
        status: "pending" as const,
      }));
    },
    setFileProgress: (
      state,
      action: PayloadAction<{ fileName: string; progress: number }>,
    ) => {
      const fileIndex = state.fileProgress.findIndex(
        (f) => f.name === action.payload.fileName,
      );
      if (fileIndex !== -1) {
        state.fileProgress[fileIndex].progress = action.payload.progress;
        state.fileProgress[fileIndex].status = "uploading";
      }

      // Calculate overall progress
      const totalProgress = state.fileProgress.reduce(
        (sum, file) => sum + file.progress,
        0,
      );
      state.progress = Math.round(totalProgress / state.totalFiles);
    },
    setFileCompleted: (state, action: PayloadAction<{ fileName: string }>) => {
      const fileIndex = state.fileProgress.findIndex(
        (f) => f.name === action.payload.fileName,
      );
      if (fileIndex !== -1) {
        state.fileProgress[fileIndex].progress = 100;
        state.fileProgress[fileIndex].status = "completed";
      }

      // Calculate overall progress
      const totalProgress = state.fileProgress.reduce(
        (sum, file) => sum + file.progress,
        0,
      );
      state.progress = Math.round(totalProgress / state.totalFiles);
    },
    setFileError: (
      state,
      action: PayloadAction<{ fileName: string; error: string }>,
    ) => {
      const fileIndex = state.fileProgress.findIndex(
        (f) => f.name === action.payload.fileName,
      );
      if (fileIndex !== -1) {
        state.fileProgress[fileIndex].status = "error";
        state.fileProgress[fileIndex].error = action.payload.error;
      }
    },
    deleteSuccess: (state) => {
      state.status = "success";
    },
    deleteError: (state, action: PayloadAction<string>) => {
      state.status = "error";
      state.error = action.payload;
    },
    resetDelete: () => initialState,
  },
});

export const {
  setDeleteProgress,
  startDelete,
  setFileProgress: setDeleteFileProgress,
  setFileCompleted: setDeleteFileCompleted,
  setFileError: setDeleteFileError,
  deleteSuccess,
  deleteError,
  resetDelete,
} = deleteFromS3Slice.actions;

export default deleteFromS3Slice.reducer;
