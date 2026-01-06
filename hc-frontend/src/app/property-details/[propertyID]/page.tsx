import type { Metadata } from "next";
import { cookies } from "next/headers";
import { cache, Suspense } from "react";

import { CDN_BASE_URL, WEBSITE_BASE_URL } from "@/common/constants";
import {
  BALCONY_TYPE_OPTIONS,
  BATHROOM_TYPE_OPTIONS,
  BHK_TYPE_OPTIONS,
  FACING_OPTIONS,
  FLOOR_NUMERIC_OPTIONS,
  FURNISHING_OPTIONS,
  getOptionLabel,
  PARKING_OPTIONS,
  POWER_BACKUP_OPTIONS,
  PROPERTY_AGE_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
  ROOM_TYPE_OPTIONS,
  TENANT_TYPE_OPTIONS,
  TOTAL_FLOORS_NUMERIC_OPTIONS,
  WATER_SUPPLY_OPTIONS,
} from "@/common/dataConstants/options";
import { PropertyCategory } from "@/common/enums";
import {
  formatDateToReadable,
  formatINRCurrency,
  pascalCase,
  processPropertyImages,
} from "@/common/utils";
import { ServerAPIService } from "@/services/serverAPIService";

import Loading from "./loading";
import { PropertyDetailsClient } from "./PropertyDetailsClient";

// Cache the page for 6 hours (21600 seconds)
// This enables ISR: first request generates the page, subsequent requests use cache
// The page will be cached per propertyID
export const revalidate = 21600;

type PropertyParams = Promise<{ propertyID: string }>;

// Single shared fetch function - deduplicates requests within the same render
// This ensures generateMetadata and the page component share the same fetch
const getProperty = cache(async (propertyID: string) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    const isAuthenticated = !!token;

    let data;

    if (isAuthenticated) {
      try {
        data = await ServerAPIService.getPropertyByID(propertyID);
      } catch (error) {
        console.error("Error fetching authenticated property data", error);
        // Fallback if auth token is stale
        data = await ServerAPIService.getPublicPropertyByID(propertyID);
      }
    } else {
      data = await ServerAPIService.getPublicPropertyByID(propertyID);
    }

    return data;
  } catch (error) {
    console.error("Error fetching property data", error);
    return undefined;
  }
});

