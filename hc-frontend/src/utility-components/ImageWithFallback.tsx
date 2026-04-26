"use client";

import Image from "next/image";

import { placeholderImageURL } from "@/common/cdnURLs";
import { shimmer, toBase64 } from "@/common/utils";

const SHIMMER_BLUR_DATA_URL = `data:image/svg+xml;base64,${toBase64(shimmer(300, 400))}`;

export default function ImageWithFallback({
  src,
  fallback: _fallback = placeholderImageURL,
  ...props
}: {
  src: string;
  fallback?: string;
} & React.ComponentProps<typeof Image>) {
  return (
    <Image
      {...props}
      src={src}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      placeholder="blur"
      blurDataURL={SHIMMER_BLUR_DATA_URL}
    />
  );
}
