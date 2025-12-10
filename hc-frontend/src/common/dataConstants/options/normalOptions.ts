import { PROPERTY_TYPES } from "@/common/enums";

import { BaseOption, generateNumericOptions } from "./optionUtils";

export const PROPERTY_TYPE_OPTIONS: BaseOption[] = [
  { value: PROPERTY_TYPES.APARTMENT, label: "Apartment" },
  { value: PROPERTY_TYPES.VILLA, label: "Community Villa" },
  { value: PROPERTY_TYPES.HOUSE, label: "Independent House" },
  { value: PROPERTY_TYPES.BUILDING, label: "Standalone Building" },
];

export const PROPERTY_TYPE_SHORT_OPTIONS: BaseOption[] = [
  { value: PROPERTY_TYPES.APARTMENT, label: "Apartment" },
  { value: PROPERTY_TYPES.VILLA, label: "Villa" },
  { value: PROPERTY_TYPES.HOUSE, label: "House" },
  { value: PROPERTY_TYPES.BUILDING, label: "Building" },
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
  { label: "Any", value: "Any" },
  { label: "Immediate", value: "IMMEDIATE" },
  { label: "Within 15 Days", value: "WITHIN_15" },
  { label: "Within 30 Days", value: "WITHIN_30" },
  { label: "After 30 Days", value: "ABOVE_30" },
];
