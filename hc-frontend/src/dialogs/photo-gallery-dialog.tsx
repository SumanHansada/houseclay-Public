"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { ColumnsPhotoAlbum } from "react-photo-album";

import { Button } from "@/base-components";
import { Dialog, DialogContent, DialogHeader } from "@/components/Dialog";
import { MobileHeader } from "@/layout-components";
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
      entryAnimation={isMobile ? "animate-slide-in-bottom" : "animate-fade-in"}
      exitAnimation={isMobile ? "animate-slide-out-bottom" : "animate-fade-out"}
    >
      <DialogHeader className="-mx-4">
        <MobileHeader className="relative">
          <MobileHeader.Title>Photo Gallery</MobileHeader.Title>
          <MobileHeader.RightAction>
            <Button
              variant="secondary"
              size="custom"
              className="rounded-full p-1"
              onClick={onClose}
            >
              <X size={24} />
            </Button>
          </MobileHeader.RightAction>
        </MobileHeader>
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
