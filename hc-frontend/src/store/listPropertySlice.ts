import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { PropertyListingType } from "@/common/enums";
import { PropertyType } from "@/common/enums";
import { AdditionalInfo } from "@/interfaces/AdditionalInfo";
import { LocalityDetails } from "@/interfaces/LocalityDetails";
import { PropertyDetails } from "@/interfaces/PropertyDetails";
import { PropertyPhoto } from "@/interfaces/PropertyPhoto";
import { RentalDetails } from "@/interfaces/RentalDetails";
import { ResaleDetails } from "@/interfaces/ResaleDetails";

const initialData: {
  propertyDetails: PropertyDetails;
  localityDetails: LocalityDetails;
  rentalDetails: RentalDetails;
  images: PropertyPhoto[];
  additionalInfo: AdditionalInfo;
  resaleDetails: ResaleDetails;
} = {
  propertyDetails: {
    propertyCategory: "",
    propertyType: "Apartment",
    builtUpArea: 2500,
    facing: "East",
    bhkType: "3BHK",
    ownershipType: "Self Owned",
    propertyAge: "More than 10 year",
    floor: "Ground",
    totalFloor: "2",
    floorType: "Mosaic",
    description:
      "Top floor nicely placed. This lovely three bedroom for sale is only 1.95 Crores rupees without any extra brokerage & could be your new home. This West facing home is over 1536 sqft. & is in a convenient location. Situated on the 29th floor this home can comfortably serve your space for car and bike parking needs.",
  },
  localityDetails: {
    city: "",
    location: "",
    landmark: "",
    latitude: 0,
    longitude: 0,
  },
  rentalDetails: {
    rent: 0,
    rentNegotiable: false,
    maintenanceCharges: 0,
    deposit: 0,
    availableFrom: "",
    furnishing: "",
    preferredTenant: "",
    waterSupply: "",
    powerBackup: "",
    parking: false,
    nonVegAllowed: false,
    amenities: [],
    tenantType: "",
    attachedBathroom: false,
    bathroomType: "",
    smokingPreference: false,
    drinkingPreference: false,
  },
  images: [],
  additionalInfo: {
    whoWillShowProperty: "",
    secondaryPhoneNumber: "",
    khataCertificate: "",
    saleDeed: false,
    propertyTax: false,
  },
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
    parking: false,
  },
};

const initialState: ListPropertyState = {
  propertyID: "",
  propertyType: PropertyType.RENT,
  listingType: PropertyListingType.DIY,
  showPropertyType: false,
  rentForm: {
    isValid: false,
    data: {
      ...initialData,
      propertyDetails: {
        ...initialData.propertyDetails,
        propertyCategory: "Rent",
      },
    },
  },
  resaleForm: {
    isValid: false,
    data: {
      ...initialData,
      propertyDetails: {
        ...initialData.propertyDetails,
        propertyCategory: "Resale",
      },
    },
  },
  flatmatesForm: {
    isValid: false,
    data: {
      ...initialData,
      propertyDetails: {
        ...initialData.propertyDetails,
        propertyCategory: "Flatmates",
      },
    },
  },
};

export type FormType = "rentForm" | "resaleForm" | "flatmatesForm";

const listPropertySlice = createSlice({
  name: "listProperty",
  initialState,
  reducers: {
    setPropertyType: (state, action: PayloadAction<PropertyType>) => {
      state.propertyType = action.payload;
    },
    setListingType: (state, action: PayloadAction<PropertyListingType>) => {
      state.listingType = action.payload;
    },
    setShowPropertyType: (state, action: PayloadAction<boolean>) => {
      state.showPropertyType = action.payload;
    },
    setFormValidity: (
      state,
      action: PayloadAction<{ type: FormType; isValid: boolean }>,
    ) => {
      const { type, isValid } = action.payload;
      state[type].isValid = isValid;
    },
    setFormData: (
      state,
      action: PayloadAction<{
        type: FormType;
        data: Partial<{
          propertyDetails: PropertyDetails;
          localityDetails: LocalityDetails;
          rentalDetails: RentalDetails;
          resaleDetails: ResaleDetails;
          images: PropertyPhoto[];
          additionalInfo: AdditionalInfo;
        }>;
      }>,
    ) => {
      const { type, data } = action.payload;
      state[type].data = {
        ...(state[type].data || initialData),
        ...data,
      };
    },
    setFileURLMap: (
      state,
      action: PayloadAction<{
        type: FormType;
        data: Record<string, string>;
      }>,
    ) => {
      const { type, data } = action.payload;
      state[type].data?.images?.forEach((image: PropertyPhoto) => {
        image.S3Url = data[image.file.name];
      });
    },
    setPropertyID: (state, action: PayloadAction<string>) => {
      state.propertyID = action.payload;
    },
    setPropertyDetails: (
      state,
      action: PayloadAction<{
        type: FormType;
        propertyDetails: PropertyDetails;
      }>,
    ) => {
      const { type, propertyDetails } = action.payload;
      if (state[type].data) {
        state[type].data.propertyDetails = propertyDetails;
      }
    },
    setLocalityDetails: (
      state,
      action: PayloadAction<{
        type: FormType;
        localityDetails: LocalityDetails;
      }>,
    ) => {
      const { type, localityDetails } = action.payload;
      if (state[type].data) {
        state[type].data.localityDetails = localityDetails;
      }
    },
    setRentalDetails: (
      state,
      action: PayloadAction<{ type: FormType; rentalDetails: RentalDetails }>,
    ) => {
      const { type, rentalDetails } = action.payload;
      if (state[type].data) {
        state[type].data.rentalDetails = rentalDetails;
      }
    },
    setResaleDetails: (
      state,
      action: PayloadAction<{ type: FormType; resaleDetails: ResaleDetails }>,
    ) => {
      const { type, resaleDetails } = action.payload;
      if (state[type].data) {
        state[type].data.resaleDetails = resaleDetails;
      }
    },
    setImages: (
      state,
      action: PayloadAction<{ type: FormType; images: PropertyPhoto[] }>,
    ) => {
      const { type, images } = action.payload;
      if (state[type].data) {
        state[type].data.images = images;
      }
    },
    setAdditionalInfo: (
      state,
      action: PayloadAction<{ type: FormType; additionalInfo: AdditionalInfo }>,
    ) => {
      const { type, additionalInfo } = action.payload;
      if (state[type].data) {
        state[type].data.additionalInfo = additionalInfo;
      }
    },
  },
});

export const {
  setPropertyType,
  setListingType,
  setShowPropertyType,
  setFormValidity,
  setFormData,
  setFileURLMap,
  setPropertyID,
  setPropertyDetails,
  setLocalityDetails,
  setRentalDetails,
  setResaleDetails,
  setImages,
  setAdditionalInfo,
} = listPropertySlice.actions;
export default listPropertySlice.reducer;
