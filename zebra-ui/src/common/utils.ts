import { CDN_BASE_URL, PLACEHOLDER_IMAGE } from "./constants";

const formatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
  notation: "compact",
  compactDisplay: "long",
});

export const formatINRCurrency = (value: number) => {
  return value ? formatter.format(value).replace("T", "K") : "-";
};

export const extractS3KeyFromUrl = (s3Url: string) => {
  try {
    // Create a URL object
    const url = new URL(s3Url);

    // Get the pathname, which contains "/<s3key>"
    let s3Key = url.pathname;

    // Remove the leading slash
    if (s3Key.startsWith("/")) {
      s3Key = s3Key.slice(1);
    }

    return s3Key;
  } catch (error) {
    console.error("Invalid S3 URL:", error);
    return null;
  }
};

export const pascalCase = (str: string) => {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : "-";
};

/**
 * Sanitizes a phone number by removing country code (+91) and non-digit characters
 * @param phoneNumber - The phone number to sanitize
 * @returns The sanitized phone number (digits only)
 */
export const sanitizePhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return phoneNumber;
  return phoneNumber.replace(/^\+91/, "").replace(/\D/g, "");
};

/**
 * Generates a random UUID using the Web Crypto API
 * @returns A random UUID string (e.g., "550e8400-e29b-41d4-a716-446655440000")
 */
export const generateUUID = (): string => {
  return crypto.randomUUID();
};

/**
 * Extracts a FileData object from an image/file URL.
 *
 * @remarks
 * - Deduces file name from the URL path.
 * - Infers MIME type from common image extensions (png, webp, jpeg).
 *
 * @example
 * fileDataFromUrl("https://.../img.jpg");
 * // → { name: "img.jpg", type: "image/jpeg", webkitRelativePath: "" }
 */
export const fileDataFromUrl = (url: string) => {
  const pathname = new URL(url).pathname;
  const name = pathname.split("/").pop()!;
  const ext = name.split(".").pop()!.toLowerCase();

  const mime =
    ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";

  return { name, type: mime, webkitRelativePath: "" };
};

/**
 * Processes property images by adding CDN prefix and fallback
 * @param images - Array of image paths from API
 * @returns Array of full image URLs with at least one placeholder
 */
export function processPropertyImages(
  images: string[] | null | undefined,
): string[] {
  // If no images or empty array, return placeholder
  if (!images || images.length === 0) {
    return [PLACEHOLDER_IMAGE];
  }

  // Filter out any null/undefined/empty strings and add CDN prefix
  const processedImages = images
    .filter((img) => img && img.trim() !== "")
    .map((img) => `${CDN_BASE_URL}/${img}`);

  // If all images were invalid, return placeholder
  return processedImages.length > 0 ? processedImages : [PLACEHOLDER_IMAGE];
}
