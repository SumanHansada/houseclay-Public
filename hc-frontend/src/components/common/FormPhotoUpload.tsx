import { useField } from "formik";
import {
  Image,
  Lightbulb,
  MoreHorizontal,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

// Types
export interface PropertyPhoto {
  id: string;
  file: File;
  url: string;
  isCover: boolean;
}

interface FormPhotoUploadProps {
  name: string;
  photoCountName?: string;
  noPhotosName?: string;
  maxPhotos?: number;
  showPhotoCount?: boolean;
  showNoPhotosCheckbox?: boolean;
  className?: string;
  placeholder?: string;
  tipText?: string;
}

const FormPhotoUpload: React.FC<FormPhotoUploadProps> = ({
  name,
  photoCountName,
  noPhotosName = "noPhotos",
  maxPhotos = 10,
  showPhotoCount = true,
  showNoPhotosCheckbox = true,
  className = "",
  placeholder = "Drag & drop files or",
  tipText = "Properties with picture get more visibility",
}) => {
  // Field hooks
  const [field, meta, helpers] = useField<PropertyPhoto[]>(name);
  const [, , noPhotosHelpers] = useField(noPhotosName);

  // UI state
  const [hoveredPhotoId, setHoveredPhotoId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Get the current photos value
  const photos = field.value || [];

  // Handle file drop/selection
  const onDrop = (acceptedFiles: File[]) => {
    if (photos.length + acceptedFiles.length > maxPhotos) {
      alert(`You can only upload up to ${maxPhotos} photos.`);
      return;
    }

    const newPhotos = acceptedFiles.map((file) => ({
      id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      url: URL.createObjectURL(file),
      isCover: photos.length === 0, // First photo is the cover by default
    }));

    helpers.setValue([...photos, ...newPhotos]);

    // Update photo count field if provided
    if (photoCountName) {
      const photoCountField = document.querySelector(
        `[name="${photoCountName}"]`,
      ) as HTMLInputElement;
      if (photoCountField) {
        photoCountField.value = String([...photos, ...newPhotos].length);
      }
    }

    // Set noPhotos to false if we have photos
    noPhotosHelpers.setValue(false);
  };

  // Configure dropzone
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    onDrop,
  });

  // Make a photo the cover
  const handleMakeCover = (photoId: string) => {
    const updatedPhotos = photos.map((photo) => ({
      ...photo,
      isCover: photo.id === photoId,
    }));
    helpers.setValue(updatedPhotos);
    setActiveMenuId(null);
  };

  // Delete a photo
  const handleDeletePhoto = (photoId: string) => {
    const photoToDelete = photos.find((p) => p.id === photoId);
    const wasCover = photoToDelete?.isCover || false;

    const filteredPhotos = photos.filter((photo) => photo.id !== photoId);

    // If the deleted photo was the cover, make the first remaining photo the cover
    if (wasCover && filteredPhotos.length > 0) {
      filteredPhotos[0].isCover = true;
    }

    helpers.setValue(filteredPhotos);
    setActiveMenuId(null);

    // Update photo count field if provided
    if (photoCountName) {
      const photoCountField = document.querySelector(
        `[name="${photoCountName}"]`,
      ) as HTMLInputElement;
      if (photoCountField) {
        photoCountField.value = String(filteredPhotos.length);
      }
    }
  };

  // Toggle the menu for a photo
  const toggleMenu = (photoId: string) => {
    setActiveMenuId(activeMenuId === photoId ? null : photoId);
  };

  // Handle noPhotos checkbox change
  const handleNoPhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    noPhotosHelpers.setValue(e.target.checked);
  };

  // Get noPhotos value
  const getNoPhotosValue = () => {
    try {
      const noPhotosField = document.querySelector(
        `[name="${noPhotosName}"]`,
      ) as HTMLInputElement;
      return noPhotosField ? noPhotosField.checked : false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {showPhotoCount && (
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-500">
            {photos.length}/{maxPhotos}
          </span>
        </div>
      )}

      {photos.length === 0 ? (
        <>
          <div
            {...getRootProps()}
            className="rounded-lg p-16 mb-4 cursor-pointer bg-gray-50 flex flex-col items-center gap-6"
          >
            <input {...getInputProps()} />
            <div className="flex flex-col gap-4">
              <p className="text-gray-600">{placeholder}</p>
              <button
                type="button"
                className="border border-gray-600 rounded-xl px-6 py-2 hover:bg-gray-50"
              >
                Browse File
              </button>
            </div>
            {tipText && (
              <div className="mt-4 bg-green-100 p-2 rounded-md inline-flex items-center">
                <span className="bg-teal-500 text-white px-3 py-1 rounded-lg mr-2 text-xs flex items-center">
                  <Lightbulb size={15} /> Tip
                </span>
                <span className="text-gray-600 text-sm">{tipText}</span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center aspect-square object-cover cursor-pointer"
            >
              <input {...getInputProps()} />
              <Image size={40} className="text-gray-400" />
            </div>
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center aspect-square object-cover cursor-pointer"
            >
              <input {...getInputProps()} />
              <Image size={40} className="text-gray-400" />
            </div>
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center aspect-square object-cover cursor-pointer"
            >
              <input {...getInputProps()} />
              <Image size={40} className="text-gray-400" />
            </div>
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center aspect-square object-cover cursor-pointer"
            >
              <input {...getInputProps()} />
              <Plus size={40} className="text-gray-400" />
            </div>
          </div>
        </>
      ) : (
        <div
          className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-6"
          onClick={() => setActiveMenuId(null)}
        >
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative rounded-md overflow-hidden"
              onMouseEnter={() => setHoveredPhotoId(photo.id)}
              onMouseLeave={() => {
                if (activeMenuId !== photo.id) {
                  setHoveredPhotoId(null);
                }
              }}
              onClick={() => {
                setActiveMenuId(null);
              }}
            >
              <img
                src={photo.url}
                alt="Property"
                className={`aspect-square w-full object-cover ${hoveredPhotoId === photo.id ? "blur-sm" : ""}`}
              />

              {photo.isCover && (
                <div className="absolute flex top-2 left-2 text-gray-500 gap-2 bg-white text-sm p-2 rounded-lg">
                  <Star
                    size={20}
                    className="text-yellow-600 bg-yellow-200 rounded-full"
                  />
                  Cover Image
                </div>
              )}

              {(hoveredPhotoId === photo.id || activeMenuId === photo.id) && (
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-white rounded-full shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMenu(photo.id);
                  }}
                >
                  <MoreHorizontal size={28} />
                </button>
              )}

              {activeMenuId === photo.id && (
                <div className="absolute top-10 right-2 bg-white rounded-lg shadow-lg p-2 z-10">
                  <button
                    type="button"
                    className="w-full text-left text-gray-500 px-2 py-1 hover:bg-gray-100 text-sm flex gap-2 items-center"
                    onClick={() => handleMakeCover(photo.id)}
                    disabled={photo.isCover}
                  >
                    <Star size={20} className="text-yellow-500" />
                    Make Cover
                  </button>
                  <div className="divider border-t"></div>
                  <button
                    type="button"
                    className="w-full text-left text-gray-500 px-2 py-1 hover:bg-gray-100 text-sm flex gap-2 items-center"
                    onClick={() => handleDeletePhoto(photo.id)}
                  >
                    <Trash2 size={20} className="text-red-500" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}

          {photos.length < maxPhotos && (
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center aspect-square w-full object-cover cursor-pointer"
            >
              <input {...getInputProps()} />
              <Plus size={56} className="text-gray-400" />
            </div>
          )}
        </div>
      )}

      {showNoPhotosCheckbox && (
        <div className="flex items-center my-4 gap-2">
          <input
            type="checkbox"
            id={noPhotosName}
            name={noPhotosName}
            checked={getNoPhotosValue()}
            onChange={handleNoPhotosChange}
            className="h-5 w-5 accent-red-500"
          />
          <label htmlFor={noPhotosName} className="text-gray-600 text-lg">
            I don&apos;t have photos now
          </label>
        </div>
      )}

      {meta.touched && meta.error ? (
        <div className="text-red-500 text-xs mt-1">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default FormPhotoUpload;
