import "react-loading-skeleton/dist/skeleton.css";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";

interface ImageWithLoaderProps extends Omit<ImageProps, "src" | "alt"> {
  src: string;
  alt: string;
  className?: string;
  skeletonHeight?: number;
  skeletonWidth?: number;
  rounded?: boolean;
  fill?: boolean;
  loading?: "eager" | "lazy" | undefined;
  priority?: boolean;
}

export default function ImageWithLoader({
  src,
  alt,
  className = "",
  skeletonHeight,
  skeletonWidth,
  rounded,
  fill,
  loading,
  priority = false,
  ...rest
}: ImageWithLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const skeletonStyles = {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div
      className={`relative ${fill ? "w-full h-full" : ""} ${className}`}
      style={!fill ? { width: rest.width, height: rest.height } : {}}
    >
      {/* Skeleton loader */}
      {isLoading && (
        <Skeleton
          height={skeletonHeight ?? (fill ? "100%" : rest.height)}
          width={skeletonWidth ?? (fill ? "100%" : rest.width)}
          borderRadius={rounded ? 8 : 0}
          style={skeletonStyles}
        />
      )}

      {/* Image */}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={fill ? undefined : rest.width}
        height={fill ? undefined : rest.height}
        loading={loading}
        priority={priority}
        className={`object-cover ${className ?? ""} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
        {...rest}
      />

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <div className="text-gray-500 text-sm">Failed to load image</div>
        </div>
      )}
    </div>
  );
}
