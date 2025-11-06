export const BASE_API_URL =
  process.env.NEXT_PUBLIC_HOUSECLAY_API_BASE_URL ||
  "https://apis.houseclay.com/api";
export const SUPPORT_EMAIL = "support@houseclay.com";
export const SUPPORT_CONTACT = "+91 7892014327";

// media links
export const HOUSECLAY_FACEBOOK =
  "https://www.facebook.com/profile.php?id=61568620051028";
export const HOUSECLAY_INSTAGRAM = "https://www.instagram.com/houseclaydotcom";
export const HOUSECLAY_LINKEDIN = "https://in.linkedin.com/company/houseclay";

export const BENGALURU_LOCATION = { lat: 12.9716, lng: 77.5946 };

export const CDN_BASE_URL = "https://cdn.houseclay.com";
export const PLACEHOLDER_IMAGE =
  "/optimizedIcons/medium/property-placeholder.svg";

// 1x1 transparent GIF — tiny, inline, no network
export const FALLBACK_IMG = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";

// Popular Neighbourhoods
export const NEIGHBOURHOODS = [
  { name: "Bellandur", imgURL: "" },
  { name: "Sarjapur", imgURL: "" },
  { name: "Kadubeesanahalli", imgURL: "" },
  { name: "K R Puram", imgURL: "" },
  { name: "Whitefield", imgURL: "" },
  { name: "Marathahalli", imgURL: "" },
  { name: "BTM Layout", imgURL: "" },
  { name: "HSR Layout", imgURL: "" },
];
