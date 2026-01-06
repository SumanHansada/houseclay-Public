import { format, parseISO } from "date-fns";

import { placeholderImageURL } from "./cdnURLs";
import { CDN_BASE_URL, CITY_LAT_LNG_MAPPING } from "./constants";
import { PropertyCategory } from "./enums";

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
  return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "-";
};

export const upperCase = (str: string) => {
  return str ? str.toUpperCase() : "-";
};

export function shimmer(width: number, height: number) {
  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" 
      xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#eeeeee" offset="20%" />
          <stop stop-color="#dddddd" offset="50%" />
          <stop stop-color="#eeeeee" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="#eeeeee" />
      <rect id="r" width="${width}" height="${height}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${width}" to="${width}" dur="1s" repeatCount="indefinite" />
    </svg>
  `;
}

export function toBase64(str: string) {
  return typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);
}

export const formatBhkType = (bhkType: string) => {
  return bhkType.replace(/BHK/g, "");
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
 * Converts ISO date string to readable format (e.g., "July 31, 2025")
 * @param isoDateString - The ISO date string (e.g., "2025-07-31T18:30:00.000+00:00")
 * @returns The formatted date string (e.g., "July 31, 2025")
 */
export const formatDateToReadable = (isoDateString: string): string => {
  if (!isoDateString) return "-";

  try {
    const date = parseISO(isoDateString);
    return format(date, "MMM d, yyyy");
  } catch (error) {
    console.error("Invalid date format:", error);
    return "-";
  }
};

/**
 * Returns 1–2 capital letters representing a person’s name.
 *
 * @remarks
 * - If the name has one word, returns the first letter.
 * - If it has two or more words, returns the initials of the first two.
 * - Whitespace is trimmed; `undefined` or empty input yields `""`.
 *
 * @example
 * getInitials("Amit Kumar");   // "AK"
 * getInitials("Amit");         // "A"
 * getInitials("");             // ""
 */
export const getInitials = (fullName: string | undefined) => {
  if (!fullName) return "";
  const parts = fullName.trim().split(/\s+/);
  return parts.length === 1
    ? parts[0][0].toUpperCase()
    : (parts[0][0] + parts[1][0]).toUpperCase();
};

/**
 * Generates a random UUID using the Web Crypto API
 * @returns A random UUID string (e.g., "550e8400-e29b-41d4-a716-446655440000")
 */
export const generateUUID = (): string => {
  return crypto.randomUUID();
};

/**
 * Helper function to format date from ISO string to DD-MMM-YYYY (UTC format)
 * @param isoString - The ISO string to format
 * @returns The formatted date string (e.g., "25-Jun-2025")
 */
export const formatUTCDateDisplay = (isoString: string): string => {
  const date = new Date(isoString);
  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-US", {
    month: "short",
    timeZone: "UTC",
  });
  const year = date.getUTCFullYear();
  return `${day}-${month}-${year}`;
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
  // const name = url;
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
    return [placeholderImageURL];
  }

  // Filter out any null/undefined/empty strings and add CDN prefix
  const processedImages = images
    .filter((img) => img && img.trim() !== "")
    .map((img) => `${CDN_BASE_URL}/${img}`);

  // If all images were invalid, return placeholder
  return processedImages.length > 0 ? processedImages : [placeholderImageURL];
}

/**
 * Returns true if the provided value is a valid member of the string enum.
 *
 * @remarks
 * Used as a type guard for validating string enum values at runtime.
 *
 * @example
 * isEnumValue(PropertyCategory, "RENT"); // true
 * isEnumValue(PropertyCategory, "xyz");  // false
 */
export function isEnumValue<E extends Record<string, string>>(
  enumObj: E,
  value: unknown,
): value is E[keyof E] {
  return Object.values(enumObj).includes(value as string);
}

/* Validate Images */
export const validateImages = async (
  imageUrls: string[],
): Promise<string[]> => {
  if (imageUrls.length === 0) return [];

  const validationPromises = imageUrls.map(
    (url) =>
      new Promise<boolean>((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
      }),
  );

  const results = await Promise.all(validationPromises);
  return imageUrls.filter((_, i) => results[i]);
};

/**
 * Sanitize Phone Number but keep the country code
 * */
export const sanitizePhoneKeepCountryCode = (phoneNumber: string): string => {
  if (!phoneNumber) return phoneNumber;
  return phoneNumber.replace(/[\s\-\(\)]/g, "").replace(/^\+?0+/, "+") || "";
};

export const openMapsDirections = (
  origin: string,
  destination: string,
): void => {
  if (!origin || !destination) return;

  const originEncoded = encodeURIComponent(origin);
  const destinationEncoded = encodeURIComponent(destination);

  const isIOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);

  if (isIOS) {
    // 1️⃣ Try Google Maps app
    window.location.href = `comgooglemaps://?saddr=${originEncoded}&daddr=${destinationEncoded}&directionsmode=driving`;

    // 2️⃣ Fallback → Apple Maps
    setTimeout(() => {
      window.location.href = `maps://?saddr=${originEncoded}&daddr=${destinationEncoded}&dirflg=d`;
    }, 1200);

    // 3️⃣ Final fallback → Web
    setTimeout(() => {
      window.location.href = `https://www.google.com/maps/dir/?api=1&origin=${originEncoded}&destination=${destinationEncoded}&travelmode=driving`;
    }, 2400);
  } else {
    // Android + Desktop → Google Maps (opens app if installed)
    window.location.href = `https://www.google.com/maps/dir/?api=1&origin=${originEncoded}&destination=${destinationEncoded}&travelmode=driving`;
  }
};

