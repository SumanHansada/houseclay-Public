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
    />
  );
}
