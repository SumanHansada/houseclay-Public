import { FileUploadProgress } from "./FileUploadProgress";

export interface UploadState {
  progress: number;
  status: "idle" | "uploading" | "success" | "error";
  error?: string;
  currentFileIndex: number;
  totalFiles: number;
  fileProgress: FileUploadProgress[];
}
