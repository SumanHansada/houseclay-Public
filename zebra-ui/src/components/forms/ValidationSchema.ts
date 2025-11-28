import * as Yup from "yup";

import { PropertyCategory } from "@/common/enums";

const createValidationSchema = (propertyCategory: PropertyCategory) => {
  const baseSchema = {
    // Locality Details
    localityDetails: Yup.object().shape({
      city: Yup.string().required("City is required"),
      locationOrSocietyName: Yup.string().required("Location is required"),
      latitude: Yup.number()
        .required("Latitude is required")
        .min(-90, "Latitude must be >= -90")
        .max(90, "Latitude must be <= 90"),
      longitude: Yup.number()
        .required("Longitude is required")
        .min(-180, "Longitude must be >= -180")
        .max(180, "Longitude must be <= 180"),
    }),

    // Gallery
    images: Yup.array()
      .of(
        Yup.object().shape({
          file: Yup.object().optional(),
          id: Yup.string().required(),
          url: Yup.string().required(),
          isCover: Yup.boolean().required(),
        }),
      )
      .test(
        "photos-or-checkbox",
        "Please upload at least one photo or confirm no photos",
        function (value) {
          const { noPhotos } = this.parent;
          return (value && value.length > 0) || noPhotos === true;
        },
      ),
  };

  // Schema based on category
  switch (propertyCategory) {
    case PropertyCategory.FLATMATE:
      return Yup.object().shape({
        ...baseSchema,

        propertyDetails: Yup.object({
          propertyType: Yup.string().required("Property type is required"),
          builtUpArea: Yup.number()
            .required("Built up area is required")
            .positive("Area must be positive"),
          facing: Yup.string().required("Facing is required"),
          bhkType: Yup.string().required("BHK type is required"),
          floor: Yup.number()
            .required("Floor is required")
            .test(
              "floor-less-than-total",
              "Floor cannot exceed total floors",
              function (value) {
                const { totalFloors } = this.parent;
                if (!value || !totalFloors) return true;
                return value <= totalFloors;
              },
            ),
          totalFloors: Yup.number().required("Total floors is required"),
        }),

        flatmateDetails: Yup.object().shape({
          rent: Yup.string()
            .required("Rent is required")
            .test(
              "is-greater-than-zero",
              "Rent must be greater than zero",
              (value) => parseFloat(value || "0") > 0,
            ),
          maintenanceCharges: Yup.string()
            .required("Maintenance charges is required")
            .test(
              "is-greater-than-zero",
              "Maintenance charges must be greater than zero",
              (value) => parseFloat(value || "0") > 0,
            ),
          depositCharges: Yup.string()
            .required("Deposit is required")
            .test(
              "is-greater-than-zero",
              "Deposit must be greater than zero",
              (value) => parseFloat(value || "0") > 0,
            ),
          availableFrom: Yup.string().required("Available from is required"),
          furnishing: Yup.string().required("Furnishing is required"),
          waterSupply: Yup.string().required("Water supply is required"),
          powerBackup: Yup.string().required("Power backup is required"),
          parking: Yup.string().required("Parking is required"),
          nonVegAllowed: Yup.boolean().required("Non veg allowed is required"),
          tenantType: Yup.string().required("Preferred tenant is required"),
          bathrooms: Yup.number().required("Bathrooms is required"),
          balcony: Yup.number().required("Balcony is required"),
          attachedBathroom: Yup.boolean().required(
            "Attached bathroom is required",
          ),
          attachedBalcony: Yup.boolean().required(
            "Attached balcony is required",
          ),
          smokingPreference: Yup.string().required(
            "Smoking preference is required",
          ),
          drinkingPreference: Yup.string().required(
            "Drinking preference is required",
          ),
          amenities: Yup.array()
            .of(Yup.string())
            .required("Amenities are required"),
        }),

        additionalInfo: Yup.object().shape({
          whoWillShowProperty: Yup.string(),
          secondaryPhoneNumber: Yup.string(),
        }),
      });

    case PropertyCategory.RESALE:
      return Yup.object().shape({
        ...baseSchema,

        propertyDetails: Yup.object({
          propertyType: Yup.string().required("Property type is required"),
          builtUpArea: Yup.number()
            .required("Built up area is required")
            .positive("Area must be positive"),
          facing: Yup.string().required("Facing is required"),
          bhkType: Yup.string().required("BHK type is required"),
          ownershipType: Yup.string().required("Ownership type is required"),
          propertyAge: Yup.string().required("Property age is required"),
          floor: Yup.number()
            .required("Floor is required")
            .test(
              "floor-less-than-total",
              "Floor cannot exceed total floors",
              function (value) {
                const { totalFloors } = this.parent;
                if (!value || !totalFloors) return true;
                return value <= totalFloors;
              },
            ),
          totalFloors: Yup.number().required("Total floors is required"),
          floorType: Yup.string().required("Floor type is required"),
        }),

        resaleDetails: Yup.object().shape({
          price: Yup.string()
            .required("Price is required")
            .test(
              "is-greater-than-zero",
              "Price must be greater than zero",
              (value) => parseFloat(value || "0") > 0,
            ),
          availableFrom: Yup.string().required("Available from is required"),
          bathrooms: Yup.number().required("Bathrooms is required"),
          furnishing: Yup.string().required("Furnishing is required"),
          parking: Yup.string().required("Parking is required"),
        }),

        additionalInfo: Yup.object().shape({
          whoWillShowProperty: Yup.string(),
          secondaryPhoneNumber: Yup.string(),
          khataCertificate: Yup.string().required(
            "Khata Certificate is required",
          ),
          saleDeed: Yup.boolean().required("Sale Deed is required"),
          propertyTax: Yup.boolean().required("Property Tax is required"),
        }),
      });

    default:
    case PropertyCategory.RENT:
      return Yup.object().shape({
        ...baseSchema,

        propertyDetails: Yup.object().shape({
          propertyType: Yup.string().required("Property type is required"),
          builtUpArea: Yup.number().required("Built up area is required"),
          facing: Yup.string().required("Facing is required"),
          bhkType: Yup.string().required("BHK type is required"),
          ownershipType: Yup.string().required("Ownership type is required"),
          propertyAge: Yup.string().required("Property age is required"),
          floor: Yup.number()
            .required("Floor is required")
            .test(
              "floor-less-than-total",
              "Floor cannot exceed total floors",
              function (value) {
                const { totalFloors } = this.parent;
                if (!value || !totalFloors) return true;
                return value <= totalFloors;
              },
            ),
          totalFloors: Yup.number().required("Total floors is required"),
          floorType: Yup.string().required("Floor type is required"),
        }),

        rentalDetails: Yup.object().shape({
          rent: Yup.string()
            .required("Rent is required")
            .test(
              "is-greater-than-zero",
              "Rent must be > 0",
              (value) => parseFloat(value || "0") > 0,
            ),
          deposit: Yup.string()
            .required("Deposit is required")
            .test(
              "is-greater-than-zero",
              "Deposit must be > 0",
              (value) => parseFloat(value || "0") > 0,
            ),
          availableFrom: Yup.string().required("Available from is required"),
          furnishing: Yup.string().required("Furnishing is required"),
          preferredTenants: Yup.array()
            .of(Yup.string())
            .required("Preferred tenant is required")
            .min(1, "Select at least one preferred tenant"),
          bathrooms: Yup.number().required("Bathrooms is required"),
          balcony: Yup.number().required("Balcony is required"),
          waterSupply: Yup.string().required("Water supply is required"),
          powerBackup: Yup.string().required("Power backup is required"),
          parking: Yup.string().required("Parking is required"),
          nonVegAllowed: Yup.boolean().required("Non veg allowed is required"),
        }),

        additionalInfo: Yup.object().shape({
          whoWillShowProperty: Yup.string(),
          secondaryPhoneNumber: Yup.string(),
        }),
      });
  }
};

export default createValidationSchema;
