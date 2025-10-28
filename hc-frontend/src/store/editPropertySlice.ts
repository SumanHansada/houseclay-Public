import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { PropertyCategory } from "@/common/enums";
import { AdditionalInfo } from "@/interfaces/AdditionalInfo";
import { FlatmateDetails } from "@/interfaces/FlatmatesDetails";
import { FormValues } from "@/interfaces/FormValues";
import { LocalityDetails } from "@/interfaces/LocalityDetails";
import { PropertyDetails } from "@/interfaces/PropertyDetails";
import { PropertyImage } from "@/interfaces/PropertyImage";
import { RentalDetails } from "@/interfaces/RentalDetails";
import { ResaleDetails } from "@/interfaces/ResaleDetails";

export interface EditPropertyState {
  propertyID: string;
  propertyImagesS3Url: Record<string, string>;
  propertyImages: PropertyImage[];
  propertyCategory: PropertyCategory;
  form: {
    isValid: boolean;
    data: Partial<FormValues>;
  };
}

// Separate initial data for each property category
const getInitialData = (
  propertyCategory: PropertyCategory,
): Partial<FormValues> => {
  const basePropertyDetails = {
    propertyType: "Apartment",
    builtUpArea: 0,
    facing: "",
    bhkType: "",
    bathrooms: 0,
    ownershipType: "",
    propertyAge: "",
    floor: 0,
    totalFloors: 0,
    floorType: "",
    description: "",
  };

  const baseLocalityDetails = {
    city: "",
    locationOrSocietyName: "",
    landmark: "",
    latitude: 0,
    longitude: 0,
  };

  const baseAdditionalInfo = {
    whoWillShowProperty: "",
    secondaryPhoneNumber: "",
    khataCertificate: "",
    saleDeed: false,
    propertyTax: false,
  };

  const baseImages: PropertyImage[] = [];

  switch (propertyCategory) {
    case PropertyCategory.RENT:
      return {
        propertyDetails: basePropertyDetails,
        localityDetails: baseLocalityDetails,
        additionalInfo: baseAdditionalInfo,
        images: baseImages,
        rentalDetails: {
          rent: 0,
          rentNegotiable: false,
          maintenanceCharges: 0,
          deposit: 0,
          availableFrom: "",
          furnishing: "",
          preferredTenants: [],
          waterSupply: "",
          powerBackup: "",
          parking: "",
          nonVegAllowed: false,
          amenities: [],
        },
      };

    case PropertyCategory.RESALE:
      return {
        propertyDetails: basePropertyDetails,
        localityDetails: baseLocalityDetails,
        additionalInfo: baseAdditionalInfo,
        images: baseImages,
        resaleDetails: {
          price: 0,
          availableFrom: "",
          bathrooms: 0,
          balcony: 0,
          priceNegotiable: false,
          underLoan: false,
          waterSupply: "",
          powerBackup: "",
          furnishing: "",
          parking: "",
          amenities: [],
        },
      };

    case PropertyCategory.FLATMATE:
      return {
        propertyDetails: basePropertyDetails,
        localityDetails: baseLocalityDetails,
        additionalInfo: baseAdditionalInfo,
        images: baseImages,
        flatmateDetails: {
          rent: 0,
          maintenanceCharges: 0,
          depositCharges: 0,
          availableFrom: "",
          furnishing: "",
          waterSupply: "",
          powerBackup: "",
          parking: "",
          nonVegAllowed: false,
          amenities: [],
          tenantType: "",
          attachedBathroom: false,
          attachedBalcony: false,
          smokingPreference: "",
          drinkingPreference: "",
        },
      };

    default:
      return {
        propertyDetails: basePropertyDetails,
        localityDetails: baseLocalityDetails,
        additionalInfo: baseAdditionalInfo,
        images: baseImages,
      };
  }
};

const initialState: EditPropertyState = {
  propertyID: "",
  propertyImagesS3Url: {},
  propertyImages: [],
  propertyCategory: PropertyCategory.NONE,
  form: {
    isValid: false,
    data: getInitialData(PropertyCategory.NONE),
  },
};

