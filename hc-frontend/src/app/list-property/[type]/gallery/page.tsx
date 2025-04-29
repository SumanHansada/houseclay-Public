"use client";

import { useFormikContext } from "formik";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormPhotoUpload from "@/components/common/FormPhotoUpload";
import { FormValues } from "@/interfaces/FormValues";
import {
  FormType,
  setFormValidity,
  setImages,
} from "@/store/listPropertySlice";
import { RootState } from "@/store/store";

export const dynamicParams = true;

const GalleryPage: React.FC = () => {
  const { values, setFieldError, setErrors } = useFormikContext<FormValues>();
  const params = useParams();
  const formKey = `${params?.type}Form` as FormType; // Optional: add type assertion
  const formState = useSelector(
    (state: RootState) => state.listProperty[formKey],
  );
  const isFormValid = formState?.isValid;
  const dispatch = useDispatch();

  const gallerySchema = Yup.object().shape({
    images: Yup.array().of(
      Yup.object().shape({
        description: Yup.string().optional(),
      }),
    ),
  });

  useEffect(() => {
    const validateAndDispatch = async () => {
      try {
        await gallerySchema.validate(values, { abortEarly: false });
        // Clear any previous errors
        setErrors({});
        // Set form data in the store
        dispatch(setImages({ type: formKey, images: values.images }));
        // Form is valid
        if (!isFormValid) {
          dispatch(setFormValidity({ type: formKey, isValid: true }));
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
            dispatch(setFormValidity({ type: formKey, isValid: false }));
          }
        }
      }
    };

    validateAndDispatch();
  }, [
    JSON.stringify(values.images),
    dispatch,
    formKey,
    setErrors,
    setFieldError,
  ]);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl text-gray-800">Upload Property Photos</h1>
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

export default GalleryPage;
