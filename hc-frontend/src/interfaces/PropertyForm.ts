import { PropertyCategory } from "@/common/enums";

import { FlatmateForm } from "./FlatmateForm";
import { RentForm } from "./RentForm";
import { ResaleForm } from "./ResaleForm";

// Union type for all property forms
export type PropertyForm = RentForm | ResaleForm | FlatmateForm;

// Utility types for better type safety
export type PropertyFormByCategory<T extends PropertyCategory> =
  T extends PropertyCategory.RENT
    ? RentForm
    : T extends PropertyCategory.RESALE
      ? ResaleForm
      : T extends PropertyCategory.FLATMATE
        ? FlatmateForm
        : never;

// Type guards for runtime type checking
export const isRentForm = (form: PropertyForm): form is RentForm => {
  return form.propertyCategory === PropertyCategory.RENT;
};

export const isResaleForm = (form: PropertyForm): form is ResaleForm => {
  return form.propertyCategory === PropertyCategory.RESALE;
};

export const isFlatmateForm = (form: PropertyForm): form is FlatmateForm => {
  return form.propertyCategory === PropertyCategory.FLATMATE;
};

// Utility function to get the correct form type based on category
export const getFormByCategory = <T extends PropertyCategory>(
  category: T,
): PropertyFormByCategory<T> => {
  // This is a type helper - actual implementation would depend on your form state
  throw new Error(`Form for category ${category} not implemented`);
};

// Extract specific fields from property forms
export type PropertyFormImages = PropertyForm["images"];
export type PropertyFormPropertyID = PropertyForm["propertyID"];
export type PropertyFormPropertyCategory = PropertyForm["propertyCategory"];

// Utility type for partial updates
export type PartialPropertyForm<T extends PropertyForm> = {
  [K in keyof T]?: T[K] extends object ? Partial<T[K]> : T[K];
};

// Type for API responses
export interface PropertyFormResponse {
  message: string;
  propertyID: number;
}

// Type for form validation errors
export interface PropertyFormErrors {
  [key: string]: string;
}