const editPropertySlice = createSlice({
  name: "editProperty",
  initialState,
  reducers: {
    setPropertyCategory: (state, action: PayloadAction<PropertyCategory>) => {
      const newCategory = action.payload;
      state.propertyCategory = newCategory;
      // Update form data to match the new property category
      state.form.data = getInitialData(newCategory);
    },
    setFormValidity: (state, action: PayloadAction<{ isValid: boolean }>) => {
      const { isValid } = action.payload;
      state.form.isValid = isValid;
    },
    setFormData: (
      state,
      action: PayloadAction<{
        data: Partial<FormValues>;
      }>,
    ) => {
      const { data } = action.payload;
      state.form.data = {
        ...(state.form.data || getInitialData(state.propertyCategory)),
        ...data,
      };
    },
    setFileURLMap: (
      state,
      action: PayloadAction<{
        data: Record<string, string>;
      }>,
    ) => {
      const { data } = action.payload;
      state.propertyImagesS3Url = data;
    },
    setPropertyID: (state, action: PayloadAction<string>) => {
      state.propertyID = action.payload;
    },
    setPropertyDetails: (
      state,
      action: PayloadAction<{
        propertyDetails: PropertyDetails;
      }>,
    ) => {
      const { propertyDetails } = action.payload;
      if (state.form.data) {
        state.form.data.propertyDetails = propertyDetails;
      }
    },
    setLocalityDetails: (
      state,
      action: PayloadAction<{
        localityDetails: LocalityDetails;
      }>,
    ) => {
      const { localityDetails } = action.payload;
      if (state.form.data) {
        state.form.data.localityDetails = localityDetails;
      }
    },
    setRentalDetails: (
      state,
      action: PayloadAction<{ rentalDetails: RentalDetails }>,
    ) => {
      const { rentalDetails } = action.payload;
      if (state.form.data) {
        state.form.data.rentalDetails = rentalDetails;
      }
    },
    setResaleDetails: (
      state,
      action: PayloadAction<{ resaleDetails: ResaleDetails }>,
    ) => {
      const { resaleDetails } = action.payload;
      if (state.form.data) {
        state.form.data.resaleDetails = resaleDetails;
      }
    },
    setFlatmateDetails: (
      state,
      action: PayloadAction<{ flatmateDetails: FlatmateDetails }>,
    ) => {
      const { flatmateDetails } = action.payload;
      if (state.form.data) {
        state.form.data.flatmateDetails = flatmateDetails;
      }
    },
    setImages: (state, action: PayloadAction<{ images: PropertyImage[] }>) => {
      const { images } = action.payload;
      if (state.form.data) {
        state.form.data.images = images;
      }
    },
    setPropertyImages: (
      state,
      action: PayloadAction<{ propertyImages: PropertyImage[] }>,
    ) => {
      const { propertyImages } = action.payload;
      state.propertyImages = propertyImages;
    },
    setAdditionalInfo: (
      state,
      action: PayloadAction<{ additionalInfo: AdditionalInfo }>,
    ) => {
      const { additionalInfo } = action.payload;
      if (state.form.data) {
        state.form.data.additionalInfo = additionalInfo;
      }
    },
    clearFormData: (state) => {
      state.form = {
        isValid: false,
        data: getInitialData(PropertyCategory.NONE),
      };
      state.propertyCategory = PropertyCategory.NONE;
      state.propertyID = "";
      state.propertyImagesS3Url = {};
      state.propertyImages = [];
    },
  },
});

export const {
  setPropertyCategory,
  setFormValidity,
  setFormData,
  setFileURLMap,
  setPropertyID,
  setPropertyDetails,
  setLocalityDetails,
  setRentalDetails,
  setResaleDetails,
  setFlatmateDetails,
  setImages,
  setPropertyImages,
  setAdditionalInfo,
  clearFormData,
} = editPropertySlice.actions;
export default editPropertySlice.reducer;
