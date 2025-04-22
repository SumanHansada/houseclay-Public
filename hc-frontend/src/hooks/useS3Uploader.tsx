import { useDispatch } from "react-redux";

import {
  setUploadProgress,
  startUpload,
  uploadError,
  uploadSuccess,
} from "../store/uploadToS3Slice";

export const useS3Uploader = () => {
  const dispatch = useDispatch();

  const uploadFiles = async (
    images: {
      name: string;
      url: string;
      S3url: string;
      type: string;
    }[],
  ) => {
    if (!images || images.length === 0) {
      console.error("No images to upload");
      return;
    }

    dispatch(startUpload());

    try {
      for (const image of images) {
        const blob = await fetch(image.url).then((r) => r.blob());
        const file = new File([blob], image.name, { type: image.type });

        const uploadResp = await fetch(image.S3url, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        });

        if (!uploadResp.ok) {
          throw new Error(`Failed to upload ${image.name}`);
        }

        dispatch(setUploadProgress(100)); // Assuming each file upload completes fully
      }

      dispatch(uploadSuccess());
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      dispatch(uploadError(errorMessage));
    }
  };

  return uploadFiles;
};
