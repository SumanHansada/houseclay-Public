"use client";
import Image, { ImageProps } from "next/image";
import { memo, useState } from "react";

import { placeholderImageURL } from "@/common/cdnURLs";

import RemoteSvg from "./RemoteSvg";

interface ImageWithLoaderProps extends Omit<ImageProps, "src" | "alt"> {
  src: string;
  alt: string;
  className?: string;
  rounded?: boolean;
  fill?: boolean;
  loading?: "eager" | "lazy" | undefined;
  priority?: boolean;
}

const ImageWithLoader = memo(function ImageWithLoader({
  src,
  alt,
  className = "",
  rounded,
  fill,
  loading,
  priority = false,
  ...rest
}: ImageWithLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

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
      {/* Pulse loader */}
      {isLoading && (
        <div
          className={`absolute inset-0 h-full w-full bg-gray-300 animate-pulse ${rounded ? "rounded-lg" : ""}`}
        />
      )}

      {/* Image */}
      {src && (
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
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-200 rounded-xl flex flex-col gap-2 items-center justify-center">
          <RemoteSvg
            src={placeholderImageURL}
            className="w-full h-full absolute inset-0 object-cover"
          />
        </div>
      )}
    </div>
  );
});

export default ImageWithLoader;
