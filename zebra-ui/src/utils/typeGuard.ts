import { PropertyCategory } from "@/common/enums";
import {
  FlattenedFlatmateForm,
  FlattenedRentForm,
  FlattenedResaleForm,
  PropertyResponse,
} from "@/interfaces/api";

export const isRent = (
  p: PropertyResponse,
): p is PropertyResponse & FlattenedRentForm =>
  p.propertyCategory === PropertyCategory.RENT;

export const isFlatmate = (
  p: PropertyResponse,
): p is PropertyResponse & FlattenedFlatmateForm =>
  p.propertyCategory === PropertyCategory.FLATMATE;

export const isResale = (
  p: PropertyResponse,
): p is PropertyResponse & FlattenedResaleForm =>
  p.propertyCategory === PropertyCategory.RESALE;
