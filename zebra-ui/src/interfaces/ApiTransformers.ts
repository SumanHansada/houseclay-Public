"use client";

import { PropertyCategory } from "@/common/enums";
import { FormValues } from "@/interfaces/FormValues";
import { PropertyImage } from "@/interfaces/PropertyImage";

type RentApi = {
  propertyID: string;
  propertyCategory: PropertyCategory.RENT;
  // property details
  propertyType: string;
  builtUpArea: number;
  facing: string;
  bhkType: string;
  ownershipType: string;
  propertyAge: string;
  floor: number;
  totalFloors: number;
  floorType: string;
  description?: string | null;
  // locality
  city: string;
  locationOrSocietyName: string;
  landmark: string;
  latitude: number;
  longitude: number;
  // rent details
  rent: number;
  deposit: number;
  maintenanceCharges: number;
  rentNegotiable: boolean;
  availableFrom: string;
  preferredTenants: string[];
  waterSupply: string;
  powerBackup: string;
  furnishing: string;
  parking: string;
  nonVegAllowed: boolean;
  amenities: string[];
  // images
  images: string[];
  coverImage?: string | null; // <── added
  // additional
  whoWillShowProperty?: string;
  secondaryPhoneNumber?: string;
};

type ResaleApi = {
  propertyID: string;
  propertyCategory: PropertyCategory.RESALE;
  // property details
  propertyType: string;
  builtUpArea: number;
  facing: string;
  bhkType: string;
  ownershipType: string;
  propertyAge: string;
  floor: number;
  totalFloors: number;
  floorType: string;
  description?: string | null;
  // locality
  city: string;
  locationOrSocietyName: string;
  landmark: string;
  latitude: number;
  longitude: number;
  // resale details
  price: number;
  availableFrom: string;
  bathrooms: number;
  balcony: number;
  priceNegotiable: boolean;
  underLoan: boolean;
  waterSupply: string;
  powerBackup: string;
  furnishing: string;
  parking: string;
  amenities: string[];
  // images
  images: string[];
  coverImage?: string | null; // <── added
  // additional
  khataCertificate?: string;
  saleDeed?: boolean;
  propertyTax?: boolean;
  secondaryPhoneNumber?: string;
};

type FlatmateApi = {
  propertyID: string;
  propertyCategory: PropertyCategory.FLATMATE;
  // property details (simplified)
  propertyType: string;
  builtUpArea: number;
  bhkType: string;
  floor: number;
  totalFloors: number;
  description?: string | null;
  // locality
  city: string;
  locationOrSocietyName: string;
  landmark: string;
  latitude: number;
  longitude: number;
  // flatmate details
  rent: number;
  maintenanceCharges: number;
  depositCharges: number;
  availableFrom: string;
  furnishing: string;
  waterSupply: string;
  powerBackup: string;
  parking: string;
  nonVegAllowed: boolean;
  amenities: string[];
  tenantType: string;
  attachedBathroom: boolean;
  attachedBalcony: boolean;
  smokingPreference: string;
  drinkingPreference: string;
  // images
  images: string[];
  coverImage?: string | null; // <── added
  // additional
  whoWillShowProperty?: string;
  secondaryPhoneNumber?: string;
};

/* ───────────────────────── Helpers ───────────────────────── */

const fileExtFromUrl = (url: string): string => {
  try {
    const last = url.split("/").pop() || "";
    const clean = last.split("?")[0].split("#")[0];
    const ext = clean.includes(".") ? clean.split(".").pop()! : "";
    return (ext || "jpg").toLowerCase();
  } catch {
    return "jpg";
  }
};

const mimeFromExt = (ext: string): string => {
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    default:
      return "application/octet-stream";
  }
};

const nameFromUrl = (url: string): string => {
  try {
    const last = url.split("/").pop() || "image";
    return decodeURIComponent(last.split("?")[0].split("#")[0]) || "image";
  } catch {
    return "image";
  }
};

/** Create a zero-byte File so UI that expects `file: File` keeps working. */
const fakeFileFromUrl = (url: string): File => {
  const ext = fileExtFromUrl(url);
  const type = mimeFromExt(ext);
  const name = nameFromUrl(url);
  try {
    // Browser path
    const blob = new Blob([], { type });
    return new File([blob], name, { type });
  } catch {
    // SSR / non-DOM fallback (typed as File)
    return {
      name,
      size: 0,
      type,
      lastModified: Date.now(),
      slice: () => new Blob([]),
      arrayBuffer: async () => new ArrayBuffer(0),
      stream: () => new ReadableStream(),
      text: async () => "",
    } as unknown as File;
  }
};

const imageId = (url: string) =>
  `photo_${Math.random().toString(36).slice(2, 8)}_${Date.now()}`;

