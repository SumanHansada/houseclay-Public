import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { UploadState } from "../interfaces/UploadState";

const initialState: UploadState = {
  progress: 0,
  status: "idle",
  currentFileIndex: 0,
  totalFiles: 0,
  fileProgress: [],
};

const uploadToS3Slice = createSlice({
  name: "uploadToS3",
  initialState,
  reducers: {
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.progress = action.payload;
    },
    startUpload: (state, action: PayloadAction<{ files: string[] }>) => {
      state.status = "uploading";
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

      // Don't increment currentFileIndex here - it should represent the currently uploading file
      // Files can complete out of order, so we shouldn't increment for each completion

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
    uploadSuccess: (state) => {
      state.status = "success";
    },
    uploadError: (state, action: PayloadAction<string>) => {
      state.status = "error";
      state.error = action.payload;
    },
    resetUpload: () => initialState,
  },
});

export const {
  setUploadProgress,
  startUpload,
  setFileProgress,
  setFileCompleted,
  setFileError,
  uploadSuccess,
  uploadError,
  resetUpload,
} = uploadToS3Slice.actions;

export default uploadToS3Slice.reducer;
