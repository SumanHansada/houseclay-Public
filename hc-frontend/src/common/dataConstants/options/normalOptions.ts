import {
  PreferredTenantValue,
  PropertyTypeValue,
  TenantTypeValue,
} from "@/common/enums";
import { BaseOption, PriceOption } from "@/interfaces/Options";

import { generateNumericOptions } from "./optionUtils";

export const PROPERTY_TYPE_OPTIONS: BaseOption[] = [
  { value: PropertyTypeValue.APARTMENT, label: "Apartment" },
  { value: PropertyTypeValue.VILLA, label: "Community Villa" },
  { value: PropertyTypeValue.HOUSE, label: "Independent House" },
  { value: PropertyTypeValue.BUILDING, label: "Standalone Building" },
];

export const PROPERTY_TYPE_SHORT_OPTIONS: BaseOption[] = [
  { value: PropertyTypeValue.APARTMENT, label: "Apartment" },
  { value: PropertyTypeValue.VILLA, label: "Villa" },
  { value: PropertyTypeValue.HOUSE, label: "House" },
  { value: PropertyTypeValue.BUILDING, label: "Building" },
];

export const FACING_OPTIONS: BaseOption[] = [
  { value: "east", label: "East" },
  { value: "west", label: "West" },
  { value: "north", label: "North" },
  { value: "south", label: "South" },
  { value: "north-east", label: "North-East" },
  { value: "north-west", label: "North-West" },
  { value: "south-east", label: "South-East" },
  { value: "south-west", label: "South-West" },
  { value: "dont-know", label: "Don't Know" },
];

export const BHK_TYPE_OPTIONS: BaseOption[] = [
  { value: "studio", label: "Studio" },
  { value: "1-bhk", label: "1 BHK" },
  { value: "2-bhk", label: "2 BHK" },
  { value: "3-bhk", label: "3 BHK" },
  { value: "4-bhk", label: "4 BHK" },
  { value: "5-plus-bhk", label: "5+ BHK" },
];

export const OWNERSHIP_TYPE_OPTIONS: BaseOption[] = [
  { value: "self-owned", label: "Self Owned" },
  { value: "rented", label: "Rented" },
  { value: "power-of-attorney", label: "Power of Attorney" },
];

export const PROPERTY_AGE_OPTIONS: BaseOption[] = [
  { value: "less-than-1-year", label: "Less than 1 year" },
  { value: "1-5-years", label: "1-5 years" },
  { value: "5-10-years", label: "5-10 years" },
  { value: "more-than-10-years", label: "More than 10 years" },
];

export const FLOOR_TYPE_OPTIONS: BaseOption[] = [
  { value: "mosaic", label: "Mosaic" },
  { value: "marble", label: "Marble" },
  { value: "granite", label: "Granite" },
  { value: "vitrified", label: "Vitrified" },
  { value: "wooden", label: "Wooden" },
];

export const FURNISHING_OPTIONS: BaseOption[] = [
  { value: "fully-furnished", label: "Fully Furnished" },
  { value: "semi-furnished", label: "Semi Furnished" },
  { value: "unfurnished", label: "Unfurnished" },
];

export const WATER_SUPPLY_OPTIONS: BaseOption[] = [
  { value: "borewell", label: "Borewell" },
  { value: "tanker", label: "Tanker" },
  { value: "borewell-tanker", label: "Borewell & Tanker" },
  { value: "cauvery-water", label: "Cauvery Water" },
];

export const POWER_BACKUP_OPTIONS: BaseOption[] = [
  { value: "full", label: "Full" },
  { value: "partial", label: "Partial" },
  { value: "no", label: "No" },
];

export const ROOM_TYPE_OPTIONS: BaseOption[] = [
  { value: "single", label: "Single" },
  { value: "shared", label: "Shared" },
];

export const PARKING_OPTIONS: BaseOption[] = [
  { value: "both", label: "Both" },
  { value: "2-wheeler", label: "2 Wheeler" },
  { value: "4-wheeler", label: "4 Wheeler" },
  { value: "none", label: "None" },
];

export const BATHROOM_TYPE_OPTIONS: BaseOption[] = [
  { value: "attached", label: "Attached Bathroom" },
  { value: "dedicated", label: "Dedicated Bathroom" },
  { value: "shared", label: "Shared Bathroom" },
];

export const BALCONY_TYPE_OPTIONS: BaseOption[] = [
  { value: "attached", label: "Attached Balcony" },
  { value: "shared", label: "Shared Balcony" },
  { value: "no-balcony", label: "No Balcony" },
];

export const PREFERRED_TENANTS_OPTIONS: BaseOption[] = [
  { value: PreferredTenantValue.FAMILY, label: "Family" },
  { value: PreferredTenantValue.BACHELOR, label: "Bachelor" },
  { value: PreferredTenantValue.COMPANY, label: "Company" },
  { value: PreferredTenantValue.COUPLE, label: "Couple" },
];

export const TENANT_TYPE_OPTIONS: BaseOption[] = [
  { value: TenantTypeValue.MALE, label: "Male" },
  { value: TenantTypeValue.FEMALE, label: "Female" },
];

export const KHATA_CERTIFICATE_OPTIONS: BaseOption[] = [
  { value: "a-Khata", label: "Yes, A-Khata" },
  {
    value: "b-Khata",
    label: "Yes, B-Khata",
  },
  {
    value: "no",
    label: "No",
  },
];

