import { useField } from "formik";
import React from "react";

import PhotoUpload from "@/base-components/PhotoUpload";
import { PropertyImage } from "@/interfaces/PropertyImage";

interface FormPhotoUploadProps {
  name: string;
  id?: string;
  label?: string;
  photoCountName?: string;
  noPhotosName?: string;
  maxPhotos?: number;
  showPhotoCount?: boolean;
  showNoPhotosCheckbox?: boolean;
  className?: string;
  placeholder?: string;
  tipText?: string;
  disabled?: boolean;
}

const FormPhotoUpload: React.FC<FormPhotoUploadProps> = ({
  name,
  id,
  label,
  noPhotosName = "noPhotos",
  ...props
}) => {
  // Field hook for photos
  const [field, meta, helpers] = useField<PropertyImage[]>(name);

  // Field hook for noPhotos checkbox
  const [noPhotosField, noPhotosMeta, noPhotosHelpers] =
    useField<boolean>(noPhotosName);

  // Enhanced onChange handler that also clears noPhotos when photos are added
  const handlePhotosChange = (newPhotos: PropertyImage[]) => {
    helpers.setValue(newPhotos);

    // Clear noPhotos field when photos are added
    if (newPhotos.length > 0 && noPhotosField.value) {
      noPhotosHelpers.setValue(false);
    }
  };

  const handleNoPhotosChange = (value: boolean) => {
    noPhotosHelpers.setValue(value);
  };

  return (
    <PhotoUpload
      name={name}
      id={id}
      label={label}
      noPhotosName={noPhotosName}
      value={field.value || []}
      onChange={handlePhotosChange}
      onBlur={() => helpers.setTouched(true)}
      error={meta.touched && meta.error ? meta.error : ""}
      noPhotosValue={noPhotosField.value}
      onNoPhotosChange={handleNoPhotosChange}
      onNoPhotosBlur={() => noPhotosHelpers.setTouched(true)}
      noPhotosError={
        noPhotosMeta.touched && noPhotosMeta.error ? noPhotosMeta.error : ""
      }
      {...props}
    />
  );
};

export default FormPhotoUpload;
