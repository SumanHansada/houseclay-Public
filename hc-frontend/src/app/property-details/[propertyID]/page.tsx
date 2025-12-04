import type { Metadata } from "next";

import { CDN_BASE_URL, WEBSITE_BASE_URL } from "@/common/constants";
import {
  BHK_TYPE_OPTIONS,
  getOptionLabel,
} from "@/common/dataConstants/options";
import { pascalCase } from "@/common/utils";
import { ServerAPIService } from "@/services/serverAPIService";

import { PropertyDetailsClient } from "./PropertyDetailsClient";

type PropertyParams = Promise<{ propertyID: string }>;

type PropertyData = {
  bhkType?: string;
  locationOrSocietyName?: string;
  propertyCategory?: string;
  city?: string;
  images?: string[];
};

const resolvePropertyFromResponse = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response: any,
): PropertyData | undefined => {
  if (!response) {
    return undefined;
  }

  if ("property" in response) {
    return response.property as PropertyData;
  }

  return response as PropertyData;
};

export async function generateMetadata({
  params,
}: {
  params: PropertyParams;
}): Promise<Metadata> {
  const { propertyID } = await params;

  let property: PropertyData | undefined;

  try {
    const propertyData =
      await ServerAPIService.getPublicPropertyByID(propertyID);
    console.log("Property Data", propertyData);
    property = resolvePropertyFromResponse(propertyData);
    console.log("Property", property);
  } catch (_error) {
    // Ignore metadata fetch failures; fall back to defaults
    console.error("Error fetching property data", _error);
  }

  const bhkType = getOptionLabel(BHK_TYPE_OPTIONS, property?.bhkType);
  const location = property?.locationOrSocietyName ?? "";
  const propertyCategory = property?.propertyCategory ?? "";
  const city = property?.city ?? "";

  const titleSegments = [
    bhkType && `${bhkType}`,
    location && `in ${location}`,
    propertyCategory && `for ${pascalCase(propertyCategory)}`,
    city && `in ${city}`,
  ].filter(Boolean);

  const title =
    titleSegments.join(" ").trim() || "Property Details | Houseclay";

  const locationSummary = [location, city].filter(Boolean).join(", ");
  const description = [title, locationSummary].filter(Boolean).join(" | ");

  const imageUrl = `${CDN_BASE_URL}/${property?.images?.[0]}`;
  console.log("Image Url", imageUrl);
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

// Server Component
async function PropertyDetails({ params }: { params: PropertyParams }) {
  // Await the params before using them
  const { propertyID } = await params;

  try {
    const propertyData =
      await ServerAPIService.getPublicPropertyByID(propertyID);
    return (
      <PropertyDetailsClient
        propertyID={propertyID}
        initialData={propertyData}
      />
    );
  } catch (error) {
    console.error("Error fetching property data", error);
  }
}

export default PropertyDetails;
