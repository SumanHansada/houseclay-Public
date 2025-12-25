"use client";

import { motion } from "framer-motion";
import {
  Image as ImageIcon,
  Lightbulb,
  MoreHorizontal,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

import { FileData } from "@/interfaces/FileData";
import { PropertyImage } from "@/interfaces/PropertyImage";

interface PhotoUploadProps {
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
  // Formik props
  value: PropertyImage[];
  onChange: (value: PropertyImage[]) => void;
  onBlur?: () => void;
  error?: string;
  // noPhotos field props
  noPhotosValue?: boolean;
  onNoPhotosChange?: (value: boolean) => void;
  onNoPhotosBlur?: () => void;
  noPhotosError?: string;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  name,
  id,
  label,
  photoCountName,
  noPhotosName = "noPhotos",
  maxPhotos = 10,
  showPhotoCount = true,
  showNoPhotosCheckbox = true,
  className = "",
  placeholder = "Drag & drop files or",
  tipText = "Properties with picture get more visibility",
  disabled = false,
  value,
  onChange,
  onBlur,
  error,
  noPhotosValue = false,
  onNoPhotosChange,
  onNoPhotosBlur,
  noPhotosError,
}) => {
  // UI state
  const [hoveredPhotoId, setHoveredPhotoId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Get the current photos value
  const photos = value || [];

  // Ensure cover photo is always at first index on load
  useEffect(() => {
    if (!value || value.length === 0) return;

    const coverPhotoIndex = value.findIndex((photo) => photo.isCover);

    // If cover photo exists but is not at index 0, normalize the array
    if (coverPhotoIndex > 0) {
      const coverPhoto = value[coverPhotoIndex];
      const otherPhotos = value.filter((_, index) => index !== coverPhotoIndex);
      const normalizedPhotos = [
        { ...coverPhoto, isCover: true },
        ...otherPhotos.map((photo) => ({ ...photo, isCover: false })),
      ];
      onChange(normalizedPhotos);
    }
  }, [value, onChange]);

  // Handle file drop/selection
  const onDrop = (acceptedFiles: File[]) => {
    if (photos.length + acceptedFiles.length > maxPhotos) {
      alert(`You can only upload up to ${maxPhotos} photos.`);
      return;
    }

    const formatFileName = (file: File) => {
      const now = new Date();
      const pad = (value: number) => value.toString().padStart(2, "0");
      const datePart = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
      const timePart = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
      const uuidPart = crypto.randomUUID().slice(0, 8);
      const extensionMatch = file.name?.split(".").pop();
      const extension = extensionMatch ? extensionMatch.toLowerCase() : "";
      return extension
        ? `${datePart}_${timePart}_${uuidPart}.${extension}`
        : `${datePart}_${timePart}_${uuidPart}`;
    };

    const newPhotos = acceptedFiles.map((file: File, index: number) => {
      const formattedName = formatFileName(file);
      // Extract only the properties we need from the File object
      const fileData: FileData = {
        name: formattedName,
        type: file.type,
        webkitRelativePath: file.webkitRelativePath,
      };

      return {
        id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        file: fileData,
        url: URL.createObjectURL(file),
        isCover: photos.length === 0 && index === 0, // Only set first photo as cover if there were no photos before
      };
    });

    onChange([...photos, ...newPhotos]);

    // Update photo count field if provided
    if (photoCountName) {
      const photoCountField = document.querySelector(
        `[name="${photoCountName}"]`,
      ) as HTMLInputElement;
      if (photoCountField) {
        photoCountField.value = String([...photos, ...newPhotos].length);
      }
    }

    // Clear noPhotos field when photos are added
    onNoPhotosChange?.(false);
  };

  // Configure dropzone
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp", ".heic"],
    },
    onDrop,
    disabled: noPhotosValue || disabled,
  });

  // Make a photo the cover
  const handleMakeCover = (photoId: string) => {
    // Find the photo to make cover
    const photoToMakeCover = photos.find((photo) => photo.id === photoId);
    if (!photoToMakeCover) return;

    // Create new array with the cover photo first, followed by all other photos
    const updatedPhotos = [
      { ...photoToMakeCover, isCover: true },
      ...photos
        .filter((photo) => photo.id !== photoId)
        .map((photo) => ({
          ...photo,
          isCover: false,
        })),
    ];

    onChange(updatedPhotos);
    setActiveMenuId(null);
  };

  // Delete a photo
  const handleDeletePhoto = (photoId: string) => {
    const photoToDelete = photos.find((p) => p.id === photoId);
    const wasCover = photoToDelete?.isCover || false;

    const filteredPhotos = photos.filter((photo) => photo.id !== photoId);

    // If the deleted photo was the cover and there are remaining photos, make the first remaining photo the cover
    if (wasCover && filteredPhotos.length > 0) {
      filteredPhotos[0] = { ...filteredPhotos[0]!, isCover: true };
    }

    onChange(filteredPhotos);
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
    onNoPhotosChange?.(e.target.checked);
  };

  // Determine UI state classes
  const disabledClass =
    noPhotosValue || disabled ? "opacity-50 pointer-events-none" : "";

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={id || name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      {showPhotoCount && (
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-500">
            {photos.length}/{maxPhotos}
          </span>
        </div>
      )}

      <div className={disabledClass}>
        {photos.length === 0 ? (
          <>
            <div
              {...getRootProps()}
              className={`rounded-lg p-8 md:p-16 mb-4 cursor-pointer bg-gray-50 flex flex-col items-center gap-6 ${
                noPhotosValue || disabled ? "cursor-not-allowed" : ""
              }`}
              onBlur={onBlur}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col gap-4">
                <p className="text-gray-600">{placeholder}</p>
                <button
                  type="button"
                  className="border border-gray-600 rounded-xl px-6 py-2 hover:bg-gray-50"
                  disabled={noPhotosValue || disabled}
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
                className={`border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center aspect-square object-cover ${
                  noPhotosValue || disabled
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                onBlur={onBlur}
              >
                <input {...getInputProps()} />
                <ImageIcon size={40} className="text-gray-400" />
              </div>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center aspect-square object-cover ${
                  noPhotosValue || disabled
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                onBlur={onBlur}
              >
                <input {...getInputProps()} />
                <ImageIcon size={40} className="text-gray-400" />
              </div>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center aspect-square object-cover ${
                  noPhotosValue || disabled
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                onBlur={onBlur}
              >
                <input {...getInputProps()} />
                <ImageIcon size={40} className="text-gray-400" />
              </div>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center aspect-square object-cover ${
                  noPhotosValue || disabled
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                onBlur={onBlur}
              >
                <input {...getInputProps()} />
                <Plus size={40} className="text-gray-400" />
              </div>
            </div>
          </>
        ) : (
          <div
            className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6"
            onClick={() => setActiveMenuId(null)}
          >
            {photos.map((photo) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative rounded-md overflow-hidden"
                onMouseEnter={() => setHoveredPhotoId(photo.id)}
                onMouseLeave={() => {
                  if (activeMenuId !== photo.id) {
                    setHoveredPhotoId(null);
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenuId(null);
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Image
                    src={photo.url}
                    alt={photo.file.name || "Property"}
                    width={300}
                    height={300}
                    quality={95}
                    className={`aspect-square w-full object-cover transition-all duration-300 ${hoveredPhotoId === photo.id ? "blur-sm" : ""}`}
                  />
                </motion.div>

                {photo.isCover && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute flex top-2 left-2 text-gray-500 gap-2 bg-white text-sm p-2 rounded-lg"
                  >
                    <Star
                      size={20}
                      className="text-yellow-600 bg-yellow-200 rounded-full"
                    />
                    Cover Image
                  </motion.div>
                )}

                {(hoveredPhotoId === photo.id || activeMenuId === photo.id) && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    type="button"
                    className="absolute top-2 right-2 bg-white rounded-full shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMenu(photo.id);
                    }}
                    disabled={noPhotosValue || disabled}
                  >
                    <MoreHorizontal size={28} />
                  </motion.button>
                )}

                {activeMenuId === photo.id && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-10 right-2 bg-white rounded-lg shadow-lg p-2 z-10"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      className="w-full text-left text-gray-500 px-2 py-1 hover:bg-gray-100 text-sm flex gap-2 items-center"
                      onClick={() => handleMakeCover(photo.id)}
                      disabled={photo.isCover || noPhotosValue || disabled}
                    >
                      <Star size={20} className="text-yellow-500" />
                      Make Cover
                    </motion.button>
                    <div className="divider border-t"></div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      className="w-full text-left text-gray-500 px-2 py-1 hover:bg-gray-100 text-sm flex gap-2 items-center"
                      onClick={() => handleDeletePhoto(photo.id)}
                      disabled={noPhotosValue || disabled}
                    >
                      <Trash2 size={20} className="text-red-500" />
                      Delete
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            ))}

            {photos.length < maxPhotos && (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center aspect-square w-full object-cover ${
                  noPhotosValue || disabled
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                onBlur={onBlur}
              >
                <input {...getInputProps()} />
                <Plus size={56} className="text-gray-400" />
              </div>
            )}
          </div>
        )}
      </div>

      {showNoPhotosCheckbox && (
        <div className="flex items-center my-4 gap-2">
          <input
            type="checkbox"
            id={noPhotosName}
            name={noPhotosName}
            checked={noPhotosValue}
            onChange={handleNoPhotosChange}
            onBlur={onNoPhotosBlur}
            className="h-5 w-5 accent-red-500"
            disabled={photos.length > 0 || disabled} // Disable checkbox if photos exist or component is disabled
          />
          <label htmlFor={noPhotosName} className="text-gray-600 text-lg">
            I don&apos;t have photos now
          </label>
        </div>
      )}

      {noPhotosError ? (
        <div className="text-red-500 text-sm mt-1">{noPhotosError}</div>
      ) : null}

      {error ? <div className="text-red-500 text-sm mt-1">{error}</div> : null}
    </div>
  );
};

export default PhotoUpload;
