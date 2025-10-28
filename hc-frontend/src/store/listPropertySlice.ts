import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { PropertyCategory, PropertyListingType } from "@/common/enums";
import { AdditionalInfo } from "@/interfaces/AdditionalInfo";
import { FlatmateDetails } from "@/interfaces/FlatmatesDetails";
import { FormValues } from "@/interfaces/FormValues";
import { ListPropertyState } from "@/interfaces/ListPropertyState";
import { LocalityDetails } from "@/interfaces/LocalityDetails";
import { PropertyDetails } from "@/interfaces/PropertyDetails";
import { PropertyImage } from "@/interfaces/PropertyImage";
import { RentalDetails } from "@/interfaces/RentalDetails";
import { ResaleDetails } from "@/interfaces/ResaleDetails";

// Separate initial data for each property category
const getInitialData = (
  propertyCategory: PropertyCategory,
): Partial<FormValues> => {
  const basePropertyDetails = {
    propertyType: "Apartment",
    builtUpArea: 2500,
    facing: "East",
    bhkType: "3BHK",
    bathrooms: 3,
    ownershipType: "Self Owned",
    propertyAge: "More than 10 year",
    floor: 0,
    totalFloors: 10,
    floorType: "Mosaic",
    description:
      "Top floor nicely placed. This lovely three bedroom for sale is only 1.95 Crores rupees without any extra brokerage & could be your new home. This West facing home is over 1536 sqft. & is in a convenient location. Situated on the 29th floor this home can comfortably serve your space for car and bike parking needs.",
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

const initialState: ListPropertyState = {
  propertyID: "",
  propertyImagesS3Url: {},
  propertyImages: [],
  propertyCategory: PropertyCategory.NONE,
  listingType: PropertyListingType.NONE,
  form: {
    isValid: false,
    data: getInitialData(PropertyCategory.NONE),
  },
};

const listPropertySlice = createSlice({
  name: "listProperty",
  initialState,
  reducers: {
    setPropertyCategory: (state, action: PayloadAction<PropertyCategory>) => {
      const newCategory = action.payload;
      state.propertyCategory = newCategory;
      // Update form data to match the new property category
      state.form.data = getInitialData(newCategory);
    },
    setListingType: (state, action: PayloadAction<PropertyListingType>) => {
      state.listingType = action.payload;
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
      state.listingType = PropertyListingType.NONE;
      state.propertyCategory = PropertyCategory.NONE;
      state.propertyID = "";
      state.propertyImagesS3Url = {};
      state.propertyImages = [];
    },
  },
});

export const {
  setPropertyCategory,
  setListingType,
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
} = listPropertySlice.actions;
export default listPropertySlice.reducer;