/**
 * Precomputed array of city options derived from CITY_LAT_LNG_MAPPING.
 * Each option includes an 'id' (lowercase city name) and 'label' (PascalCased display name).
 * Used internally for default city selection in search utilities.
 */
export const CITY_OPTIONS = Object.keys(CITY_LAT_LNG_MAPPING).map((city) => ({
  id: city,
  label: pascalCase(city),
}));

/**
 * Generates a full navigation href (path + query string) for property search links.
 *
 * If the current pathname is '/property-search', this function preserves the existing search parameters
 * (such as location via lat/lon or city) and overrides only the 'propertyCategory' parameter.
 * If not on the property-search page, it creates a new set of parameters starting with a default city.
 *
 * In both cases, it ensures that location parameters are present: if 'lat' and 'lon' are missing,
 * it falls back to setting 'city' to the default (the first city in CITY_LAT_LNG_MAPPING) if not already set.
 * Finally, it sets the provided 'propertyCategory' (converted to lowercase) and returns the full href string
 * starting with '/property-search?'.
 *
 * This helps maintain user context (e.g., current location filters) when switching categories on the search page,
 * while providing sensible defaults for navigation from other pages.
 *
 * @param category - The property category enum value to set (e.g., PropertyCategory.RENT).
 * @param pathname - The current pathname from usePathname().
 * @param searchParams - The current URLSearchParams from useSearchParams().
 * @returns The full href string (e.g., '/property-search?lat=12.34&lon=56.78&propertyCategory=rent').
 */
export const generatePropertySearchHref = (
  category: PropertyCategory,
  pathname: string,
  searchParams: URLSearchParams,
) => {
  let newParams: URLSearchParams;

  if (pathname === "/property-search") {
    // Preserve current params (including lat/lon or city) and override category
    newParams = new URLSearchParams(searchParams.toString());
  } else {
    newParams = new URLSearchParams();
  }

  // Default city (e.g., first option 'Bengaluru')
  const defaultCity = CITY_OPTIONS[0].id;

  // Ensure location is always set
  if (!newParams.has("lat") || !newParams.has("lon")) {
    if (!newParams.has("city")) {
      newParams.set("city", defaultCity);
    }
  }

  // Set category in lowercase (enum values are uppercase)
  if (category !== PropertyCategory.NONE) {
    newParams.set("propertyCategory", category.toLowerCase());
  }

  return `/property-search?${newParams.toString()}`;
};