export async function generateMetadata({
  params,
}: {
  params: PropertyParams;
}): Promise<Metadata> {
  const { propertyID } = await params;

  const data = await getProperty(propertyID);
  const processedData = processPropertyData(data);

  const { city, locationOrSocietyName, bhkType, propertyCategory, coverImage } =
    processedData;
  const imageUrl = `${CDN_BASE_URL}/${coverImage}`;
  const location = locationOrSocietyName ?? "";

  const titleSegments = [
    propertyCategory === PropertyCategory.FLATMATE
      ? "Room"
      : bhkType && `${bhkType}`,
    location && `in ${location}`,
    propertyCategory && `for ${pascalCase(propertyCategory)}`,
    city && `in ${city}`,
  ].filter(Boolean);

  const title =
    titleSegments.join(" ").trim() || "Property Details | Houseclay";

  const locationSummary = [location, city].filter(Boolean).join(", ");
  const description = [title, locationSummary].filter(Boolean).join(" | ");

  const pageUrl = `${WEBSITE_BASE_URL}/property-details/${propertyID}`;

  return {
    title,
    description: description || undefined,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description: description || undefined,
      url: pageUrl,
      type: "website",
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
    twitter: {
      title,
      card: "summary_large_image",
      description: description || undefined,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
  };
}

// Server-side function to process property data and compute all derivations
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function processPropertyData(inputData: any) {
  if (!inputData) return null;

  const {
    property,
    contactUserCount,
    shortlistUserCount,
    viewUserCount,
    owner = null,
    reported = false,
    propertyOwner = false,
  } = inputData;
  if (!property) return null;

  const propertyCategory = property?.propertyCategory ?? PropertyCategory.RENT;

  // Process images
  const propertyImages = processPropertyImages(property?.images);
  const coverImage = property?.coverImage;

  // Common derivations
  const bhkType = getOptionLabel(BHK_TYPE_OPTIONS, property?.bhkType);
  const city = property?.city;
  const locationOrSocietyName = property?.locationOrSocietyName;
  const propertyType = getOptionLabel(
    PROPERTY_TYPE_OPTIONS,
    property?.propertyType,
  );
  const propertyFacing =
    property?.facing === "dont-know"
      ? "Not Specified"
      : getOptionLabel(FACING_OPTIONS, property?.facing);
  const propertyFloor = getOptionLabel(FLOOR_NUMERIC_OPTIONS, property?.floor);
  const totalFloors = getOptionLabel(
    TOTAL_FLOORS_NUMERIC_OPTIONS,
    property?.totalFloors,
  );
  const furnishingStatus = getOptionLabel(
    FURNISHING_OPTIONS,
    property?.furnishing,
  );
  const parking =
    property?.parking === "both"
      ? "Car and Bike"
      : getOptionLabel(PARKING_OPTIONS, property?.parking);
  const bedrooms = bhkType
    ? bhkType === "Studio" || bhkType === "1-bhk"
      ? "1 Bedroom"
      : `${bhkType.split("BHK")[0]} Bedrooms`
    : "";
  const builtUpArea = `${property?.builtUpArea || 0} Sq. Ft`;
  const availableFrom = property?.availableFrom
    ? formatDateToReadable(property?.availableFrom)
    : "";
  const maintenance = formatINRCurrency(property?.maintenanceCharges || 0);
  const waterSupply = getOptionLabel(
    WATER_SUPPLY_OPTIONS,
    property?.waterSupply,
  );
  const powerBackup = getOptionLabel(
    POWER_BACKUP_OPTIONS,
    property?.powerBackup,
  );
  const nonVegAllowed = property?.nonVegAllowed ? "Yes" : "No";

  // Category-specific derivations
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let categoryDerivations: any = {};
  if (propertyCategory === PropertyCategory.FLATMATE) {
    categoryDerivations = {
      roomType: getOptionLabel(ROOM_TYPE_OPTIONS, property?.roomType),
      tenantType: getOptionLabel(TENANT_TYPE_OPTIONS, property?.tenantType),
      balconyType: getOptionLabel(BALCONY_TYPE_OPTIONS, property?.balconyType),
      bathroomType: getOptionLabel(
        BATHROOM_TYPE_OPTIONS,
        property?.bathroomType,
      ),
      smokingAllowed: property?.smokingPreference ? "Yes" : "No",
      drinkingAllowed: property?.drinkingPreference ? "Yes" : "No",
    };
  } else if (propertyCategory === PropertyCategory.RENT) {
    categoryDerivations = {
      propertyAge: getOptionLabel(PROPERTY_AGE_OPTIONS, property?.propertyAge),
      flooring: pascalCase(property?.floorType || ""),
      bathrooms: `${property?.bathrooms || 0} ${property?.bathrooms > 1 ? "Bathrooms" : "Bathroom"}`,
      balcony: `${property?.balcony || 0} ${property?.balcony > 1 ? "Balconies" : "Balcony"}`,
      preferredTenants: property?.preferredTenants
        ? property?.preferredTenants
            .map((value: string) => pascalCase(value))
            .join(", ")
        : "N/A",
    };
  }

  // Price/Rent/Deposit derivations
  const priceDerivations = {
    tag: propertyCategory === PropertyCategory.RESALE ? "Price:" : "Rent:",
    amount:
      propertyCategory === PropertyCategory.RESALE
        ? formatINRCurrency(property?.price)
        : formatINRCurrency(property?.rent),
    deposit: formatINRCurrency(
      property?.deposit || property?.depositCharges || 0,
    ),
  };

  // Generate property title
  let propertyTitle = "";
  if (propertyCategory === PropertyCategory.FLATMATE) {
    propertyTitle = `${categoryDerivations.roomType + " Room"} for ${categoryDerivations.tenantType} in a ${bhkType} in ${property?.locationOrSocietyName}, ${property?.city}`;
  } else {
    propertyTitle = `${bhkType} in ${property?.locationOrSocietyName} for ${pascalCase(propertyCategory)} in ${property?.city}`;
  }

  // Process description sentences
  const descriptionSentences = property?.description
    ? property?.description
        .split(/[.!?] +/)
        .filter((sentence: string) => sentence.trim().length > 0)
    : [];

  // Build category-specific fields
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let categoryFields: { leftFields: any[]; rightFields: any[] } = {
    leftFields: [],
    rightFields: [],
  };
  if (propertyCategory === PropertyCategory.RENT) {
    categoryFields = {
      leftFields: [],
      rightFields: [
        { label: "Furnishing", value: furnishingStatus },
        { label: "Flooring", value: categoryDerivations.flooring },
        { label: "Non-Veg Allowed", value: nonVegAllowed },
        { label: "Property Age", value: categoryDerivations.propertyAge },
        {
          label: "Preferred Tenants",
          value: categoryDerivations.preferredTenants,
        },
      ],
    };
  } else if (propertyCategory === PropertyCategory.FLATMATE) {
    categoryFields = {
      leftFields: [],
      rightFields: [
        { label: "Tenant Type", value: categoryDerivations.tenantType },
        { label: "Smoking Allowed", value: categoryDerivations.smokingAllowed },
        {
          label: "Drinking Allowed",
          value: categoryDerivations.drinkingAllowed,
        },
        { label: "Parking", value: parking },
      ],
    };
  }

  // Build property detail columns
  const propertyDetailLeftColumn = [
    { label: "Property Type", value: propertyType },
    { label: "Facing", value: propertyFacing },
    { label: "Floor", value: `${propertyFloor}/${totalFloors}` },
    { label: "Water Supply", value: waterSupply },
    { label: "Power Backup", value: powerBackup },
    ...categoryFields.leftFields,
  ];

  const propertyDetailRightColumn = [...categoryFields.rightFields];

  return {
    // Raw property data
    city,
    locationOrSocietyName,
    property,
    contactUserCount,
    shortlistUserCount,
    viewUserCount,
    owner,
    reported,
    propertyOwner,
    propertyCategory,
    // Processed data
    propertyImages,
    coverImage,
    // Common derivations
    bhkType,
    propertyType,
    propertyFacing,
    propertyFloor,
    totalFloors,
    furnishingStatus,
    parking,
    bedrooms,
    builtUpArea,
    availableFrom,
    maintenance,
    waterSupply,
    powerBackup,
    nonVegAllowed,
    // Category derivations
    ...categoryDerivations,
    // Price derivations
    ...priceDerivations,
    // Computed values
    propertyTitle,
    descriptionSentences,
    propertyDetailLeftColumn,
    propertyDetailRightColumn,
  };
}

// Async component that fetches and processes property data
async function PropertyDetailsContent({
  propertyID,
  isAuthenticated,
}: {
  propertyID: string;
  isAuthenticated: boolean;
}) {
  // Fetch property data - this will be deduplicated with generateMetadata's call above
  const data = await getProperty(propertyID);
  const processedData = processPropertyData(data);

  return (
    <PropertyDetailsClient
      propertyID={propertyID}
      initialPropertyData={processedData}
      isAuthenticated={isAuthenticated}
    />
  );
}

// Server Component
async function PropertyDetails({ params }: { params: PropertyParams }) {
  // Await the params before using them
  const { propertyID } = await params;

  // Check if user is authenticated by checking for token cookie
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const isAuthenticated = !!token;

  return (
    <Suspense fallback={<Loading />}>
      <PropertyDetailsContent
        propertyID={propertyID}
        isAuthenticated={isAuthenticated}
      />
    </Suspense>
  );
}

export default PropertyDetails;
