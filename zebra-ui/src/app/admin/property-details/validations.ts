import * as Yup from "yup";

// Define a combined validation schema
export const validationSchema = Yup.object({
  propertyDetails: Yup.object({
    propertyType: Yup.string().required("Property type is required"),
    builtUpArea: Yup.number()
      .required("Built up area is required")
      .positive("Area must be positive"),
    facing: Yup.string().when("$formKey", {
      is: "flatmatesForm",
      then: (schema) => schema.optional(),
      otherwise: (schema) => schema.required("Facing is required"),
    }),
    bhkType: Yup.string().required("BHK type is required"),
    ownershipType: Yup.string().when("$formKey", {
      is: "flatmatesForm",
      then: (schema) => schema.optional(),
      otherwise: (schema) => schema.required("Ownership type is required"),
    }),
    propertyAge: Yup.string().when("$formKey", {
      is: "flatmatesForm",
      then: (schema) => schema.optional(),
      otherwise: (schema) => schema.required("Property age is required"),
    }),
    floor: Yup.number().required("Floor is required"),
    totalFloors: Yup.number().required("Total floors is required"),
    floorType: Yup.string().when("$formKey", {
      is: "flatmatesForm",
      then: (schema) => schema.optional(),
      otherwise: (schema) => schema.required("Floor type is required"),
    }),
  }),
  localityDetails: Yup.object().shape({
    city: Yup.string().required("City is required"),
    locationOrSocietyName: Yup.string().required("Location is required"),
    latitude: Yup.number()
      .required("Latitude is required")
      .min(-90, "Latitude must be greater than or equal to -90")
      .max(90, "Latitude must be less than or equal to 90"),
    longitude: Yup.number()
      .required("Longitude is required")
      .min(-180, "Longitude must be greater than or equal to -180")
      .max(180, "Longitude must be less than or equal to 180"),
  }),
  rentalDetails: Yup.object().shape({
    rent: Yup.string()
      .required("Rent is required")
      .test(
        "is-greater-than-zero",
        "Rent must be greater than zero",
        (value) => parseFloat(value || "0") > 0,
      ),
    deposit: Yup.string()
      .required("Deposit is required")
      .test(
        "is-greater-than-zero",
        "Deposit must be greater than zero",
        (value) => parseFloat(value || "0") > 0,
      ),
    availableFrom: Yup.string().required("Available from is required"),
    furnishing: Yup.string().required("Furnishing is required"),
    preferredTenants: Yup.array()
      .of(Yup.string())
      .when("$formKey", {
        is: "rentForm",
        then: (schema) =>
          schema
            .required("Preferred tenant is required")
            .min(1, "Select at least one preferred tenant"),
        otherwise: (schema) => schema.optional(),
      }),
    waterSupply: Yup.string().required("Water supply is required"),
    powerBackup: Yup.string().required("Power backup is required"),
    parking: Yup.boolean().required("Parking is required"),
    nonVegAllowed: Yup.boolean().required("Non veg allowed is required"),
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
    parking: Yup.boolean().required("Parking is required"),
  }),
  images: Yup.array().of(
    Yup.object().shape({
      description: Yup.string().optional(),
    }),
  ),
  additionalInfo: Yup.object().shape({
    whoWillShowProperty: Yup.string(),
    secondaryPhoneNumber: Yup.string(),
    khataCertificate: Yup.string().when("$formKey", {
      is: "resaleForm",
      then: (schema) => schema.required("Khata Certificate is required"),
      otherwise: (schema) => schema.optional(),
    }),
    saleDeed: Yup.boolean().when("$formKey", {
      is: "resaleForm",
      then: (schema) => schema.required("Sale Deed is required"),
      otherwise: (schema) => schema.optional(),
    }),
    propertyTax: Yup.boolean().when("$formKey", {
      is: "resaleForm",
      then: (schema) => schema.required("Property Tax is required"),
      otherwise: (schema) => schema.optional(),
    }),
  }),
});
