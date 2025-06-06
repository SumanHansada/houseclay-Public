import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UploadState {
  progress: number;
  status: "idle" | "uploading" | "success" | "error";
  error?: string;
}

const initialState: UploadState = {
  progress: 0,
  status: "idle",
};

const uploadToS3Slice = createSlice({
  name: "uploadToS3",
  initialState,
  reducers: {
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.progress = action.payload;
    },
    startUpload: (state) => {
      state.status = "uploading";
      state.progress = 0;
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
  uploadSuccess,
  uploadError,
  resetUpload,
} = uploadToS3Slice.actions;

export default uploadToS3Slice.reducer;
