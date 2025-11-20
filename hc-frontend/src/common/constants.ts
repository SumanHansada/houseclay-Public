export const BASE_API_URL =
  process.env.NEXT_PUBLIC_HOUSECLAY_API_BASE_URL ||
  "https://apis.houseclay.com/api";

export const HOUSECLAY_SUPPORT = {
  email: "support@houseclay.com",
  phone: "+91 7892014327",
};

// media links
export const SOCIAL_MEDIA_LINKS = {
  facebook: "https://www.facebook.com/profile.php?id=61568620051028",
  instagram: "https://www.instagram.com/houseclaydotcom",
  linkedin: "https://in.linkedin.com/company/houseclay",
};

export const BENGALURU_LOCATION = { lat: 12.9716, lng: 77.5946 };

// Currently using Bellandur lat(12.9337127) and lng(77.6621937)
export const EXPLORE_LOCATION = { lat: 12.9337127, lng: 77.6621937 };

export const WEBSITE_BASE_URL = "https://houseclay.com";
export const CDN_BASE_URL = "https://cdn.houseclay.com";

export const PLACEHOLDER_IMAGE =
  "/optimizedIcons/medium/property-placeholder.svg";

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
