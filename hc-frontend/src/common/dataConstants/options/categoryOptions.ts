import { PropertyCategory } from "@/common/enums";

import { BaseOption } from "./optionUtils";

// Preferred Tenants - Different for each category
export const PREFERRED_TENANTS_OPTIONS: Record<PropertyCategory, BaseOption[]> =
  {
    [PropertyCategory.RENT]: [
      { value: "family", label: "Family" },
      { value: "company", label: "Company" },
      { value: "bachelor", label: "Bachelor" },
      { value: "couple", label: "Couple" },
    ],
    [PropertyCategory.FLATMATE]: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
    ],
    // Not applicable
    [PropertyCategory.RESALE]: [],
    [PropertyCategory.NONE]: [],
  };