export const WHO_WILL_SHOW_PROPERTY_OPTIONS: BaseOption[] = [
  { value: "owner", label: "I will show" },
  { value: "friend-neighbour", label: "Friend/Neighbour will show" },
];

export const BATHROOM_NUMERIC_OPTIONS = generateNumericOptions({
  min: 1,
  max: 6,
});

export const BALCONY_NUMERIC_OPTIONS = generateNumericOptions({
  max: 6,
  addZeroOption: true,
  zeroOptionLabel: "No Balcony",
});

export const FLOOR_NUMERIC_OPTIONS = generateNumericOptions({
  max: 50,
  addZeroOption: true,
  zeroOptionLabel: "Ground",
});

export const TOTAL_FLOORS_NUMERIC_OPTIONS = generateNumericOptions({
  min: 1,
  max: 50,
});

export const YES_NO_OPTIONS: BaseOption<boolean>[] = [
  { value: true, label: "Yes" },
  { value: false, label: "No" },
];

// Property Search
export const PROPERTY_AVAILABILITY: BaseOption[] = [
  { value: "Any", label: "Any" },
  { value: "IMMEDIATE", label: "Immediate" },
  { value: "WITHIN_15", label: "Within 15 Days" },
  { value: "WITHIN_30", label: "Within 30 Days" },
  { value: "ABOVE_30", label: "After 30 Days" },
];

export const RENT_PRICE_OPTIONS: PriceOption[] = [
  { value: "0-30000", label: "Under 30k", min: 0, max: 30000 },
  { value: "30000-60000", label: "30k to 60k", min: 30000, max: 60000 },
  { value: "60000-90000", label: "60k to 90k", min: 60000, max: 90000 },
  {
    value: "90000-max",
    label: "90k & Above",
    min: 90000,
    max: 1000000,
  },
];

export const FLATMATE_PRICE_OPTIONS: PriceOption[] = [
  { value: "0-10000", label: "Under 10k", min: 0, max: 10000 },
  { value: "10000-20000", label: "10k to 20k", min: 10000, max: 20000 },
  { value: "20000-30000", label: "20k to 30k", min: 20000, max: 30000 },
  { value: "30000-max", label: "30k & Above", min: 30000, max: 1000000 },
];

// Amenities - Centralized Values
export const AMENITY_VALUES = {
  LIFT: "lift",
  CLUB_HOUSE: "club-house",
  GYM: "gym",
  OUTDOOR_DINING: "outdoor-dining-area",
  FIRE_EXTINGUISHER: "fire-extinguisher",
  SMOKE_ALARM: "smoke-alarm",
  SWIMMING_POOL: "swimming-pool",
  POWER_BACKUP: "twenty-four-seven-power",
  SECURITY: "security",
  VISITOR_PARKING: "visitor-parking",
  DEDICATED_WORKSPACE: "dedicated-workspace",
  WIFI: "wifi",
  POOL_TABLE: "pool-table",
  FIRST_AID: "first-aid-kit",
  INTERCOM: "intercom",
  SEWAGE_TREATMENT: "sewage-treatment",
  HOUSE_KEEPING: "house-keeping",
  RAIN_WATER: "rain-water-harvesting",
  PLAY_AREA: "children-play-area",
  GUEST_ROOM: "guest-room",
  COMMUNITY_HALL: "community-hall",
} as const;

// Centralized Labels (Mapped to the Values)
export const AMENITY_LABELS: Record<string, string> = {
  [AMENITY_VALUES.LIFT]: "Lift",
  [AMENITY_VALUES.CLUB_HOUSE]: "Club House",
  [AMENITY_VALUES.GYM]: "Gym",
  [AMENITY_VALUES.OUTDOOR_DINING]: "Outdoor Dining Area",
  [AMENITY_VALUES.FIRE_EXTINGUISHER]: "Fire Extinguisher",
  [AMENITY_VALUES.SMOKE_ALARM]: "Smoke Alarm",
  [AMENITY_VALUES.SWIMMING_POOL]: "Swimming Pool",
  [AMENITY_VALUES.POWER_BACKUP]: "24/7 Power",
  [AMENITY_VALUES.SECURITY]: "Security",
  [AMENITY_VALUES.VISITOR_PARKING]: "Visitor Parking",
  [AMENITY_VALUES.DEDICATED_WORKSPACE]: "Dedicated Workspace",
  [AMENITY_VALUES.WIFI]: "Wifi",
  [AMENITY_VALUES.POOL_TABLE]: "Pool Table",
  [AMENITY_VALUES.FIRST_AID]: "First Aid Kit",
  [AMENITY_VALUES.INTERCOM]: "Intercom",
  [AMENITY_VALUES.SEWAGE_TREATMENT]: "Sewage Treatment",
  [AMENITY_VALUES.HOUSE_KEEPING]: "House Keeping",
  [AMENITY_VALUES.RAIN_WATER]: "Rain Water Harvesting",
  [AMENITY_VALUES.PLAY_AREA]: "Children Play Area",
  [AMENITY_VALUES.GUEST_ROOM]: "Guest Room",
  [AMENITY_VALUES.COMMUNITY_HALL]: "Community Hall",
};
