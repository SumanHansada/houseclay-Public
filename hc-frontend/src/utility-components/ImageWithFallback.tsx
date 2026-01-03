"use client";

import Image from "next/image";
import { useState } from "react";

import { placeholderImageURL } from "@/common/cdnURLs";

export default function ImageWithFallback({
  src,
  fallback = placeholderImageURL,
  ...props
}: {
  src: string;
  fallback?: string;
} & React.ComponentProps<typeof Image>) {
  const [currentSrc, setCurrentSrc] = useState(src);

  return (
    <Image
      {...props}
      src={currentSrc}
      onError={() => {
        if (currentSrc !== fallback) {
          setCurrentSrc(fallback);
        }
      }}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      placeholder="blur"
      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYwIiBoZWlnaHQ9IjI3MCIgZmlsbD0iI2YzZjRmNiIvPg=="
    />
  );
}
