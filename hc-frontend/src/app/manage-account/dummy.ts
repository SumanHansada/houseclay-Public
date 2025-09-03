import { PaymentFilterStatus, PropertyCategory } from "@/common/enums";

export interface PropertyCardDummy {
  propertyID: string;
  category: string;
  propertyType: string;
  builtUpArea: number;
  bhkType: string;
  bathrooms?: number;
  rent: number | null;
  furnishing: string;
  price: number | null;
  city: string;
  locationOrSocietyName: string;
  landmark: string;
  latitude: number;
  longitude: number;
  image: string;
  images: string[];
  badges: string | null;
}

export const userDummy = {
  name: "Ankit Biswas",
  phone: "91999 999 9999",
  onWhatsapp: true,
  phoneVerified: true,
  email: "ankitbiswas@gmail.com",
  emailVerified: false,
  connects: 32,
};

export const DUMMY_PROPERTIES_FOR_PROPERTY_CARD = [
  {
    propertyID: "f2686686-c081-401b-8a1e-d11c1a295017",
    category: "RENT",
    propertyType: "Apartment",
    builtUpArea: 2500,
    bhkType: "3BHK",
    rent: 22000,
    price: null,
    furnishing: "Fully-furnished",
    city: "Bengaluru",
    locationOrSocietyName: "Durga Petals",
    landmark:
      "Circle, No. 3493, Outer Ring Rd, near Bagmane Constellation Business Park, next to Rainbow Children's Hospital, Ferns City, Doddanekundi, Doddanekkundi, Bengaluru, Karnataka 560037, India",
    latitude: 12.9760536,
    longitude: 77.69794449999999,
    image:
      "https://houseclay.s3.ap-southeast-2.amazonaws.com/properties/f2686686-c081-401b-8a1e-d11c1a295017/photos/pexels-itsterrymag-2631746.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250822T082740Z&X-Amz-SignedHeaders=host&X-Amz-Credential=REDACTED_AWS_ACCESS_KEY_ID%2F20250822%2Fap-southeast-2%2Fs3%2Faws4_request&X-Amz-Expires=60&X-Amz-Signature=84c272f93eb426eeb555fadd93aa0e51e8b1bae7516299a2af89c7c3e2ec63c5",
    badges: null,
    images: [
      "https://houseclay.s3.ap-southeast-2.amazonaws.com/properties/f2686686-c081-401b-8a1e-d11c1a295017/photos/pexels-itsterrymag-2631746.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250822T082740Z&X-Amz-SignedHeaders=host&X-Amz-Credential=REDACTED_AWS_ACCESS_KEY_ID%2F20250822%2Fap-southeast-2%2Fs3%2Faws4_request&X-Amz-Expires=60&X-Amz-Signature=84c272f93eb426eeb555fadd93aa0e51e8b1bae7516299a2af89c7c3e2ec63c5",
    ],
  },
  {
    propertyID: "5c684207-c9d9-46e9-a955-86d2e98679c5",
    category: "RENT",
    propertyType: "Apartment",
    builtUpArea: 2500,
    bhkType: "3BHK",
    rent: 65000,
    price: null,
    furnishing: "Fully-furnished",
    city: "Bengaluru",
    locationOrSocietyName: "Krishvi Gavakshi",
    landmark:
      "Close to ORR, Bengaluru, Karnataka, Krishvi Gavakshi, Gear School Rd, Kaverappa Layout, Kadubeesanahalli, Bengaluru, Karnataka 560103, India",
    latitude: 12.9357713,
    longitude: 77.69738740000001,
    image:
      "https://houseclay.s3.ap-southeast-2.amazonaws.com/properties/5c684207-c9d9-46e9-a955-86d2e98679c5/photos/pexels-itsterrymag-2631746.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250822T082740Z&X-Amz-SignedHeaders=host&X-Amz-Credential=REDACTED_AWS_ACCESS_KEY_ID%2F20250822%2Fap-southeast-2%2Fs3%2Faws4_request&X-Amz-Expires=60&X-Amz-Signature=e4dfb84f97bd999272275cd6624c23d08d0b0512339873c146958bbcce1685f3",
    badges: null,
    images: [
      "https://houseclay.s3.ap-southeast-2.amazonaws.com/properties/5c684207-c9d9-46e9-a955-86d2e98679c5/photos/pexels-itsterrymag-2631746.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250822T082740Z&X-Amz-SignedHeaders=host&X-Amz-Credential=REDACTED_AWS_ACCESS_KEY_ID%2F20250822%2Fap-southeast-2%2Fs3%2Faws4_request&X-Amz-Expires=60&X-Amz-Signature=e4dfb84f97bd999272275cd6624c23d08d0b0512339873c146958bbcce1685f3",
    ],
  },
  {
    propertyID: "20d848e6-05c4-4110-b1ab-f7a3f0d8b65c",
    category: "RESALE",
    propertyType: "Apartment",
    builtUpArea: 2500,
    bhkType: "3BHK",
    rent: null,
    price: 20000000,
    furnishing: "Semi-funnished",
    city: "Bengaluru",
    locationOrSocietyName: "Prestige Ivy Terraces",
    landmark:
      "Doddakannelli - Kaadubeesanahalli Rd, Kaverappa Layout, Kadubeesanahalli, Bengaluru, Karnataka 560103, India",
    latitude: 12.9329325,
    longitude: 77.6986771,
    image:
      "https://houseclay.s3.ap-southeast-2.amazonaws.com/properties/20d848e6-05c4-4110-b1ab-f7a3f0d8b65c/photos/pexels-itsterrymag-2631746.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250822T082740Z&X-Amz-SignedHeaders=host&X-Amz-Credential=REDACTED_AWS_ACCESS_KEY_ID%2F20250822%2Fap-southeast-2%2Fs3%2Faws4_request&X-Amz-Expires=60&X-Amz-Signature=22f35b53f312cd48f39f272bf74ce38e80c85eba491dea898d90d92d585f4b68",
    badges: null,
    images: [
      "https://houseclay.s3.ap-southeast-2.amazonaws.com/properties/20d848e6-05c4-4110-b1ab-f7a3f0d8b65c/photos/pexels-itsterrymag-2631746.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250822T082740Z&X-Amz-SignedHeaders=host&X-Amz-Credential=REDACTED_AWS_ACCESS_KEY_ID%2F20250822%2Fap-southeast-2%2Fs3%2Faws4_request&X-Amz-Expires=60&X-Amz-Signature=22f35b53f312cd48f39f272bf74ce38e80c85eba491dea898d90d92d585f4b68",
    ],
  },
  {
    propertyID: "28331fc9-125c-46b9-b388-fdda77018a86",
    category: "RENT",
    propertyType: "Apartment",
    builtUpArea: 2500,
    bhkType: "2BHK",
    rent: 40000,
    price: null,
    furnishing: "Semi-funnished",
    city: "Bengaluru",
    locationOrSocietyName: "Prestige Sunnyside Oak",
    landmark:
      "WMJX+59P Prestige Sunnyside Oak, Doddakannelli - Kaadubeesanahalli Rd, near New Horizon Gurukul School, Bhoganhalli, Bengaluru, Karnataka 560103, India",
    latitude: 12.931785600000001,
    longitude: 77.6964144,
    image:
      "https://houseclay.s3.ap-southeast-2.amazonaws.com/properties/28331fc9-125c-46b9-b388-fdda77018a86/photos/pexels-pixabay-276724.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250822T082740Z&X-Amz-SignedHeaders=host&X-Amz-Credential=REDACTED_AWS_ACCESS_KEY_ID%2F20250822%2Fap-southeast-2%2Fs3%2Faws4_request&X-Amz-Expires=60&X-Amz-Signature=43821a389958b7097865c0258bae881bd8e6f5dc1477e5a3a073f41a368eb52e",
    badges: null,
    images: [
      "https://houseclay.s3.ap-southeast-2.amazonaws.com/properties/28331fc9-125c-46b9-b388-fdda77018a86/photos/pexels-pixabay-276724.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250822T082740Z&X-Amz-SignedHeaders=host&X-Amz-Credential=REDACTED_AWS_ACCESS_KEY_ID%2F20250822%2Fap-southeast-2%2Fs3%2Faws4_request&X-Amz-Expires=60&X-Amz-Signature=43821a389958b7097865c0258bae881bd8e6f5dc1477e5a3a073f41a368eb52e",
    ],
  },
  {
    propertyID: "a2056ef8-50f1-453e-9095-d20974c25f5f",
    category: "RESALE",
    propertyType: "Apartment",
    builtUpArea: 2500,
    bhkType: "3BHK",
    rent: null,
    price: 10000000,
    furnishing: "Fully-furnished",
    city: "Bengaluru",
    locationOrSocietyName: "Adarsh Palm Retreat",
    landmark: "Adarsh Palm Retreat, Bellandur, Bengaluru, Karnataka, India",
    latitude: 12.9196533,
    longitude: 77.6920422,
    image:
      "https://houseclay.s3.ap-southeast-2.amazonaws.com/properties/a2056ef8-50f1-453e-9095-d20974c25f5f/photos/pexels-itsterrymag-2631746.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250822T082740Z&X-Amz-SignedHeaders=host&X-Amz-Credential=REDACTED_AWS_ACCESS_KEY_ID%2F20250822%2Fap-southeast-2%2Fs3%2Faws4_request&X-Amz-Expires=60&X-Amz-Signature=54f2b370264002c9890c882d6b8380515efc4c743d5f211f5a04bff714bfe213",
    badges: null,
    images: [
      "https://houseclay.s3.ap-southeast-2.amazonaws.com/properties/a2056ef8-50f1-453e-9095-d20974c25f5f/photos/pexels-itsterrymag-2631746.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250822T082740Z&X-Amz-SignedHeaders=host&X-Amz-Credential=REDACTED_AWS_ACCESS_KEY_ID%2F20250822%2Fap-southeast-2%2Fs3%2Faws4_request&X-Amz-Expires=60&X-Amz-Signature=54f2b370264002c9890c882d6b8380515efc4c743d5f211f5a04bff714bfe213",
    ],
  },
  {
    propertyID: "60e90967-de65-4268-8197-32988fd1bf43",
    category: "RENT",
    propertyType: "Apartment",
    builtUpArea: 2500,
    bhkType: "3BHK",
    rent: 65000,
    price: null,
    furnishing: "Semi-funnished",
    city: "Bengaluru",
    locationOrSocietyName: "Prestige Ivy Terraces",
    landmark:
      "Doddakannelli - Kaadubeesanahalli Rd, Kaverappa Layout, Kadubeesanahalli, Bengaluru, Karnataka 560103, India",
    latitude: 12.9329325,
    longitude: 77.6986771,
    image:
      "https://houseclay.s3.ap-southeast-2.amazonaws.com/properties/60e90967-de65-4268-8197-32988fd1bf43/photos/pexels-falling4utah-2724749.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250822T082740Z&X-Amz-SignedHeaders=host&X-Amz-Credential=REDACTED_AWS_ACCESS_KEY_ID%2F20250822%2Fap-southeast-2%2Fs3%2Faws4_request&X-Amz-Expires=60&X-Amz-Signature=b49ae5b82438a46739d856423baeaa7ebb7ac7629901d91917d4fc2eca435e2e",
    badges: null,
    images: [
      "https://houseclay.s3.ap-southeast-2.amazonaws.com/properties/60e90967-de65-4268-8197-32988fd1bf43/photos/pexels-falling4utah-2724749.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250822T082740Z&X-Amz-SignedHeaders=host&X-Amz-Credential=REDACTED_AWS_ACCESS_KEY_ID%2F20250822%2Fap-southeast-2%2Fs3%2Faws4_request&X-Amz-Expires=60&X-Amz-Signature=b49ae5b82438a46739d856423baeaa7ebb7ac7629901d91917d4fc2eca435e2e",
    ],
  },
  {
    propertyID: "5a74e321-7c48-4261-a72c-60bf4f9d78c8",
    category: "FLATMATE",
    propertyType: "Apartment",
    builtUpArea: 2500,
    bhkType: "3BHK",
    rent: 60000,
    price: null,
    furnishing: "Semi-funnished",
    city: "Bengaluru",
    locationOrSocietyName: "Sobha Dream Acres",
    landmark:
      "Panathur Main Road, Off, Outer Ring Rd, Balagere, Bengaluru, Karnataka 560087, India",
    latitude: 12.936217,
    longitude: 77.7235583,
    image:
      "https://houseclay.s3.ap-southeast-2.amazonaws.com/properties/5a74e321-7c48-4261-a72c-60bf4f9d78c8/photos/pexels-christa-grover-977018-2121121.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250822T082740Z&X-Amz-SignedHeaders=host&X-Amz-Credential=REDACTED_AWS_ACCESS_KEY_ID%2F20250822%2Fap-southeast-2%2Fs3%2Faws4_request&X-Amz-Expires=60&X-Amz-Signature=95ac68bb797fdbef6f7aa3932065290c7d683e2b74d844fbcbb1745ad9863064",
    badges: null,
    images: [
      "https://houseclay.s3.ap-southeast-2.amazonaws.com/properties/5a74e321-7c48-4261-a72c-60bf4f9d78c8/photos/pexels-christa-grover-977018-2121121.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250822T082740Z&X-Amz-SignedHeaders=host&X-Amz-Credential=REDACTED_AWS_ACCESS_KEY_ID%2F20250822%2Fap-southeast-2%2Fs3%2Faws4_request&X-Amz-Expires=60&X-Amz-Signature=95ac68bb797fdbef6f7aa3932065290c7d683e2b74d844fbcbb1745ad9863064",
    ],
  },
  {
    propertyID: "a0d63b59-5e5e-4aee-afd7-787b4a0306be",
    category: "RENT",
    propertyType: "Apartment",
    builtUpArea: 2500,
    bhkType: "3BHK",
    rent: 58000,
    price: null,
    furnishing: "Unfurnished",
    city: "Bengaluru",
    locationOrSocietyName: "Adarsh Palm Retreat",
    landmark: "Adarsh Palm Retreat, Bellandur, Bengaluru, Karnataka, India",
    latitude: 12.9196533,
    longitude: 77.6920422,
    image:
      "https://houseclay.s3.ap-southeast-2.amazonaws.com/properties/a0d63b59-5e5e-4aee-afd7-787b4a0306be/photos/pexels-itsterrymag-2631746.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250822T082740Z&X-Amz-SignedHeaders=host&X-Amz-Credential=REDACTED_AWS_ACCESS_KEY_ID%2F20250822%2Fap-southeast-2%2Fs3%2Faws4_request&X-Amz-Expires=60&X-Amz-Signature=c9f5b2e1eb27e293473935f52cd10ccf756732d558d417e7404450e8f7d50527",
    badges: null,
    images: [
      "https://houseclay.s3.ap-southeast-2.amazonaws.com/properties/a0d63b59-5e5e-4aee-afd7-787b4a0306be/photos/pexels-itsterrymag-2631746.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250822T082740Z&X-Amz-SignedHeaders=host&X-Amz-Credential=REDACTED_AWS_ACCESS_KEY_ID%2F20250822%2Fap-southeast-2%2Fs3%2Faws4_request&X-Amz-Expires=60&X-Amz-Signature=c9f5b2e1eb27e293473935f52cd10ccf756732d558d417e7404450e8f7d50527",
    ],
  },
  {
    propertyID: "e8abc701-12f9-4985-9313-6888aa3f5b3a",
    category: "RENT",
    propertyType: "Apartment",
    builtUpArea: 2500,
    bhkType: "3BHK",
    rent: 50000,
    price: null,
    furnishing: "Fully-furnished",
    city: "Bengaluru",
    locationOrSocietyName: "Sobha Dream Acres",
    landmark:
      "Panathur Main Road, Off, Outer Ring Rd, Balagere, Bengaluru, Karnataka 560087, India",
    latitude: 12.936217,
    longitude: 77.7235583,
    image:
      "https://houseclay.s3.ap-southeast-2.amazonaws.com/properties/e8abc701-12f9-4985-9313-6888aa3f5b3a/photos/pexels-binyaminmellish-186077.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250822T082740Z&X-Amz-SignedHeaders=host&X-Amz-Credential=REDACTED_AWS_ACCESS_KEY_ID%2F20250822%2Fap-southeast-2%2Fs3%2Faws4_request&X-Amz-Expires=60&X-Amz-Signature=4fec6c79e956dbf2aef187f604bd51c26aca29c61407c5b4e5cbe54ca578c449",
    badges: null,
    images: [
      "https://houseclay.s3.ap-southeast-2.amazonaws.com/properties/e8abc701-12f9-4985-9313-6888aa3f5b3a/photos/pexels-binyaminmellish-186077.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250822T082740Z&X-Amz-SignedHeaders=host&X-Amz-Credential=REDACTED_AWS_ACCESS_KEY_ID%2F20250822%2Fap-southeast-2%2Fs3%2Faws4_request&X-Amz-Expires=60&X-Amz-Signature=4fec6c79e956dbf2aef187f604bd51c26aca29c61407c5b4e5cbe54ca578c449",
    ],
  },
  {
    propertyID: "4837bfc1-2688-4133-a0f2-0933b66f7329",
    category: "FLATMATE",
    propertyType: "Apartment",
    builtUpArea: 2500,
    bhkType: "4BHK",
    rent: 80000,
    price: null,
    furnishing: "Fully-furnished",
    city: "Bengaluru",
    locationOrSocietyName: "Prestige Sunnyside Oak",
    landmark:
      "WMJX+59P Prestige Sunnyside Oak, Doddakannelli - Kaadubeesanahalli Rd, near New Horizon Gurukul School, Bhoganhalli, Bengaluru, Karnataka 560103, India",
    latitude: 12.931785600000001,
    longitude: 77.6964144,
    image:
      "https://houseclay.s3.ap-southeast-2.amazonaws.com/properties/4837bfc1-2688-4133-a0f2-0933b66f7329/photos/pexels-itsterrymag-2631746.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250822T082740Z&X-Amz-SignedHeaders=host&X-Amz-Credential=REDACTED_AWS_ACCESS_KEY_ID%2F20250822%2Fap-southeast-2%2Fs3%2Faws4_request&X-Amz-Expires=60&X-Amz-Signature=20b8f56b279f9d9b50ec4f0b54cb50f322646e04c7b1b0c0fc88f89630996753",
    badges: null,
    images: [
      "https://houseclay.s3.ap-southeast-2.amazonaws.com/properties/4837bfc1-2688-4133-a0f2-0933b66f7329/photos/pexels-itsterrymag-2631746.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250822T082740Z&X-Amz-SignedHeaders=host&X-Amz-Credential=REDACTED_AWS_ACCESS_KEY_ID%2F20250822%2Fap-southeast-2%2Fs3%2Faws4_request&X-Amz-Expires=60&X-Amz-Signature=20b8f56b279f9d9b50ec4f0b54cb50f322646e04c7b1b0c0fc88f89630996753",
    ],
  },
];

