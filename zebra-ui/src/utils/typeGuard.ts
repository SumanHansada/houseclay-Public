// type-guards.ts
import { PropertyCategoryEnum } from "@/common/enums";
import {
  FlattenedFlatmateForm,
  FlattenedRentForm,
  FlattenedResaleForm,
  PropertyResponse,
} from "@/interfaces/api";

export const isRent = (
  p: PropertyResponse,
): p is PropertyResponse & FlattenedRentForm =>
  p.propertyCategory === PropertyCategoryEnum.RENT;

export const isFlatmate = (
  p: PropertyResponse,
): p is PropertyResponse & FlattenedFlatmateForm =>
  p.propertyCategory === PropertyCategoryEnum.FLATMATE;

export const isResale = (
  p: PropertyResponse,
): p is PropertyResponse & FlattenedResaleForm =>
  p.propertyCategory === PropertyCategoryEnum.RESALE;

// import { PropertyCategoryEnum } from "@/common/enums";
// import {
//   FlattenedFlatmateForm,
//   FlattenedRentForm,
//   FlattenedResaleForm,
//   PropertyResponse,
// } from "@/interfaces/api";
// import {} from "@/interfaces/Property";

// export const isRent = (p: PropertyResponse): p is FlattenedRentForm =>
//   p.propertyCategory === PropertyCategoryEnum.RENT;

// export const isFlatmate = (p: PropertyResponse): p is FlattenedFlatmateForm =>
//   p.propertyCategory === PropertyCategoryEnum.FLATMATE;

// export const isResale = (p: PropertyResponse): p is FlattenedResaleForm =>
//   p.propertyCategory === PropertyCategoryEnum.RESALE;
