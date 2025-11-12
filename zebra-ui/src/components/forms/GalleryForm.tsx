"use client";

import { useFormikContext } from "formik";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { FormPhotoUpload } from "@/form-components";
import { FormValues } from "@/interfaces/FormValues";
import { setDeletedImages, setPropertyImages } from "@/store/editPropertySlice";
import { RootState } from "@/store/store";

interface GalleryFormProps {
  disabled: boolean;
}

const GalleryForm: React.FC<GalleryFormProps> = ({ disabled }) => {
  const { values } = useFormikContext<FormValues>();
  const deletedImages = useSelector(
    (state: RootState) => state.editProperty.deletedImages,
  );
  const propertyID = useSelector(
    (state: RootState) => state.editProperty.propertyID,
  );
  // const isFormValid = formState?.isValid;
  const dispatch = useDispatch();

  // Track if component is mounted
  const isMountedRef = useRef(true);

  // Track previous images for deletion detection
  const previousImagesRef = useRef(values.images);

  // Track synced values to prevent redundant dispatches
  const lastSyncedDataRef = useRef({
    imagesString: "",
    noPhotos: undefined as boolean | undefined,
    propertyID: null as string | null,
  });

  // Track initialization state
  const isInitializedRef = useRef(false);

  console.log(`<-- Gallery (Form 4) - images: ${values.images.length} -->`);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Initialize ref when images are first loaded from API
  useEffect(() => {
    // Only initialize once when we have images and propertyID is set
    if (
      !isInitializedRef.current &&
      values.images.length > 0 &&
      propertyID &&
      previousImagesRef.current.length === 0
    ) {
      console.log(
        "Initializing GalleryForm with images:",
        values.images.length,
      );
      previousImagesRef.current = values.images;
      isInitializedRef.current = true;

      // Set initial sync state
      lastSyncedDataRef.current = {
        imagesString: JSON.stringify(values.images),
        noPhotos: values.noPhotos,
        propertyID: propertyID,
      };
    }
  }, [values.images.length, propertyID, values.noPhotos]);

  // Reset initialization when propertyID changes (navigating to different property)
  useEffect(() => {
    if (propertyID && propertyID !== lastSyncedDataRef.current.propertyID) {
      console.log("PropertyID changed, resetting initialization");
      isInitializedRef.current = false;
      previousImagesRef.current = [];
      lastSyncedDataRef.current = {
        imagesString: "",
        noPhotos: undefined,
        propertyID: propertyID,
      };
    }
  }, [propertyID]);

  // Track deleted images - only after initialization
  useEffect(() => {
    if (!isMountedRef.current || !isInitializedRef.current) return;
    if (!propertyID) return; // Don't track deletions without propertyID

    const currentImages = values.images;
    const prevImages = previousImagesRef.current;

    if (prevImages.length === 0) {
      previousImagesRef.current = currentImages;
      return;
    }

    // Find images that were deleted
    const deleted = prevImages.filter(
      (prevImage) =>
        !currentImages.some((currImage) => currImage.id === prevImage.id),
    );

    if (deleted.length > 0) {
      console.log("Detected deleted images:", deleted.length);

      const existingDeletedIds = new Set(
        deletedImages.map((image) => image.id),
      );

      const newlyDeleted = deleted.filter(
        (image) => !existingDeletedIds.has(image.id),
      );

      if (newlyDeleted.length > 0) {
        const mergedDeleted = [...deletedImages, ...newlyDeleted];
        dispatch(setDeletedImages({ deletedImages: mergedDeleted }));
      }
    }

    previousImagesRef.current = currentImages;
  }, [values.images, deletedImages, dispatch, propertyID]);

  // Validation and Redux sync - with comprehensive deduplication
  useEffect(() => {
    if (!isMountedRef.current || !isInitializedRef.current) return;
    if (!propertyID) return; // Don't sync without propertyID
    if (disabled) return; // Skip if not editing

    const imagesString = JSON.stringify(values.images);
    const noPhotos = values.noPhotos;

    // Skip if already synced these exact values for this property (prevents loop)
    if (
      lastSyncedDataRef.current.imagesString === imagesString &&
      lastSyncedDataRef.current.noPhotos === noPhotos &&
      lastSyncedDataRef.current.propertyID === propertyID
    ) {
      return;
    }

    console.log("Syncing images to Redux:", values.images.length);

    const validateAndDispatch = async () => {
      try {
        // Optional: Re-validate just images (use your gallerySchema if defined)
        // await gallerySchema.validateAt('images', values);

        if (!isMountedRef.current) return;

        // Clear any image-specific errors (use formik helpers)
        // formik.setFieldError('images', undefined); // If needed

        // Dispatch to Redux ONLY images (don't touch whole form here)
        dispatch(setPropertyImages({ propertyImages: values.images }));

        // Update last-synced ref
        lastSyncedDataRef.current = {
          imagesString,
          noPhotos,
          propertyID,
        };
      } catch (err) {
        if (!isMountedRef.current) return;
        console.error("Image validation failed:", err);
        // Optionally set formik errors here if validation is strict
        // formik.setFieldError('images', 'Invalid images');
      }
    };

    validateAndDispatch();
  }, [
    values.images, // Trigger on image array change
    values.noPhotos, // Trigger on noPhotos toggle
    dispatch,
    propertyID,
    disabled, // New: Skip in view mode
    // Remove setErrors/setFieldError/isFormValid deps to avoid formik loop
  ]);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl text-gray-800">
          Upload Property Photos
        </h1>
        <p className="text-gray-500 mt-2">
          Properties with pictures have higher visibility.
        </p>
      </div>
      <div className="flex justify-between w-full mb-2 items-center">
        <h1 className="text-2xl text-gray-800">Add Photos</h1>
        <span className="text-sm bg-red-100 py-1 px-3 rounded-lg">
          {values.images.length}/{10}
        </span>
      </div>
      <FormPhotoUpload
        name="images"
        noPhotosName="noPhotos"
        maxPhotos={10}
        showPhotoCount={false}
        showNoPhotosCheckbox={true}
        className="mb-6"
        disabled={disabled}
      />
    </div>
  );
};

export default GalleryForm;
