import "react-loading-skeleton/dist/skeleton.css";

import Image, { ImageProps } from "next/image";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (priority) {
      setIsLoading(false); // assume priority images load instantly
    }
  }, [priority]);

  const skeletonStyles: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1,
    opacity: isLoading ? 1 : 0,
    transition: "opacity 0.5s ease",
  };

  return (
    <div
      className={`relative ${fill ? "w-full h-full" : ""} ${className}`}
      style={!fill ? { width: rest.width, height: rest.height } : {}}
    >
      {!priority && isLoading && (
        <Skeleton
          height={skeletonHeight ?? (fill ? "100%" : rest.height)}
          width={skeletonWidth ?? (fill ? "100%" : rest.width)}
          borderRadius={rounded ? 8 : 0}
          style={skeletonStyles}
        />
      )}

      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={fill ? undefined : rest.width}
        height={fill ? undefined : rest.height}
        loading={loading}
        priority={priority}
        onLoad={(e) => {
          if (e.currentTarget.complete) {
            setIsLoading(false);
          }
        }}
        className={`object-cover ${className ?? ""}`}
        {...rest}
      />
    </div>
  );
}