const buildPropertyImages = (
  urls: string[] | undefined,
  coverUrl?: string | null,
): PropertyImage[] => {
  const images = (urls || []).map((url) => {
    const isCover = !!coverUrl && url === coverUrl;
    return {
      id: imageId(url),
      file: fakeFileFromUrl(url),
      url,
      isCover,
    } as PropertyImage;
  });

  // Put cover first
  images.sort((a, b) => {
    if (!!a.isCover === !!b.isCover) return 0;
    return a.isCover ? -1 : 1;
  });

  return images;
};

/* ───────────────────────── Transformer ───────────────────────── */

export function transformApiToFormValues(
  api: RentApi | ResaleApi | FlatmateApi,
): FormValues {
  const cat = api.propertyCategory;

  if (cat === PropertyCategory.RENT) {
    const a = api as RentApi;
    return {
      propertyDetails: {
        propertyType: a.propertyType,
        builtUpArea: a.builtUpArea,
        facing: a.facing,
        bhkType: a.bhkType,
        ownershipType: a.ownershipType,
        propertyAge: a.propertyAge,
        floor: a.floor,
        totalFloors: a.totalFloors,
        floorType: a.floorType,
        description: a.description || "",
      },
      localityDetails: {
        city: a.city,
        locationOrSocietyName: a.locationOrSocietyName,
        landmark: a.landmark,
        latitude: a.latitude,
        longitude: a.longitude,
      },
      rentalDetails: {
        rent: a.rent,
        deposit: a.deposit,
        maintenanceCharges: a.maintenanceCharges,
        rentNegotiable: a.rentNegotiable,
        availableFrom: a.availableFrom,
        preferredTenants: a.preferredTenants,
        waterSupply: a.waterSupply,
        powerBackup: a.powerBackup,
        furnishing: a.furnishing,
        parking: a.parking,
        nonVegAllowed: a.nonVegAllowed,
        amenities: a.amenities,
      },
      images: buildPropertyImages(a.images, a.coverImage),
      additionalInfo: {
        whoWillShowProperty: a.whoWillShowProperty || "",
        secondaryPhoneNumber: a.secondaryPhoneNumber || "",
      },
      flatmateDetails: undefined,
      resaleDetails: undefined,
    };
  }

  if (cat === PropertyCategory.RESALE) {
    const a = api as ResaleApi;
    return {
      propertyDetails: {
        propertyType: a.propertyType,
        builtUpArea: a.builtUpArea,
        facing: a.facing,
        bhkType: a.bhkType,
        ownershipType: a.ownershipType,
        propertyAge: a.propertyAge,
        floor: a.floor,
        totalFloors: a.totalFloors,
        floorType: a.floorType,
        description: a.description || "",
      },
      localityDetails: {
        city: a.city,
        locationOrSocietyName: a.locationOrSocietyName,
        landmark: a.landmark,
        latitude: a.latitude,
        longitude: a.longitude,
      },
      resaleDetails: {
        price: a.price,
        availableFrom: a.availableFrom,
        bathrooms: a.bathrooms,
        balcony: a.balcony,
        priceNegotiable: a.priceNegotiable,
        underLoan: a.underLoan,
        waterSupply: a.waterSupply,
        powerBackup: a.powerBackup,
        furnishing: a.furnishing,
        parking: a.parking,
        amenities: a.amenities,
      },
      images: buildPropertyImages(a.images, a.coverImage),
      additionalInfo: {
        khataCertificate: a.khataCertificate || "",
        saleDeed: !!a.saleDeed,
        propertyTax: !!a.propertyTax,
        secondaryPhoneNumber: a.secondaryPhoneNumber || "",
      } as any,
      rentalDetails: undefined,
      flatmateDetails: undefined,
    };
  }

  // FLATMATE
  const a = api as FlatmateApi;
  return {
    propertyDetails: {
      propertyType: a.propertyType,
      builtUpArea: a.builtUpArea,
      bhkType: a.bhkType,
      floor: a.floor,
      totalFloors: a.totalFloors,
      description: a.description || "",
    } as any,
    localityDetails: {
      city: a.city,
      locationOrSocietyName: a.locationOrSocietyName,
      landmark: a.landmark,
      latitude: a.latitude,
      longitude: a.longitude,
    },
    flatmateDetails: {
      rent: a.rent,
      maintenanceCharges: a.maintenanceCharges,
      depositCharges: a.depositCharges,
      availableFrom: a.availableFrom,
      furnishing: a.furnishing,
      waterSupply: a.waterSupply,
      powerBackup: a.powerBackup,
      parking: a.parking,
      nonVegAllowed: a.nonVegAllowed,
      amenities: a.amenities,
      tenantType: a.tenantType,
      attachedBathroom: a.attachedBathroom,
      attachedBalcony: a.attachedBalcony,
      smokingPreference: a.smokingPreference,
      drinkingPreference: a.drinkingPreference,
    },
    images: buildPropertyImages(a.images, a.coverImage),
    additionalInfo: {
      whoWillShowProperty: a.whoWillShowProperty || "",
      secondaryPhoneNumber: a.secondaryPhoneNumber || "",
    } as any,
    rentalDetails: undefined,
    resaleDetails: undefined,
  };
}
