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

  let svgText = await res.text();
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

  // TODO:
  // Server Side: Go to your S3 bucket/CDN settings, select the files, edit metadata, and set Content-Type to image/svg+xml
  // Warn on unexpected content-type but don't fail (for trusted sources)
  // if (!ct.includes("image/svg+xml")) {
  //   console.warn(
  //     `Unexpected content-type for SVG[${url}]: ${ct}. Proceeding anyway.`,
  //   );
  // }

  /**
   * FIX: Remove internal clip-paths
   * Many automated exports include restrictive clip-paths (like starting at 0.5px)
   * that cut off the icon edges. We strip the attribute to reveal the full icon.
   */
  svgText = svgText.replace(/clip-path="url\(.*?\)"/g, "");

  return svgText;
};

/**
 * Renders a remote SVG URL as inline SVG markup.
 * Uses React Query for efficient caching and to avoid unnecessary renders.
 * NOTE: Only use with trusted SVG sources.
 */
const RemoteSvg: React.FC<RemoteSvgProps> = ({ src, className }) => {
  const { data: rawSvg, error } = useQuery({
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

  if (!rawSvg) return null;

  return (
    <span className={className} dangerouslySetInnerHTML={{ __html: rawSvg }} />
  );
};

export default RemoteSvg;
