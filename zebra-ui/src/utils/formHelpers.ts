import { FormikErrors, FormikTouched } from "formik";

import { FormValues } from "@/interfaces/FormValues";

// Common helper functions for accessing Formik errors and touched states
export const getLocalityDetailsErrors = (errors: FormikErrors<FormValues>) =>
  errors?.localityDetails as
    | {
        city?: string;
        locationOrSocietyName?: string;
        landmark?: string;
        latitude?: string;
        longitude?: string;
      }
    | undefined;

export const getLocalityDetailsTouched = (touched: FormikTouched<FormValues>) =>
  touched?.localityDetails as
    | {
        city?: boolean;
        locationOrSocietyName?: boolean;
        landmark?: boolean;
        latitude?: boolean;
        longitude?: boolean;
      }
    | undefined;

// Common helper functions for accessing Formik errors and touched states
export const getAdditionalInfoErrors = (errors: FormikErrors<FormValues>) =>
  errors?.additionalInfo as
    | {
        whoWillShowProperty?: string;
        secondaryPhoneNumber?: string;
        khataCertificate?: string;
        saleDeed?: string;
        propertyTax?: string;
      }
    | undefined;

export const getAdditionalInfoTouched = (touched: FormikTouched<FormValues>) =>
  touched?.additionalInfo as
    | {
        whoWillShowProperty?: boolean;
        secondaryPhoneNumber?: boolean;
        khataCertificate?: boolean;
        saleDeed?: boolean;
        propertyTax?: boolean;
      }
    | undefined;

export const getPropertyDetailsErrors = (errors: FormikErrors<FormValues>) =>
  errors?.propertyDetails as
    | {
        propertyType?: string;
        builtUpArea?: string;
        facing?: string;
        bhkType?: string;
        ownershipType?: string;
        propertyAge?: string;
        floor?: string;
        totalFloors?: string;
        floorType?: string;
        description?: string;
      }
    | undefined;

export const getPropertyDetailsTouched = (touched: FormikTouched<FormValues>) =>
  touched?.propertyDetails as
    | {
        propertyType?: boolean;
        builtUpArea?: boolean;
        facing?: boolean;
        bhkType?: boolean;
        ownershipType?: boolean;
        propertyAge?: boolean;
        floor?: boolean;
        totalFloors?: boolean;
        floorType?: boolean;
        description?: boolean;
      }
    | undefined;

export const getRentalDetailsErrors = (errors: FormikErrors<FormValues>) =>
  errors?.rentalDetails as
    | {
        rent?: string;
        deposit?: string;
        maintenanceCharges?: string;
        rentNegotiable?: string;
        availableFrom?: string;
        preferredTenants?: string;
        bathrooms?: string;
        balcony?: string;
        waterSupply?: string;
        powerBackup?: string;
        furnishing?: string;
        parking?: string;
        nonVegAllowed?: string;
        amenities?: string;
      }
    | undefined;

export const getRentalDetailsTouched = (touched: FormikTouched<FormValues>) =>
  touched?.rentalDetails as
    | {
        rent?: boolean;
        deposit?: boolean;
        maintenanceCharges?: boolean;
        rentNegotiable?: boolean;
        availableFrom?: boolean;
        preferredTenants?: boolean;
        bathrooms?: boolean;
        balcony?: boolean;
        waterSupply?: boolean;
        powerBackup?: boolean;
        furnishing?: boolean;
        parking?: boolean;
        nonVegAllowed?: boolean;
        amenities?: boolean;
      }
    | undefined;

export const getResaleDetailsErrors = (errors: FormikErrors<FormValues>) =>
  errors?.resaleDetails as
    | {
        price?: string;
        availableFrom?: string;
        bathrooms?: string;
        balcony?: string;
        priceNegotiable?: string;
        underLoan?: string;
        waterSupply?: string;
        powerBackup?: string;
        furnishing?: string;
        parking?: string;
        amenities?: string;
      }
    | undefined;

export const getResaleDetailsTouched = (touched: FormikTouched<FormValues>) =>
  touched?.resaleDetails as
    | {
        price?: boolean;
        availableFrom?: boolean;
        bathrooms?: boolean;
        balcony?: boolean;
        priceNegotiable?: boolean;
        underLoan?: boolean;
        waterSupply?: boolean;
        powerBackup?: boolean;
        furnishing?: boolean;
        parking?: boolean;
        amenities?: boolean;
      }
    | undefined;

export const getFlatmateDetailsErrors = (errors: FormikErrors<FormValues>) =>
  errors?.flatmateDetails as
    | {
        rent?: string;
        maintenanceCharges?: string;
        depositCharges?: string;
        availableFrom?: string;
        furnishing?: string;
        waterSupply?: string;
        powerBackup?: string;
        parking?: string;
        nonVegAllowed?: string;
        amenities?: string;
        tenantType?: string;
        attachedBathroom?: string;
        attachedBalcony?: string;
        smokingPreference?: string;
        drinkingPreference?: string;
      }
    | undefined;

export const getFlatmateDetailsTouched = (touched: FormikTouched<FormValues>) =>
  touched?.flatmateDetails as
    | {
        rent?: boolean;
        maintenanceCharges?: boolean;
        depositCharges?: boolean;
        availableFrom?: boolean;
        furnishing?: boolean;
        waterSupply?: boolean;
        powerBackup?: boolean;
        parking?: boolean;
        nonVegAllowed?: boolean;
        amenities?: boolean;
        tenantType?: boolean;
        attachedBathroom?: boolean;
        attachedBalcony?: boolean;
        smokingPreference?: boolean;
        drinkingPreference?: boolean;
      }
    | undefined;
