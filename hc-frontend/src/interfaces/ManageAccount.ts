import { PaymentFilterStatus } from "@/common/enums";

export interface MyProfileFormValues {
  name: string;
  phoneNumber: string;
  phoneVerified: boolean;
  onWhatsapp: boolean;
  email: string;
  emailVerified: boolean;
}

export type UserType = "tenant" | "buyer" | "";

export type RequirementOption = { label: string; value: string };
export type RequirementIconOption = RequirementOption & {
  icon: React.ReactNode;
};

export type MyRequirementsFormValues = {
  userType: UserType;
  locations: string[];
  locationSearch: string;
  propertyType: string[];
  bhkType: string;
  lookingForARoom: string;
  preferredTenants: string;
  budget: string;
};

export interface MyTransaction {
  id: string;
  type: string;
  dateTime: string;
  connects: number | null;
  amount: number;
  status: PaymentFilterStatus;
  invoice: boolean;
}
