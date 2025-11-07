import axios from "axios";
import { useDispatch } from "react-redux";

import { FileUploadProgress } from "@/interfaces/FileUploadProgress";

import {
  deleteError,
  deleteSuccess,
  setDeleteFileCompleted,
  setDeleteFileError,
  startDelete,
} from "../store/deleteFromS3Slice";
import { store } from "../store/store";

export const useS3Deleter = () => {
  const dispatch = useDispatch();

  const deleteFiles = async (
    images: {
      name: string;
      S3Url: string;
    }[],
  ) => {
    if (!images || images.length === 0) {
      console.error("No images to delete");
      return;
    }

    // Start delete and initialize file progress tracking
    const fileNames = images.map((img) => img.name);
    dispatch(startDelete({ files: fileNames }));

    try {
      // Delete files sequentially to avoid overwhelming the server
      for (let i = 0; i < images.length; i++) {
        const image = images[i];

        try {
          // Delete using axios
          await axios.delete(image.S3Url, {
            timeout: 30000, // 30 second timeout
          });

          console.log(`Successfully deleted ${image.name}`);
          dispatch(setDeleteFileCompleted({ fileName: image.name }));
        } catch (error) {
          console.error(`Error deleting ${image.name}:`, error);
          let errorMessage = "Delete failed";

          if (axios.isAxiosError(error)) {
            if (error.code === "ECONNABORTED") {
              errorMessage = "Delete timeout";
            } else if (error.response) {
              errorMessage = `Server error: ${error.response.status}`;
            } else if (error.request) {
              errorMessage = "Network error";
            } else {
              errorMessage = error.message;
            }
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          dispatch(
            setDeleteFileError({ fileName: image.name, error: errorMessage }),
          );
        }
      }

      // Check final status after all deletions complete
      const finalState = store.getState().deleteFromS3;
      const hasErrors = finalState.fileProgress.some(
        (file: FileUploadProgress) => file.status === "error",
      );

      if (hasErrors) {
        const errorCount = finalState.fileProgress.filter(
          (file: FileUploadProgress) => file.status === "error",
        ).length;
        dispatch(deleteError(`${errorCount} file(s) failed to delete`));
      } else {
        dispatch(deleteSuccess());
      }
    } catch (error) {
      console.error("Delete error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Delete failed";
      dispatch(deleteError(errorMessage));
    }
  };

  return deleteFiles;
};
