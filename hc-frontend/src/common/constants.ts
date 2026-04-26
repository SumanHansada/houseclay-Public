export const BASE_API_URL =
  process.env.NEXT_PUBLIC_HOUSECLAY_API_BASE_URL ||
  "https://apis.houseclay.com/api";

export const HOUSECLAY_SUPPORT = {
  name: "Arpit Biswas",
  email: "support@houseclay.com",
  phone: "+91 7892014327",
  address:
    "235, 2nd & 3rd Floor, 13th Cross Rd, Indira Nagar II Stage, Hoysala Nagar, Indiranagar, Bengaluru, Karnataka 560038",
};

// Media links
export const SOCIAL_MEDIA_LINKS = {
  facebook: "https://www.facebook.com/profile.php?id=61568620051028",
  instagram: "https://www.instagram.com/houseclaydotcom",
  linkedin: "https://in.linkedin.com/company/houseclay",
};

// Including country code
export const validPhoneNoLength = 8;

// Max Description length
export const maxDescLength = 1800;

export const BENGALURU_LOCATION = { lat: 12.9716, lng: 77.5946 };

// Currently using Bellandur lat(12.9337127) and lng(77.6621937)
export const EXPLORE_LOCATION = { lat: 12.9337127, lng: 77.6621937 };

// City to coordinates mapping
export const CITY_LAT_LNG_MAPPING: Record<
  string,
  { lat: number; lng: number }
> = {
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  mumbai: { lat: 19.076, lng: 72.8777 },
  delhi: { lat: 28.6139, lng: 77.209 },
  hyderabad: { lat: 17.385, lng: 78.4867 },
  chennai: { lat: 13.0827, lng: 80.2707 },
  kolkata: { lat: 22.5726, lng: 88.3639 },
  pune: { lat: 18.5204, lng: 73.8567 },
  ahmedabad: { lat: 23.0225, lng: 72.5714 },
  jaipur: { lat: 26.9124, lng: 75.7873 },
  lucknow: { lat: 26.8467, lng: 80.9462 },
};

export const WEBSITE_BASE_URL = "https://houseclay.com";
export const CDN_BASE_URL = "https://cdn.houseclay.com";
export const MOBILE_STICKY_HEADER_OFFSET_PX = 56;

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
