import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { PropertyListingType } from "@/common/utils";
import { PropertyType } from "@/common/utils";
import { PropertyPhoto } from "@/components/common/FormPhotoUpload";

interface PropertyDetails {
  propertyCategory: string;
  propertyType: string;
  builtUpArea: number;
  facing: string;
  bhkType: string;
  ownershipType: string;
  propertyAge: string;
  floor: string;
  totalFloor: string;
  floorType: string;
  description: string;
}

interface LocalityDetails {
  city: string;
  location: string;
  landmark: string;
  latitude: number;
  longitude: number;
}

interface RentalDetails {
  rent: number;
  rentNegotiable: boolean;
  maintenanceCharges: number;
  deposit: number;
  availableFrom: string;
  furnishing: string;
  preferredTenant: string;
  waterSupply: string;
  powerBackup: string;
  parking: boolean;
  nonVegAllowed: string;
  amenities: string[];
}

interface ListPropertyState {
  propertyType: PropertyType;
  listingType: PropertyListingType;
  showPropertyType: boolean;
  rentForm: {
    isValid: boolean;
    data?: {
      propertyDetails: PropertyDetails;
      localityDetails: LocalityDetails;
      rentalDetails: RentalDetails;
      images: PropertyPhoto[];
    };
  };
  resaleForm: {
    isValid: boolean;
    data?: {
      propertyDetails: PropertyDetails;
      localityDetails: LocalityDetails;
      rentalDetails: RentalDetails;
      images: PropertyPhoto[];
    };
  };
  flatmatesForm: {
    isValid: boolean;
    data?: {
      propertyDetails: PropertyDetails;
      localityDetails: LocalityDetails;
      rentalDetails: RentalDetails;
      images: PropertyPhoto[];
    };
  };
}

const initialData: {
  propertyDetails: PropertyDetails;
  localityDetails: LocalityDetails;
  rentalDetails: RentalDetails;
  images: PropertyPhoto[];
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
    nonVegAllowed: "",
    amenities: [],
  },
  images: [],
};

const initialState: ListPropertyState = {
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
        }>;
      }>,
    ) => {
      const { type, data } = action.payload;
      state[type].data = {
        ...(state[type].data || initialData),
        ...data,
      };
    },
  },
});

export const {
  setPropertyType,
  setListingType,
  setShowPropertyType,
  setFormValidity,
  setFormData,
} = listPropertySlice.actions;
export default listPropertySlice.reducer;
