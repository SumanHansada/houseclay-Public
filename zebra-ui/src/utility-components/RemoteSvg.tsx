"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";

interface RemoteSvgProps {
  src: string;
  className?: string;
}

/**
 * Fetches SVG content from a remote URL
 */
const fetchSvg = async (url: string): Promise<string> => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch SVG: ${res.statusText}`);
  }

  const svgText = await res.text();
  const ct = res.headers.get("content-type") || "";

  console.debug(
    `Fetched SVG from ${url}: content-type="${ct}", length=${svgText.length}`,
  );

  // Check for SVG XML declaration or root <svg> tag
  const trimmed = svgText.trim();
  if (!trimmed.startsWith("<svg") && !trimmed.startsWith("<?xml")) {
    throw new Error(
      `Invalid SVG content: Does not start with <svg or <?xml (content-type: ${ct})`,
    );
  }

  // Warn on unexpected content-type but don't fail (for trusted sources)
  if (!ct.includes("image/svg+xml")) {
    console.warn(`Unexpected content-type for SVG: ${ct}. Proceeding anyway.`);
  }

  return svgText;
};

/**
 * Renders a remote SVG URL as inline SVG markup.
 * Uses React Query for efficient caching and to avoid unnecessary renders.
 * NOTE: Only use with trusted SVG sources.
 */
const RemoteSvg: React.FC<RemoteSvgProps> = ({ src, className }) => {
  const { data: svg, error } = useQuery({
    queryKey: ["remote-svg", src],
    queryFn: () => fetchSvg(src),
    staleTime: Infinity, // SVGs don't change, cache forever
    gcTime: 24 * 60 * 60 * 1000, // Keep in cache for 24 hours
    retry: 1,
  });

  if (error) {
    console.error("RemoteSvg error", error);
    return null;
  }

  if (!svg) return null;

  return (
    <span className={className} dangerouslySetInnerHTML={{ __html: svg }} />
  );
};

export default RemoteSvg;
