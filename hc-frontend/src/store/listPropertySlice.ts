import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { PropertyListingType } from "@/common/utils";
import { PropertyType } from "@/common/utils";

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

interface ListPropertyState {
  propertyType: PropertyType;
  listingType: PropertyListingType;
  showPropertyType: boolean;
  rentForm: {
    isValid: boolean;
    data?: {
      propertyDetails: PropertyDetails;
      localityDetails: LocalityDetails;
    };
  };
  resaleForm: {
    isValid: boolean;
    data?: {
      propertyDetails: PropertyDetails;
      localityDetails: LocalityDetails;
    };
  };
  flatmatesForm: {
    isValid: boolean;
    data?: {
      propertyDetails: PropertyDetails;
      localityDetails: LocalityDetails;
    };
  };
}

const initialData: {
  propertyDetails: PropertyDetails;
  localityDetails: LocalityDetails;
} = {
  propertyDetails: {
    propertyCategory: "",
    propertyType: "",
    builtUpArea: 0,
    facing: "",
    bhkType: "",
    ownershipType: "",
    propertyAge: "",
    floor: "",
    totalFloor: "",
    floorType: "",
    description: "",
  },
  localityDetails: {
    city: "",
    location: "",
    landmark: "",
    latitude: 0,
    longitude: 0,
  },
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
