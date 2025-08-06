import { format, parseISO } from "date-fns";

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
