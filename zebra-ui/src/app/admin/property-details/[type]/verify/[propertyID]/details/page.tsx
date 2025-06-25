"use client";

import { Form, Formik, FormikProvider } from "formik";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

// --- Imports from both files ---
import {
  GetPropertyByIDResponse,
  PropertyDetailsFormValues,
} from "@/interfaces/Property";
import { RootState } from "@/store/store";
import {
  setPropertyData,
  setPropertyLoading,
} from "@/store/propertyDetailsSlice";
import { dummyGetRentPropertyDetails } from "@/mock/propertyDetailsDummy";
import { transformApiToFormValues } from "@/utils/dataTransformer";

// Form Section Components
import PropertyDetailsForm from "@/app/admin/property-details/components/PropertyDetailsForm";
import LocalityDetailsForm from "@/app/admin/property-details/components/LocalityDetailsForm";
import AdditionalInfoForm from "@/app/admin/property-details/components/AdditionalInfoForm";
import GalleryForm from "@/app/admin/property-details/components/GalleryForm";
import RentalDetailsForm from "@/app/admin/property-details/components/RentalDetailsForm";
import ResaleDetailsForm from "@/app/admin/property-details/components/ResaleDetailsForm";

// Verification and Owner Details Components
import { OwnerDetails } from "@/app/admin/property-details/components/OwnerDetails";
import { VerificationSection } from "@/app/admin/property-details/components/VerificationSection";
import { dummyUserDataList } from "@/mock/userDetailsDummy";

