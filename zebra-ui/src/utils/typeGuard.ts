import { PropertyCategoryEnum } from "@/common/enums";
import {
  AnyProperty,
  FlatmateProperty,
  RentProperty,
  ResaleProperty,
} from "@/interfaces/Property";

export const isRent = (p: AnyProperty): p is RentProperty =>
  p.propertyCategory === PropertyCategoryEnum.RENT;

export const isFlatmate = (p: AnyProperty): p is FlatmateProperty =>
  p.propertyCategory === PropertyCategoryEnum.FLATMATE;

export const isResale = (p: AnyProperty): p is ResaleProperty =>
  p.propertyCategory === PropertyCategoryEnum.RESALE;
