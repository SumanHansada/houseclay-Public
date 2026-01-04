import { cache, Suspense } from "react";

import { CITY_LAT_LNG_MAPPING, EXPLORE_LOCATION } from "@/common/constants";
import { PropertyCategory } from "@/common/enums";
import { PropertySearch } from "@/interfaces/PropertySearch";
import { ServerAPIService } from "@/services/serverAPIService";

import Loading from "./loading";
import { PropertySearchClient } from "./PropertySearchClient";

// Cache the search function to deduplicate requests
const getCachedPropertiesByLocation = cache(
  async (params: {
    latitude: number;
    longitude: number;
    propertyCategory: string;
    page?: number;
    size?: number;
    [key: string]:
      | string
      | number
      | boolean
      | string[]
      | PropertyCategory
      | undefined;
  }) => {
    try {
      return await ServerAPIService.getPropertiesByLocation(params);
    } catch (error) {
      console.error("Error fetching properties by location", error);
      return undefined;
    }
  },
);

// Async component that fetches property search data
async function PropertySearchContent({
  params,
}: {
  params: { [key: string]: string | string[] | undefined };
}) {
  let lat = params.lat;
  let lon = params.lon;
  if (!lat && !lon) {
    const city = params.city;
    const cityCoords =
      EXPLORE_LOCATION ||
      CITY_LAT_LNG_MAPPING[city as keyof typeof CITY_LAT_LNG_MAPPING];
    lat = cityCoords.lat.toString();
    lon = cityCoords.lng.toString();
  }
  const propertyCategory = params.propertyCategory;

  // Only fetch if lat/lon are present and valid
  const shouldFetch =
    lat &&
    lon &&
    typeof lat === "string" &&
    typeof lon === "string" &&
    !isNaN(Number(lat)) &&
    !isNaN(Number(lon));

  let initialData:
    | {
        items: PropertySearch[];
        hasNext: boolean;
        page: number;
        totalElements: number;
      }
    | undefined = undefined;

  if (shouldFetch) {
    // Build query object from all URL params
    const query: Record<
      string,
      string | number | boolean | string[] | PropertyCategory
    > = {
      latitude: Number(lat),
      longitude: Number(lon),
      propertyCategory:
        (propertyCategory as PropertyCategory)?.toUpperCase() ||
        PropertyCategory.RENT,
      page: 0,
    };

    // Add optional filters from URL params
    const minPriceStr = params.minPrice;
    const maxPriceStr = params.maxPrice;
    const propertyType = params.propertyType;
    const bhkType = params.bhkType;
    const tenantType = params.tenantType;
    const preferredTenants = params.preferredTenants;
    const nonVegAllowedStr = params.nonVegAllowed;
    const roomType = params.roomType;
    const bathroomType = params.bathroomType;
    const balconyType = params.balconyType;
    const availability = params.availability;
    const furnishing = params.furnishing;
    const parking = params.parking;
    const amenities = params.amenities;
    const exclusive = params.exclusive;
    const sortFields = params.sortFields;
    const sortOrder = params.sortOrder;

    // Tamper protection: Validate minPrice and maxPrice from URL
    if (
      minPriceStr !== null &&
      maxPriceStr !== null &&
      typeof minPriceStr === "string" &&
      typeof maxPriceStr === "string"
    ) {
      const minNum = Number(minPriceStr);
      const maxNum = Number(maxPriceStr);
      if (!isNaN(minNum) && !isNaN(maxNum)) {
        // Bounds
        const clampedMin = Math.max(0, minNum);
        const clampedMax = Math.min(1000000, maxNum);

        if (clampedMin <= clampedMax) {
          query.minPrice = clampedMin;
          query.maxPrice = clampedMax;
        }
      }
    }

    if (nonVegAllowedStr !== null && typeof nonVegAllowedStr === "string") {
      if (nonVegAllowedStr === "true" || nonVegAllowedStr === "1") {
        query.nonVegAllowed = true;
      } else if (nonVegAllowedStr === "false" || nonVegAllowedStr === "0") {
        query.nonVegAllowed = false;
      }
    }
    if (propertyType && typeof propertyType === "string")
      query.propertyType = propertyType;
    if (bhkType && typeof bhkType === "string") query.bhkType = bhkType;
    if (tenantType && typeof tenantType === "string")
      query.tenantType = tenantType;
    if (preferredTenants && typeof preferredTenants === "string")
      query.preferredTenants = preferredTenants;
    if (roomType && typeof roomType === "string") query.roomType = roomType;
    if (bathroomType && typeof bathroomType === "string")
      query.bathroomType = bathroomType;
    if (balconyType && typeof balconyType === "string")
      query.balconyType = balconyType;
    if (
      availability &&
      typeof availability === "string" &&
      availability !== "Any"
    )
      query.availability = availability;
    if (furnishing && typeof furnishing === "string")
      query.furnishing = furnishing;
    if (parking && typeof parking === "string") query.parking = parking;
    if (amenities && typeof amenities === "string")
      query.amenities = amenities.split(",");
    if (exclusive && typeof exclusive === "string")
      query.exclusive = exclusive === "true" || exclusive === "1";
    if (sortFields && typeof sortFields === "string")
      query.sortFields = sortFields;
    if (sortOrder && typeof sortOrder === "string") query.sortOrder = sortOrder;

    // Fetch initial data server-side
    const result = await getCachedPropertiesByLocation(
      query as {
        latitude: number;
        longitude: number;
        propertyCategory: string;
        page?: number;
        size?: number;
        [key: string]:
          | string
          | number
          | boolean
          | string[]
          | PropertyCategory
          | undefined;
      },
    );
    if (result) {
      initialData = result as {
        items: PropertySearch[];
        hasNext: boolean;
        page: number;
        totalElements: number;
      };
    }
  }

  return <PropertySearchClient initialData={initialData} />;
}

// Server Component
export default async function PropertySearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  return (
    <Suspense fallback={<Loading />}>
      <PropertySearchContent params={params} />
    </Suspense>
  );
}
