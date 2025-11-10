"use client";

import { useFormikContext } from "formik";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import { FormPhotoUpload } from "@/form-components";
import { FormValues } from "@/interfaces/FormValues";
import {
  setDeletedImages,
  setFormData,
  setFormValidity,
  setPropertyImages,
} from "@/store/editPropertySlice";
import { RootState } from "@/store/store";

interface GalleryFormProps {
  disabled: boolean;
}

const gallerySchema = Yup.object().shape({
  images: Yup.array().of(
    Yup.object().shape({
      file: Yup.object().optional(),
      id: Yup.string().required(),
      url: Yup.string().required(),
      isCover: Yup.boolean().required(),
    }),
  ),
  noPhotos: Yup.boolean().test(
    "photos-or-checkbox",
    "Please confirm that you don't have photos or upload at least one photo",
    function (value) {
      const { images } = this.parent;
      // Form is valid if:
      // 1. There are images uploaded, OR
      // 2. The "noPhotos" checkbox is checked
      return (images && images.length > 0) || value === true;
    },
  ),
});

const GalleryForm: React.FC<GalleryFormProps> = ({ disabled }) => {
  const { values, setFieldError, setErrors } = useFormikContext<FormValues>();
  const formState = useSelector((state: RootState) => state.editProperty.form);
  const deletedImages = useSelector(
    (state: RootState) => state.editProperty.deletedImages,
  );
  const propertyID = useSelector(
    (state: RootState) => state.editProperty.propertyID,
  );
  const isFormValid = formState?.isValid;
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

    const imagesString = JSON.stringify(values.images);
    const noPhotos = values.noPhotos;

    // Skip if already synced these exact values for this property
    if (
      lastSyncedDataRef.current.imagesString === imagesString &&
      lastSyncedDataRef.current.noPhotos === noPhotos &&
      lastSyncedDataRef.current.propertyID === propertyID
    ) {
      return;
    }

    console.log("Validating and syncing to Redux");

    const validateAndDispatch = async () => {
      try {
        await gallerySchema.validate(values, { abortEarly: false });

        if (!isMountedRef.current) return;

        setErrors({});

        // Dispatch to Redux
        dispatch(setPropertyImages({ propertyImages: values.images }));
        dispatch(
          setFormData({
            data: {
              images: values.images,
              noPhotos: values.noPhotos,
            },
          }),
        );

        if (!isFormValid) {
          dispatch(setFormValidity({ isValid: true }));
        }

        // Mark as synced
        lastSyncedDataRef.current = {
          imagesString,
          noPhotos,
          propertyID,
        };
      } catch (err) {
        if (!isMountedRef.current) return;

        if (err instanceof Yup.ValidationError) {
          setErrors({});

          err.inner.forEach((validationError) => {
            if (validationError.path && validationError.message) {
              setFieldError(validationError.path, validationError.message);
            }
          });

          if (isFormValid) {
            dispatch(setFormValidity({ isValid: false }));
          }
        }
      }
    };

    validateAndDispatch();
  }, [
    values.images,
    values.noPhotos,
    dispatch,
    setErrors,
    setFieldError,
    isFormValid,
    propertyID,
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

// const GalleryForm: React.FC<GalleryFormProps> = ({ disabled }) => {
//   const { values, setFieldError, setErrors } = useFormikContext<FormValues>();
//   const formState = useSelector((state: RootState) => state.editProperty.form);
//   const previousImages = useSelector(
//     (state: RootState) => state.editProperty.propertyImages,
//   );
//   const deletedImages = useSelector(
//     (state: RootState) => state.editProperty.deletedImages,
//   );
//   const isFormValid = formState?.isValid;
//   const dispatch = useDispatch();
//   const previousImagesRef = useRef(previousImages);

//   const imagesString = JSON.stringify(values.images);
//   const noPhotosString = JSON.stringify(values.noPhotos);

//   // Initialize ref when images are first loaded
//   useEffect(() => {
//     if (values.images.length > 0 && previousImagesRef.current.length === 0) {
//       previousImagesRef.current = values.images;
//     }
//   }, [imagesString, values.images]);

//   // Track deleted images
//   useEffect(
//     () => {
//       const currentImages = values.images;
//       const prevImages = previousImagesRef.current;

//       // Only track deletions if ref is initialized (not the first render)
//       if (prevImages.length === 0) {
//         return;
//       }

//       // Find images that were deleted
//       const deleted = prevImages.filter(
//         (prevImage) =>
//           !currentImages.some((currImage) => currImage.id === prevImage.id),
//       );

//       // Only dispatch if there are deleted images
//       if (deleted.length > 0) {
//         const existingDeletedIds = new Set(
//           deletedImages.map((image) => image.id),
//         );

//         const mergedDeleted = [
//           ...deletedImages,
//           ...deleted.filter((image) => !existingDeletedIds.has(image.id)),
//         ];

//         dispatch(setDeletedImages({ deletedImages: mergedDeleted }));
//         // dispatch(
//         //   setFormData({
//         //     data: {
//         //       images: currentImages,
//         //       noPhotos: values.noPhotos,
//         //     },
//         //   }),
//         // );
//       }

//       // Update the ref
//       previousImagesRef.current = currentImages;
//     },
//     // [imagesString, values.images, deletedImages, dispatch, values.noPhotos]);},
//     [
//       values.images, // Depend directly on the images array
//       deletedImages, // Needed to calculate new deletions accurately
//       dispatch,
//     ],
//   );

//   useEffect(() => {
//     const validateAndDispatch = async () => {
//       try {
//         await gallerySchema.validate(values, { abortEarly: false });
//         // Clear any previous errors
//         setErrors({});

//         console.log("Images", values.images);
//         // Set form data in the store
//         dispatch(setPropertyImages({ propertyImages: values.images }));
//         dispatch(
//           setFormData({
//             data: {
//               images: values.images,
//               noPhotos: values.noPhotos,
//             },
//           }),
//         );
//         // Form is valid
//         if (!isFormValid) {
//           dispatch(setFormValidity({ isValid: true }));
//         }
//       } catch (err) {
//         if (err instanceof Yup.ValidationError) {
//           // Clear any previous errors
//           setErrors({});
//           // Set individual field errors
//           err.inner.forEach((validationError) => {
//             if (validationError.path && validationError.message) {
//               setFieldError(validationError.path, validationError.message);
//             }
//           });
//           // Form is invalid
//           if (isFormValid) {
//             dispatch(setFormValidity({ isValid: false }));
//           }
//         }
//       }
//     };

//     validateAndDispatch();
//   }, [
//     imagesString,
//     noPhotosString,
//     dispatch,
//     setErrors,
//     setFieldError,
//     isFormValid,
//     values,
//   ]);

//   return (
//     <div className="space-y-6">
//       <div className="mb-8">
//         <h1 className="text-2xl md:text-3xl text-gray-800">
//           Upload Property Photos
//         </h1>
//         <p className="text-gray-500 mt-2">
//           Properties with pictures have higher visibility.
//         </p>
//       </div>
//       <div className="flex justify-between w-full mb-2 items-center">
//         <h1 className="text-2xl text-gray-800">Add Photos</h1>
//         <span className="text-sm bg-red-100 py-1 px-3 rounded-lg">
//           {values.images.length}/{10}
//         </span>
//       </div>
//       <FormPhotoUpload
//         name="images"
//         noPhotosName="noPhotos"
//         maxPhotos={10}
//         showPhotoCount={false}
//         showNoPhotosCheckbox={true}
//         className="mb-6"
//         disabled={disabled}
//       />
//     </div>
//   );
// };

export default GalleryForm;
