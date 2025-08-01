"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { ColumnsPhotoAlbum } from "react-photo-album";

import { Dialog, DialogContent, DialogHeader } from "@/components/Dialog";
import { useDeviceContext } from "@/providers/DeviceContextProvider";

interface PhotoGalleryDialogProps {
  id: string;
  images: string[];
  onClose: () => void;
}

const PhotoGalleryDialog: React.FC<PhotoGalleryDialogProps> = ({
  id,
  images,
  onClose,
}) => {
  const { isMobile } = useDeviceContext();
  const [_currentImageIndex, setCurrentImageIndex] = useState(0);

  // Transform images to react-photo-album format
  const photos = images.map((src, index) => ({
    src,
    width: 800,
    height: 600,
    alt: `Property image ${index + 1}`,
  }));

  const handlePhotoClick = ({ index }: { index: number }) => {
    setCurrentImageIndex(index);
  };

  return (
    <Dialog
      id={id}
      type={isMobile ? "fullscreen" : "card"}
      onClose={onClose}
      entryAnimation="animate-fade-in"
      exitAnimation="animate-fade-out"
    >
      <DialogHeader>
        <div className="flex border-b border-gray-200 h-[55px] items-center w-full justify-between py-4 px-6 max-md:py-2 max-md:px-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full hover:bg-gray-100 ml-auto max-md:border max-md:border-gray-200"
          >
            <X size={25} />
          </button>
        </div>
      </DialogHeader>
      <DialogContent>
        <div className="px-6 py-4 max-md:px-4 max-md:py-2">
          <div className="[&_.react-photo-album--photo]:cursor-pointer [&_.react-photo-album--photo]:transition-transform [&_.react-photo-album--photo:hover]:scale-105">
            <ColumnsPhotoAlbum
              photos={photos}
              columns={2}
              onClick={handlePhotoClick}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoGalleryDialog;