export const MY_DUMMY_PROPERTIES = [
  {
    propertyID: "p1",
    propertyName: "3 BHK Premium Apartment For Sale In Bellandur",
    category: PropertyCategory.RESALE,
    listedOn: "2025-06-22T18:30:00.000+00:00",
    builtupArea: 1100,
    price: 23000000,
    rent: null,
    status: "Active",
  },
  {
    propertyID: "p2",
    propertyName: "2 BHK Semi-Furnished For Rent In HSR Layout",
    category: PropertyCategory.RENT,
    listedOn: "2025-06-24T18:30:00.000+00:00",
    builtupArea: 1100,
    price: null,
    rent: 80000,
    status: "Active",
  },
  {
    propertyID: "p3",
    propertyName: "Shared Room In 2 BHK For Male In Electronic City",
    category: PropertyCategory.FLATMATE,
    listedOn: "2025-06-20T18:30:00.000+00:00",
    builtupArea: 2180,
    price: null,
    rent: 20000,
    status: "Inactive",
  },
];

export const DUMMY_PAYMENTS = [
  {
    id: "1",
    type: "Basic Blue Bundle",
    dateTime: "2025-06-25T18:30:00.000+00:00",
    connects: 10,
    amount: 891,
    status: PaymentFilterStatus.COMPLETED,
    invoice: true,
  },
  {
    id: "2",
    type: "Custom Connects",
    dateTime: "2025-05-24T18:30:00.000+00:00",
    connects: 5,
    amount: 495,
    status: PaymentFilterStatus.CANCELLED,
    invoice: false,
  },
  {
    id: "3",
    type: "Priority Listing",
    dateTime: "2025-06-02T18:30:00.000+00:00",
    connects: null,
    amount: 999,
    status: PaymentFilterStatus.CANCELLED,
    invoice: false,
  },
];