export default function VerifyPropertyDetailsPage() {
  const { type } = useParams() as { type: "rent" | "resale" | "flatmate" };
  const router = useRouter();
  const dispatch = useDispatch();
  const currentUser = dummyUserDataList[0];

  // --- From DetailsPage: Formik & Edit Mode State ---
  const [editMode, setEditMode] = useState(false);

  // --- From VerifyPage: Verification State ---
  const [propertyComment, setPropertyComment] = useState("");
  const [galleryComment, setGalleryComment] = useState("");
  const [ownerComment, setOwnerComment] = useState("");
  const [isPropertyVerified, setIsPropertyVerified] = useState(false);
  const [isGalleryVerified, setIsGalleryVerified] = useState(false);
  const [isOwnerVerified, setIsOwnerVerified] = useState(false);

  // --- From DetailsPage: Data Fetching and Formik Initialization ---
  useEffect(() => {
    dispatch(setPropertyLoading());
    const timer = setTimeout(() => {
      const apiResponse: GetPropertyByIDResponse =
        dummyGetRentPropertyDetails as any;
      dispatch(setPropertyData(apiResponse));
    }, 500);
    return () => clearTimeout(timer);
  }, [dispatch]);

  const propertyDataFromStore = useSelector(
    (state: RootState) => state.propertyDetails.data,
  );
  const status = useSelector(
    (state: RootState) => state.propertyDetails.status,
  );
  const initialValues = useMemo(
    () => transformApiToFormValues(propertyDataFromStore),
    [propertyDataFromStore],
  );

  // --- From VerifyPage: Derived state for verification logic ---
  const isPropertyCommentValid = useMemo(
    () => propertyComment.trim().length >= 3,
    [propertyComment],
  );
  const isGalleryCommentValid = useMemo(
    () => galleryComment.trim().length >= 3,
    [galleryComment],
  );
  const isOwnerCommentValid = useMemo(
    () => ownerComment.trim().length >= 3,
    [ownerComment],
  );
  const isFormFullyVerified = useMemo(
    () => isPropertyVerified && isGalleryVerified && isOwnerVerified,
    [isPropertyVerified, isGalleryVerified, isOwnerVerified],
  );

  // --- Event Handlers ---
  const handleSaveChanges = async (values: PropertyDetailsFormValues) => {
    console.log("Submitting all changes:", values);
    setEditMode(false);
  };

  const handleFinalVerification = () => {
    if (!isFormFullyVerified) return;
    console.log("Property Verified!", {
      propertyComment,
      galleryComment,
      ownerComment,
    });
  };

  const viewUserDetails = (userPhoneNo: string) => {
    router.push(`/admin/user-details/${userPhoneNo}`);
  };

  // --- Loading and Error States ---
  if (
    status === "loading" ||
    status === "idle" ||
    !initialValues.propertyDetails
  ) {
    return (
      <div className="h-full flex items-center justify-center text-lg">
        Loading property details...
      </div>
    );
  }
  if (status === "failed") {
    return (
      <div className="h-full flex items-center justify-center text-lg">
        Error loading property. Please try again.
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-100 flex flex-col px-4 py-8">
      <div className="flex-1 flex min-h-0 gap-5">
        <Formik
          initialValues={initialValues}
          onSubmit={handleSaveChanges}
          enableReinitialize
        >
          {(formik) => (
            <Form className="flex-1 flex min-h-0 gap-5">
              {/* Left Scrollable Column now contains the full form */}
              <div className="flex flex-col gap-5 w-2/3 overflow-y-auto pr-2 relative">
                <div></div>
                <FormikProvider value={formik}>
                  {/* --- Sticky Header from DetailsPage --- */}
                  <div className="flex justify-between bg-white py-3 px-6 sticky top-0 rounded-xl z-10 border-b shadow-sm items-center">
                    <h1 className="text-2xl font-bold">
                      {editMode ? "Editing Property" : "Viewing Property"}
                    </h1>
                    {editMode ? (
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            formik.resetForm();
                            setEditMode(false);
                          }}
                          className="border border-red-500 text-red-500 py-1 px-4 text-lg font-medium rounded-xl hover:bg-red-500 hover:text-white"
                        >
                          Discard
                        </button>
                        <button
                          type="submit"
                          className="border border-red-500 text-red-500 py-1 px-4 text-lg font-medium rounded-xl hover:bg-red-500 hover:text-white"
                          disabled={!formik.dirty || !formik.isValid}
                        >
                          Save Changes
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setEditMode(true)}
                        className="border border-red-500 text-red-500 py-1 px-4 text-lg font-medium rounded-xl hover:bg-red-500 hover:text-white"
                      >
                        Edit
                      </button>
                    )}
                  </div>

                  {/* --- Form Sections from DetailsPage --- */}
                  <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-6">
                    <PropertyDetailsForm disabled={!editMode} type={type} />
                    {/* </div> */}
                    {/* <div className="bg-white rounded-xl p-6 shadow-sm"> */}
                    <LocalityDetailsForm disabled={!editMode} type={type} />
                    {/* </div> */}
                    {/* <div className="bg-white rounded-xl p-6 shadow-sm"> */}
                    {type === "resale" ? (
                      <ResaleDetailsForm disabled={!editMode} type={type} />
                    ) : (
                      <RentalDetailsForm disabled={!editMode} type={type} />
                    )}
                    {/* </div> */}
                    {/* <div className="bg-white rounded-xl p-6 shadow-sm"> */}
                    <AdditionalInfoForm disabled={!editMode} type={type} />
                  </div>
                  {/* Gallery Section */}
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <GalleryForm disabled={!editMode} type={type} />
                  </div>
                  {/* Owner Details Section */}
                  <div className="p-6 rounded-xl bg-white shadow-sm">
                    <OwnerDetails
                      currentUser={currentUser}
                      viewUserDetails={viewUserDetails}
                    />
                  </div>
                </FormikProvider>
              </div>

              {/* Right Fixed Column (Verification Panel) */}
              <div className="w-1/3 bg-white rounded-xl p-6 flex flex-col justify-between shadow-sm">
                <div className="flex flex-col gap-6">
                  <h1 className="text-3xl font-bold border-b pb-4">
                    Verification Panel
                  </h1>
                  <VerificationSection
                    title="Property Details"
                    comment={propertyComment}
                    setComment={setPropertyComment}
                    onVerify={() => setIsPropertyVerified(true)}
                    onEdit={() => setIsPropertyVerified(false)}
                    isVerified={isPropertyVerified}
                    isCommentValid={isPropertyCommentValid}
                  />
                  <VerificationSection
                    title="Property Gallery"
                    comment={galleryComment}
                    setComment={setGalleryComment}
                    onVerify={() => setIsGalleryVerified(true)}
                    onEdit={() => setIsGalleryVerified(false)}
                    isVerified={isGalleryVerified}
                    isCommentValid={isGalleryCommentValid}
                  />
                  <VerificationSection
                    title="Owner Details"
                    comment={ownerComment}
                    setComment={setOwnerComment}
                    onVerify={() => setIsOwnerVerified(true)}
                    onEdit={() => setIsOwnerVerified(false)}
                    isVerified={isOwnerVerified}
                    isCommentValid={isOwnerCommentValid}
                  />
                </div>
                <button
                  onClick={handleFinalVerification}
                  disabled={!isFormFullyVerified}
                  className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl py-3 px-4 text-xl font-bold transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Verify Property
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

// "use client";

// import { Form, Formik, FormikProvider } from "formik";
// import { useParams, useRouter } from "next/navigation";
// import { useEffect, useMemo, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

// import {
//   GetPropertyByIDResponse,
//   PropertyDetailsFormValues,
// } from "@/interfaces/Property";
// import { dummyGetRentPropertyDetails } from "@/mock/propertyDetailsDummy";
// import { dummyUserDataList } from "@/mock/userDetailsDummy";
// import {
//   setPropertyData,
//   setPropertyLoading,
// } from "@/store/propertyDetailsSlice";
// import { RootState } from "@/store/store";
// import { transformApiToFormValues } from "@/utils/dataTransformer";

// // Dumb form sections ---------------------------------------------------------
// import PropertyDetailsForm from "@/app/admin/property-details/components/PropertyDetailsForm";
// import LocalityDetailsForm from "@/app/admin/property-details/components/LocalityDetailsForm";
// import RentalDetailsForm from "@/app/admin/property-details/components/RentalDetailsForm";
// import ResaleDetailsForm from "@/app/admin/property-details/components/ResaleDetailsForm";
// import AdditionalInfoForm from "@/app/admin/property-details/components/AdditionalInfoForm";
// import GalleryForm from "@/app/admin/property-details/components/GalleryForm";

// // Verification‑panel bits ----------------------------------------------------
// import { OwnerDetails } from "@/app/admin/property-details/components/OwnerDetails";
// import { VerificationSection } from "@/app/admin/property-details/components/VerificationSection";

// export default function VerifyPropertyDetailsPage() {
//   // ───────────────────────────────── state / fetch ───────────────────────────
//   const { propertyID, type } = useParams() as {
//     propertyID: string;
//     type: "rent" | "resale" | "flatmate";
//   };
//   const dispatch = useDispatch();
//   const router = useRouter();

//   const [editMode, setEditMode] = useState(false);
//   const [propertyComment, setPropertyComment] = useState("");
//   const [galleryComment, setGalleryComment] = useState("");
//   const [ownerComment, setOwnerComment] = useState("");
//   const [isPropertyVerified, setIsPropertyVerified] = useState(false);
//   const [isGalleryVerified, setIsGalleryVerified] = useState(false);
//   const [isOwnerVerified, setIsOwnerVerified] = useState(false);

//   const currentUser = dummyUserDataList[0];

//   useEffect(() => {
//     dispatch(setPropertyLoading());
//     const t = setTimeout(() => {
//       dispatch(
//         setPropertyData(
//           dummyGetRentPropertyDetails as unknown as GetPropertyByIDResponse,
//         ),
//       );
//     }, 500);
//     return () => clearTimeout(t);
//   }, [dispatch]);

//   const propertyData = useSelector((s: RootState) => s.propertyDetails.data);
//   const status = useSelector((s: RootState) => s.propertyDetails.status);

//   const initialValues = useMemo(
//     () => transformApiToFormValues(propertyData),
//     [propertyData],
//   );

//   // ───────────────────────────────── guards ──────────────────────────────────
//   if (status === "loading" || status === "idle" || !initialValues) {
//     return (
//       <div className="h-full flex items-center justify-center text-lg">
//         Loading property details…
//       </div>
//     );
//   }
//   if (status === "failed") {
//     return (
//       <div className="h-full flex items-center justify-center text-lg">
//         Error loading property.
//       </div>
//     );
//   }

//   // helper fns ----------------------------------------------------------------
//   const isCommentValid = (c: string) => c.trim().length >= 3;
//   const allVerified =
//     isPropertyVerified && isGalleryVerified && isOwnerVerified;

//   // handlers ------------------------------------------------------------------
//   const saveChanges = async (v: PropertyDetailsFormValues) => {
//     console.log("submit", v);
//     setEditMode(false);
//   };
//   const finalVerify = () => {
//     if (!allVerified) return;
//     console.log("verified", { propertyComment, galleryComment, ownerComment });
//   };
//   const viewUser = (ph: string) => router.push(`/admin/user-details/${ph}`);

//   // ───────────────────────────────── layout ──────────────────────────────────
//   return (
//     <div className="h-full w-full box-border bg-gray-100 px-4 py-8 grid grid-cols-[2fr_1fr] gap-5 overflow-hidden min-h-0 min-w-0">
//       {/* ——————————————— LEFT (form) ——————————————— */}
//       <Formik
//         initialValues={initialValues}
//         enableReinitialize
//         onSubmit={saveChanges}
//       >
//         {(formik) => (
//           <Form className="flex flex-col min-h-0 min-w-0 overflow-hidden">
//             {/* sticky bar */}
//             {/* <div className="flex justify-between bg-white py-3 px-6 sticky top-0 rounded-xl z-10 border-b border-b-gray-400 shadow-sm items-center">
//               <h1 className="text-2xl">
//                 {editMode ? "Edit Mode" : "View Mode"}
//               </h1>
//               {editMode ? (
//                 <div className="flex gap-3">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       formik.resetForm();
//                       setEditMode(false);
//                     }}
//                     className="border border-red-500 text-red-500 py-1 px-4 text-lg font-medium rounded-xl hover:bg-red-500 hover:text-white"
//                   >
//                     Discard
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={!formik.dirty || !formik.isValid}
//                     className="border border-red-500 text-red-500 py-1 px-4 text-lg font-medium rounded-xl hover:bg-red-500 hover:text-white disabled:bg-gray-300 disabled:text-gray-500"
//                   >
//                     Save Changes
//                   </button>
//                 </div>
//               ) : (
//                 <button
//                   type="button"
//                   onClick={() => setEditMode(true)}
//                   className="border border-red-500 text-red-500 py-1 px-4 text-lg font-medium rounded-xl hover:bg-red-500 hover:text-white"
//                 >
//                   Edit
//                 </button>
//               )}
//             </div> */}

//             {/* scrollable sections */}
//             <FormikProvider value={formik}>
//               <div className="flex-1 min-h-0 min-w-0 overflow-y-auto flex flex-col gap-8 pt-6 pr-2">
//                 <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-8">
//                   <PropertyDetailsForm disabled={!editMode} type={type} />
//                   <LocalityDetailsForm disabled={!editMode} type={type} />
//                   {type === "resale" ? (
//                     <ResaleDetailsForm disabled={!editMode} type={type} />
//                   ) : (
//                     <RentalDetailsForm disabled={!editMode} type={type} />
//                   )}
//                   <AdditionalInfoForm disabled={!editMode} type={type} />
//                 </div>

//                 <div className="bg-white rounded-xl p-6 shadow-sm">
//                   <GalleryForm disabled={!editMode} type={type} />
//                 </div>

//                 <div className="p-5 rounded-xl bg-white shadow-sm">
//                   <OwnerDetails
//                     currentUser={currentUser}
//                     viewUserDetails={viewUser}
//                   />
//                 </div>
//               </div>
//             </FormikProvider>
//           </Form>
//         )}
//       </Formik>

//       {/* ——————————————— RIGHT (verify) ——————————————— */}
//       <div className="min-h-0 min-w-0 bg-white rounded-xl p-6 shadow-sm flex flex-col overflow-hidden">
//         <div className="flex-1 overflow-y-auto flex flex-col gap-6">
//           <h2 className="text-3xl font-bold border-b pb-4">
//             Verification Panel
//           </h2>
//           <VerificationSection
//             title="Property Details"
//             comment={propertyComment}
//             setComment={setPropertyComment}
//             onVerify={() => setIsPropertyVerified(true)}
//             onEdit={() => setIsPropertyVerified(false)}
//             isVerified={isPropertyVerified}
//             isCommentValid={isCommentValid(propertyComment)}
//           />
//           <VerificationSection
//             title="Property Gallery"
//             comment={galleryComment}
//             setComment={setGalleryComment}
//             onVerify={() => setIsGalleryVerified(true)}
//             onEdit={() => setIsGalleryVerified(false)}
//             isVerified={isGalleryVerified}
//             isCommentValid={isCommentValid(galleryComment)}
//           />
//           <VerificationSection
//             title="Owner Details"
//             comment={ownerComment}
//             setComment={setOwnerComment}
//             onVerify={() => setIsOwnerVerified(true)}
//             onEdit={() => setIsOwnerVerified(false)}
//             isVerified={isOwnerVerified}
//             isCommentValid={isCommentValid(ownerComment)}
//           />
//         </div>
//         <button
//           type="button"
//           onClick={finalVerify}
//           disabled={!allVerified}
//           className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white rounded-xl py-3 text-xl font-bold transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
//         >
//           Verify Property
//         </button>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { OwnerDetails } from "@/app/admin/property-details/components/OwnerDetails";
// import { VerificationSection } from "@/app/admin/property-details/components/VerificationSection";
// import {
//   GetPropertyByIDResponse,
//   PropertyDetailsFormValues,
// } from "@/interfaces/Property";
// import { dummyGetRentPropertyDetails } from "@/mock/propertyDetailsDummy";
// import { dummyUserDataList } from "@/mock/userDetailsDummy";
// import {
//   setPropertyData,
//   setPropertyLoading,
// } from "@/store/propertyDetailsSlice";
// import { RootState } from "@/store/store";
// import { transformApiToFormValues } from "@/utils/dataTransformer";
// import { useRouter } from "next/navigation";
// import { useState, useMemo, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";

// export default function VerifyPropertyDetailsPage() {
//   const router = useRouter();
//   const currentUser = dummyUserDataList[0];
//   const dispatch = useDispatch();
//   const [editMode, setEditMode] = useState(false);

//   const [propertyComment, setPropertyComment] = useState("");
//   const [galleryComment, setGalleryComment] = useState("");
//   const [ownerComment, setOwnerComment] = useState("");

//   const [isPropertyVerified, setIsPropertyVerified] = useState(false);
//   const [isGalleryVerified, setIsGalleryVerified] = useState(false);
//   const [isOwnerVerified, setIsOwnerVerified] = useState(false);

//   const isPropertyCommentValid = useMemo(
//     () => propertyComment.trim().length >= 3,
//     [propertyComment],
//   );
//   const isGalleryCommentValid = useMemo(
//     () => galleryComment.trim().length >= 3,
//     [galleryComment],
//   );
//   const isOwnerCommentValid = useMemo(
//     () => ownerComment.trim().length >= 3,
//     [ownerComment],
//   );

//   const isFormFullyVerified = useMemo(
//     () => isPropertyVerified && isGalleryVerified && isOwnerVerified,
//     [isPropertyVerified, isGalleryVerified, isOwnerVerified],
//   );

//   const viewUserDetails = (userPhoneNo: string) => {
//     router.push(`/admin/user-details/${userPhoneNo}`);
//   };

//   const handleFinalVerification = () => {
//     if (!isFormFullyVerified) return;
//     console.log("Property Verified!");
//     console.log({
//       propertyComment,
//       galleryComment,
//       ownerComment,
//     });
//   };

//   useEffect(() => {
//     dispatch(setPropertyLoading());

//     const timer = setTimeout(() => {
//       const apiResponse: GetPropertyByIDResponse =
//         dummyGetRentPropertyDetails as any;
//       dispatch(setPropertyData(apiResponse));
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [dispatch]);

//   const propertyDataFromStore = useSelector(
//     (state: RootState) => state.propertyDetails.data,
//   );
//   const status = useSelector(
//     (state: RootState) => state.propertyDetails.status,
//   );
//   const initialValues = useMemo(
//     () => transformApiToFormValues(propertyDataFromStore),
//     [propertyDataFromStore],
//   );

//   const handleSaveChanges = async (values: PropertyDetailsFormValues) => {
//     console.log("Submitting all changes:", values);
//     // await updateProperty({ propertyId, data: transformFormToApi(values) }).unwrap();
//     setEditMode(false);
//   };

//   if (status === "loading" || status === "idle" || !initialValues) {
//     return (
//       <div className="h-full flex items-center justify-center text-lg">
//         Loading property details...
//       </div>
//     );
//   }

//   if (status === "failed") {
//     return (
//       <div className="h-full flex items-center justify-center text-lg">
//         Error loading property. Please try again.
//       </div>
//     );
//   }

//   return (
//     <div className="h-full bg-gray-100 flex flex-col px-4 py-8">
//       <div className="flex-1 flex min-h-0 gap-5">
//         {/* Left Scrollable Column */}
//         <div className="flex flex-col gap-5 w-2/3 overflow-y-auto pr-2">
//           <div className="p-16 bg-white rounded-xl shadow-sm">
//             Property Details Section
//           </div>
//           <div className="p-16 bg-white rounded-xl shadow-sm text-gray-800">
//             Property Gallery Section
//           </div>

//           <div className="p-5 rounded-xl bg-white shadow-sm flex flex-col gap-4">
//             <OwnerDetails
//               currentUser={currentUser}
//               viewUserDetails={viewUserDetails}
//             />
//           </div>
//         </div>

//         {/* Right Fixed Column */}
//         <div className="w-1/3 bg-white rounded-xl p-6 flex flex-col justify-between shadow-sm">
//           <div className="flex flex-col gap-6">
//             <h1 className="text-3xl font-bold border-b pb-4">
//               Verification Panel
//             </h1>
//             <VerificationSection
//               title="Property Details"
//               comment={propertyComment}
//               setComment={setPropertyComment}
//               onVerify={() => setIsPropertyVerified(true)}
//               onEdit={() => setIsPropertyVerified(false)}
//               isVerified={isPropertyVerified}
//               isCommentValid={isPropertyCommentValid}
//             />
//             <VerificationSection
//               title="Property Gallery"
//               comment={galleryComment}
//               setComment={setGalleryComment}
//               onVerify={() => setIsGalleryVerified(true)}
//               onEdit={() => setIsGalleryVerified(false)}
//               isVerified={isGalleryVerified}
//               isCommentValid={isGalleryCommentValid}
//             />
//             <VerificationSection
//               title="Owner Details"
//               comment={ownerComment}
//               setComment={setOwnerComment}
//               onVerify={() => setIsOwnerVerified(true)}
//               onEdit={() => setIsOwnerVerified(false)}
//               isVerified={isOwnerVerified}
//               isCommentValid={isOwnerCommentValid}
//             />
//           </div>

//           <button
//             onClick={handleFinalVerification}
//             disabled={!isFormFullyVerified}
//             className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl py-3 px-4 text-xl font-bold transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
//           >
//             Verify Property
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
