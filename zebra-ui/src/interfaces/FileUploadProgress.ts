export interface FileUploadProgress {
  name: string;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  error?: string;
}
