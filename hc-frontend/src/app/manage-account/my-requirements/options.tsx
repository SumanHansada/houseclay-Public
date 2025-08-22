import Image from "next/image";
import FemaleIconSvg from "public/icons/preferred-tenants/female.svg";
import MaleIconSvg from "public/icons/preferred-tenants/male.svg";
import ApartmentIcon from "public/icons/property-types/apartment.webp";
import CommunityVillaIcon from "public/icons/property-types/community-villa.webp";
import IndependentHouseIcon from "public/icons/property-types/independent-house.webp";
import StandaloneBuildingIcon from "public/icons/property-types/standalone-building.webp";

import {
  RequirementIconOption,
  RequirementOption,
} from "@/interfaces/ManageAccount";

const FemaleIcon = FemaleIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const MaleIcon = MaleIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;

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
  { label: "Female", value: "female", icon: <FemaleIcon /> },
  { label: "Male", value: "male", icon: <MaleIcon /> },
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
    icon: <Image src={ApartmentIcon} alt="Apartment" height={75} width={75} />,
  },
  {
    label: "Independent House/Villa",
    value: "Independent House/Villa",
    icon: (
      <Image
        src={IndependentHouseIcon}
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
      <Image
        src={CommunityVillaIcon}
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
      <Image
        src={StandaloneBuildingIcon}
        alt="Standalone Building"
        height={75}
        width={75}
      />
    ),
  },
];
