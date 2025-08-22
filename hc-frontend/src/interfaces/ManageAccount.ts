export interface MyProfileFormValues {
  name: string;
  phoneNumber: string;
  phoneVerified: boolean;
  onWhatsapp: boolean;
  email: string;
  emailVerified: boolean;
  connects: number;
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
