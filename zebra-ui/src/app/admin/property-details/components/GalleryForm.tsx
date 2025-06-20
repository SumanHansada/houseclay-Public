"use client";

import FormPhotoUpload from "@/components/common/FormPhotoUpload";
import { PropertyDetailsFormValues } from "@/interfaces/Property";
import { FormType } from "@/store/listPropertySlice";
import { useFormikContext } from "formik";

interface GalleryFormProps {
  disabled: boolean;
  type: "rent" | "resale" | "flatmate";
}

const GalleryForm: React.FC<GalleryFormProps> = ({ disabled, type }) => {
  const formKey = `${type}Form` as FormType;
  const { values } = useFormikContext<PropertyDetailsFormValues>();
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
        // disabled={disabled}
      />
    </div>
  );
};

export default GalleryForm;
