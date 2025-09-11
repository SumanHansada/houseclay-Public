import {
  RequirementIconOption,
  RequirementOption,
} from "@/interfaces/ManageAccount";
import { ImageWithLoader, SvgIcon } from "@/utility-components";

export const userTypeOptions: RequirementOption[] = [
  { label: "Tenant", value: "tenant" },
  { label: "Buyer", value: "buyer" },
];

export const bhkTypeOptions: RequirementOption[] = [
  { label: "1 BHK", value: "1BHK" },
  { label: "2 BHK", value: "2BHK" },
  { label: "3 BHK", value: "3BHK" },
  { label: "4 BHK", value: "4BHK" },
  { label: "5+ BHK", value: "5+BHK" },
];

export const lookingForARoomOptions: RequirementOption[] = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

export const preferredTenantOptions: RequirementIconOption[] = [
  {
    label: "Female",
    value: "female",
    icon: <SvgIcon name="female" iconSize="medium" size={75} />,
  },
  {
    label: "Male",
    value: "male",
    icon: <SvgIcon name="male" iconSize="medium" size={75} />,
  },
];

export const rentBudgetOptions: RequirementOption[] = [
  { label: "Under ₹30k", value: "under30K" },
  { label: "Under ₹50K", value: "under50K" },
  { label: "Under ₹80k", value: "under80K" },
  { label: "Flexible", value: "flexible" },
];

export const resaleBudgetOptions: RequirementOption[] = [
  { label: "Under ₹1 Cr", value: "under1CR" },
  { label: "Under ₹2 Cr", value: "under2CR" },
  { label: "Under ₹4 Cr", value: "under4CR" },
  { label: "Flexible", value: "flexible" },
];

export const propertyTypeOptions: RequirementIconOption[] = [
  {
    label: "Apartment",
    value: "Apartment",
    icon: (
      <ImageWithLoader
        src="../images/apartment.webp"
        alt="Apartment"
        height={75}
        width={75}
      />
    ),
  },
  {
    label: "Independent House/Villa",
    value: "Independent House/Villa",
    icon: (
      <ImageWithLoader
        src="../images/independent-house.webp"
        alt="Independent House/Villa"
        height={75}
        width={75}
      />
    ),
  },
  {
    label: "Community Villa",
    value: "Community Villa",
    icon: (
      <ImageWithLoader
        src="../images/community-villa.webp"
        alt="Community Villa"
        height={75}
        width={75}
      />
    ),
  },
  {
    label: "Standalone Building",
    value: "Standalone Building",
    icon: (
      <ImageWithLoader
        src="../images/standalone-building.webp"
        alt="Standalone Building"
        height={75}
        width={75}
      />
    ),
  },
];
