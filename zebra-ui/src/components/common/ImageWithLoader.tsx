import "react-loading-skeleton/dist/skeleton.css";

import Image, { ImageProps } from "next/image";

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
  fill,
  loading,
  priority = false,
  ...rest
}: ImageWithLoaderProps) {
  return (
    <div
      className={`relative ${fill ? "w-full h-full" : ""} ${className}`}
      style={!fill ? { width: rest.width, height: rest.height } : {}}
    >
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={fill ? undefined : rest.width}
        height={fill ? undefined : rest.height}
        loading={loading}
        priority={priority}
        className={`object-cover ${className ?? ""}`}
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/D/PwAHggJ/P7ZqNwAAAABJRU5ErkJggg=="
        {...rest}
      />
    </div>
  );
}
