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

const GalleryClient: React.FC = () => {
  const { values, setFieldError, setErrors } = useFormikContext<FormValues>();
  const formState = useSelector((state: RootState) => state.editProperty.form);
  const previousImages = useSelector(
    (state: RootState) => state.editProperty.propertyImages,
  );
  const deletedImages = useSelector(
    (state: RootState) => state.editProperty.deletedImages,
  );
  const isFormValid = formState?.isValid;
  const dispatch = useDispatch();
  const previousImagesRef = useRef(previousImages);

  const imagesString = JSON.stringify(values.images);
  const noPhotosString = JSON.stringify(values.noPhotos);

  // Initialize ref when images are first loaded
  useEffect(() => {
    if (values.images.length > 0 && previousImagesRef.current.length === 0) {
      previousImagesRef.current = values.images;
    }
  }, [imagesString, values.images]);

  // Track deleted images
  useEffect(() => {
    const currentImages = values.images;
    const prevImages = previousImagesRef.current;

    // Only track deletions if ref is initialized (not the first render)
    if (prevImages.length === 0) {
      return;
    }

    // Find images that were deleted
    const deleted = prevImages.filter(
      (prevImage) =>
        !currentImages.some((currImage) => currImage.id === prevImage.id),
    );

    // Only dispatch if there are deleted images
    if (deleted.length > 0) {
      const existingDeletedIds = new Set(
        deletedImages.map((image) => image.id),
      );

      const mergedDeleted = [
        ...deletedImages,
        ...deleted.filter((image) => !existingDeletedIds.has(image.id)),
      ];

      dispatch(setDeletedImages({ deletedImages: mergedDeleted }));
      dispatch(
        setFormData({
          data: {
            images: currentImages,
            noPhotos: values.noPhotos,
          },
        }),
      );
    }

    // Update the ref
    previousImagesRef.current = currentImages;
  }, [imagesString, values.images, deletedImages, dispatch, values.noPhotos]);

  useEffect(() => {
    const validateAndDispatch = async () => {
      try {
        await gallerySchema.validate(values, { abortEarly: false });
        // Clear any previous errors
        setErrors({});

        console.log("Images", values.images);
        // Set form data in the store
        dispatch(setPropertyImages({ propertyImages: values.images }));
        dispatch(
          setFormData({
            data: {
              images: values.images,
              noPhotos: values.noPhotos,
            },
          }),
        );
        // Form is valid
        if (!isFormValid) {
          dispatch(setFormValidity({ isValid: true }));
        }
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          // Clear any previous errors
          setErrors({});
          // Set individual field errors
          err.inner.forEach((validationError) => {
            if (validationError.path && validationError.message) {
              setFieldError(validationError.path, validationError.message);
            }
          });
          // Form is invalid
          if (isFormValid) {
            dispatch(setFormValidity({ isValid: false }));
          }
        }
      }
    };

    validateAndDispatch();
  }, [
    imagesString,
    noPhotosString,
    dispatch,
    setErrors,
    setFieldError,
    isFormValid,
    values,
  ]);

  return (
    <>
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
      />
    </>
  );
};

export default GalleryClient;
