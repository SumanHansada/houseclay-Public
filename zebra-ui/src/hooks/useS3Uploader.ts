import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../store/store";
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
      // Create Evaporate instance for multipart uploads
      const _evaporateConfig = {
        signerUrl: "/api/s3-sign", // You'll need to create this endpoint
        aws_key: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
        bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET,
        cloudfront: true,
        computeContentMd5: true,
        cryptoMd5Method: function (data: Uint8Array) {
          // You'll need to implement MD5 calculation
          return btoa(
            String.fromCharCode.apply(null, Array.from(new Uint8Array(data))),
          );
        },
        maxConcurrentParts: 3, // Upload 3 parts concurrently
        partSize: 6 * 1024 * 1024, // 6MB parts
        retryCount: 3,
        awsSignatureVersion: "4",
      };

      // For now, fallback to the original implementation since we need backend support for Evaporate
      // TODO: Implement proper Evaporate.js integration with backend signing

      for (let i = 0; i < images.length; i++) {
        const image = images[i];

        try {
          const blob = await fetch(image.url).then((r) => r.blob());
          const file = new File([blob], image.name, { type: image.type });

          // Simulate progress updates for each file
          const simulateProgress = () => {
            let progress = 0;
            const interval = setInterval(() => {
              progress += Math.random() * 20;
              if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                dispatch(setFileCompleted({ fileName: image.name }));
              } else {
                dispatch(
                  setFileProgress({
                    fileName: image.name,
                    progress: Math.round(progress),
                  }),
                );
              }
            }, 200);
          };

          simulateProgress();

          const uploadResp = await fetch(image.S3Url, {
            method: "PUT",
            headers: {
              "Content-Type": file.type,
              "Cache-Control": "public, max-age=86400, must-revalidate",
            },
            body: file,
          });

          if (!uploadResp.ok) {
            throw new Error(`Failed to upload ${image.name}`);
          }

          // File completed successfully
          dispatch(setFileCompleted({ fileName: image.name }));
        } catch (error) {
          console.error(`Error uploading ${image.name}:`, error);
          const errorMessage =
            error instanceof Error ? error.message : "Upload failed";
          dispatch(setFileError({ fileName: image.name, error: errorMessage }));
        }
      }

      // Check if all files completed successfully
      const allCompleted = () => {
        const currentState = uploadState;
        return (
          currentState.fileProgress.length > 0 &&
          currentState.fileProgress.every((file) => file.status === "completed")
        );
      };

      if (allCompleted()) {
        dispatch(uploadSuccess());
      } else {
        dispatch(uploadError("Some files failed to upload"));
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
