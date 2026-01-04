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
      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciPjxzdG9wIHN0b3AtY29sb3I9IiNmM2Y0ZjYiIG9mZnNldD0iMjAlIiAvPjxzdG9wIHN0b3AtY29sb3I9IiNlNWU3ZWIiIG9mZnNldD0iNTAlIiAvPjxzdG9wIHN0b3AtY29sb3I9IiNmM2Y0ZjYiIG9mZnNldD0iNzAlIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjNmNGY2IiAvPjxyZWN0IGlkPSJyIiB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0idXJsKCNnKSIgLz48YW5pbWF0ZSB4bGluazpocmVmPSIjciIgYXR0cmlidXRlTmFtZT0ieCIgZnJvbT0iLTQwMCIgdG89IjQwMCIgZHVyPSIxLjJzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgLz48L3N2Zz4="
    />
  );
}
