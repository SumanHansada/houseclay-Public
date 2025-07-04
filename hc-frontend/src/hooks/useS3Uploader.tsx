import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { RootState, store } from "../store/store";
import {
  setFileCompleted,
  setFileError,
  setFileProgress,
  startUpload,
  uploadError,
  uploadSuccess,
} from "../store/uploadToS3Slice";

export const useS3Uploader = () => {
  const dispatch = useDispatch();
  const uploadState = useSelector((state: RootState) => state.uploadToS3);

  const uploadFiles = async (
    images: {
      name: string;
      url: string;
      type: string;
      S3Url: string;
    }[],
  ) => {
    if (!images || images.length === 0) {
      console.error("No images to upload");
      return;
    }

    // Start upload and initialize file progress tracking
    const fileNames = images.map((img) => img.name);
    dispatch(startUpload({ files: fileNames }));

    try {
      // Upload files sequentially to avoid overwhelming the server
      for (let i = 0; i < images.length; i++) {
        const image = images[i];

        try {
          // Fetch the blob from the URL
          const blobResponse = await fetch(image.url);
          if (!blobResponse.ok) {
            throw new Error(`Failed to fetch image: ${blobResponse.statusText}`);
          }
          
          const blob = await blobResponse.blob();
          const file = new File([blob], image.name, { type: image.type });

          // Upload using axios with progress tracking
          await axios.put(image.S3Url, file, {
            headers: {
              "Content-Type": file.type,
              "Cache-Control": "public, max-age=86400, must-revalidate",
            },
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const progress = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                dispatch(
                  setFileProgress({
                    fileName: image.name,
                    progress: progress,
                  })
                );
              }
            },
            timeout: 30000, // 30 second timeout
          });

          // File completed successfully
          dispatch(setFileCompleted({ fileName: image.name }));
          
        } catch (error) {
          console.error(`Error uploading ${image.name}:`, error);
          let errorMessage = "Upload failed";
          
          if (axios.isAxiosError(error)) {
            if (error.code === 'ECONNABORTED') {
              errorMessage = "Upload timeout";
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
          
          dispatch(setFileError({ fileName: image.name, error: errorMessage }));
        }
      }

             // Check final status after all uploads complete
       const finalState = store.getState().uploadToS3;
       const hasErrors = finalState.fileProgress.some(
         (file: any) => file.status === "error"
       );
       
       if (hasErrors) {
         const errorCount = finalState.fileProgress.filter(
           (file: any) => file.status === "error"
         ).length;
         dispatch(uploadError(`${errorCount} file(s) failed to upload`));
       } else {
         dispatch(uploadSuccess());
       }
      
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      dispatch(uploadError(errorMessage));
    }
  };

  return uploadFiles;
};
