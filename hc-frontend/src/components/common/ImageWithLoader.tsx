// components/ImageWithSkeleton.tsx
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
  rounded = true,
  fill,
  loading,
  priority,
  ...rest
}: ImageWithLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      className={`relative ${fill ? "w-full h-full" : ""} ${className}`}
      style={!fill ? { width: rest.width, height: rest.height } : {}}
    >
      {isLoading && (
        <Skeleton
          height={skeletonHeight ?? (fill ? "100%" : rest.height)}
          width={skeletonWidth ?? (fill ? "100%" : rest.width)}
          borderRadius={rounded ? 8 : 0}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        />
      )}

      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={fill ? undefined : rest.width}
        height={fill ? undefined : rest.height}
        onLoad={() => setIsLoading(false)}
        loading={loading}
        priority={priority}
        className={`object-cover transition-opacity duration-500 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        {...rest}
      />
    </div>
  );
}
