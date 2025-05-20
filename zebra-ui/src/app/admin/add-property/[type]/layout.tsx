"use client";

import { APIProvider } from "@vis.gl/react-google-maps";
import { Form, Formik, FormikProvider } from "formik";
import { useParams, useRouter } from "next/navigation";
import ListPropertySuccessSvg from "public/icons/list-property-success.svg";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  ListPropertyFormStep as AddPropertyFormStep,
  ListPropertyRouteStep as AddPropertyRouteStep,
  PropertyType,
} from "@/common/enums";
import { Dialog, DialogContent } from "@/components/Dialog";
import { PropertyPhoto } from "@/interfaces/PropertyPhoto";
import { useDialog } from "@/providers/DialogContextProvider";
import {
  usePresignedUrlsMutation,
  usePropertyAddMutation,
} from "@/store/apiSlice";
import { setFileURLMap, setPropertyID } from "@/store/listPropertySlice";
import { RootState } from "@/store/store";

import FlatmatesStepper from "../components/FlatmatesStepper";
import RentStepper from "../components/RentStepper";
import ResaleStepper from "../components/ResaleStepper";

const ListPropertySuccess = ListPropertySuccessSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;

export const dynamicParams = true;

export default function AddPropertyTypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { token } = useSelector((state: RootState) => state.admin);
  // if (!token) {
  //   redirect("/admin/login");
  // }

  const [getPresignedUrls] = usePresignedUrlsMutation();
  const [postProperty] = usePropertyAddMutation();
  const params = useParams();
  const dispatch = useDispatch();
  // const uploadFiles = useS3Uploader();
  const type = params?.type as string; // Optional: add type assertion
  const router = useRouter();
  const { openDialog, isDialogOpen, closeDialog } = useDialog();
  //   const { isMobile } = useDeviceContext();

  const [currentStep, setCurrentStep] = useState<AddPropertyFormStep>(
    AddPropertyFormStep.PROPERTY_DETAILS,
  );
  const [completedSteps, setCompletedSteps] = useState<
    Set<AddPropertyFormStep>
  >(new Set());
  const formKey = `${type}Form` as "rentForm" | "resaleForm" | "flatmatesForm";
  const formState = useSelector(
    (state: RootState) => state.listProperty[formKey],
  );
  const isFormValid = formState?.isValid;
  const initialValues = formState?.data || {};

  const markStepAsCompleted = (step: AddPropertyFormStep) => {
    setCompletedSteps((prev) => new Set(prev).add(step));
  };

  const setRoute = (stepSlug: string) => {
    const route = `/admin/add-property/${type}/${stepSlug}`;
    router.push(route);
  };

  const uploadFilesToS3 = async () => {
    const photos = formState?.data?.images || [];
    if (photos.length > 0) {
      // create a map of file names to their corresponding Blob URLs
      const photosToUpload = photos.map((photo: PropertyPhoto) => {
        return {
          name: photo.file.name,
          url: photo.url,
          S3url: photo.S3Url,
          type: photo.file.type,
        };
      });
      console.log("photosToUpload", photosToUpload);
      // uploadFiles(photosToUpload);
    }
  };

  const getPresignedPhotoUrls = async () => {
    const photos = formState?.data?.images || [];
    if (photos.length > 0) {
      // Step 1: Request pre-signed URLs
      const fileMap: Record<string, string> = {};
      photos.forEach((f: PropertyPhoto) => {
        fileMap[encodeURIComponent(f.file.name)] = f.file.type;
      });
      console.log(fileMap);
      const presignedUrlsResponse = await getPresignedUrls({
        fileMap,
      })
        .unwrap()
        .catch((error: Error) => {
          console.error("Error fetching presigned URLs:", error);
        });
      if (!presignedUrlsResponse) {
        console.error("No presigned URLs received");
        return;
      }
      dispatch(setPropertyID(presignedUrlsResponse.propertyID));
      dispatch(
        setFileURLMap({
          type: formKey,
          data: presignedUrlsResponse.fileURLMap,
        }),
      );
    }
  };

  const handleBack = () => {
    setCompletedSteps((prev) => {
      const updatedSteps = new Set(prev);
      if (currentStep === AddPropertyFormStep.PROPERTY_DETAILS) {
        router.back();
      } else if (currentStep === AddPropertyFormStep.LOCALITY_DETAILS) {
        updatedSteps.delete(AddPropertyFormStep.PROPERTY_DETAILS);
        setCurrentStep(AddPropertyFormStep.PROPERTY_DETAILS);
        setRoute(AddPropertyRouteStep.PROPERTY_DETAILS);
      } else if (currentStep === AddPropertyFormStep.RENTAL_DETAILS) {
        updatedSteps.delete(AddPropertyFormStep.LOCALITY_DETAILS);
        setCurrentStep(AddPropertyFormStep.LOCALITY_DETAILS);
        setRoute(AddPropertyRouteStep.LOCALITY_DETAILS);
      } else if (currentStep === AddPropertyFormStep.RESALE_DETAILS) {
        updatedSteps.delete(AddPropertyFormStep.LOCALITY_DETAILS);
        setCurrentStep(AddPropertyFormStep.LOCALITY_DETAILS);
        setRoute(AddPropertyRouteStep.LOCALITY_DETAILS);
      } else if (currentStep === AddPropertyFormStep.GALLERY) {
        if (type === "resale") {
          updatedSteps.delete(AddPropertyFormStep.RESALE_DETAILS);
          setCurrentStep(AddPropertyFormStep.RESALE_DETAILS);
          setRoute(AddPropertyRouteStep.RESALE_DETAILS);
        } else {
          updatedSteps.delete(AddPropertyFormStep.RENTAL_DETAILS);
          setCurrentStep(AddPropertyFormStep.RENTAL_DETAILS);
          setRoute(AddPropertyRouteStep.RENTAL_DETAILS);
        }
      } else if (currentStep === AddPropertyFormStep.ADDITIONAL_INFO) {
        updatedSteps.delete(AddPropertyFormStep.GALLERY);
        setCurrentStep(AddPropertyFormStep.GALLERY);
        setRoute(AddPropertyRouteStep.GALLERY);
      } else if (currentStep === AddPropertyFormStep.DONE) {
        updatedSteps.delete(AddPropertyFormStep.ADDITIONAL_INFO);
        setCurrentStep(AddPropertyFormStep.ADDITIONAL_INFO);
      }
      return updatedSteps;
    });
  };

  const handleSaveAndNext = async () => {
    markStepAsCompleted(currentStep);
    if (currentStep === AddPropertyFormStep.PROPERTY_DETAILS) {
      setCurrentStep(AddPropertyFormStep.LOCALITY_DETAILS);
      setRoute(AddPropertyRouteStep.LOCALITY_DETAILS);
    } else if (currentStep === AddPropertyFormStep.LOCALITY_DETAILS) {
      if (type === "resale") {
        setCurrentStep(AddPropertyFormStep.RESALE_DETAILS);
        setRoute(AddPropertyRouteStep.RESALE_DETAILS);
      } else {
        setCurrentStep(AddPropertyFormStep.RENTAL_DETAILS);
        setRoute(AddPropertyRouteStep.RENTAL_DETAILS);
      }
    } else if (
      currentStep === AddPropertyFormStep.RENTAL_DETAILS ||
      currentStep === AddPropertyFormStep.RESALE_DETAILS
    ) {
      setCurrentStep(AddPropertyFormStep.GALLERY);
      setRoute(AddPropertyRouteStep.GALLERY);
    } else if (currentStep === AddPropertyFormStep.GALLERY) {
      // Make API call to get presigned-urls
      await getPresignedPhotoUrls();
      setCurrentStep(AddPropertyFormStep.ADDITIONAL_INFO);
      setRoute(AddPropertyRouteStep.ADDITIONAL_INFO);
    } else if (currentStep === AddPropertyFormStep.ADDITIONAL_INFO) {
      uploadFilesToS3();
      setCurrentStep(AddPropertyFormStep.DONE);
      openDialog("list-property-success-dialog");
    }
  };

  const handlePreviewListing = async () => {
    console.log("Preview Listing");
    const propertyDetails = formState.data!.propertyDetails;
    const localityDetails = formState.data!.localityDetails;
    const rentalOrResaleDetails =
      formKey === "resaleForm"
        ? formState.data!.resaleDetails
        : formState.data!.rentalDetails;
    const images = formState.data!.images.map(
      (image: PropertyPhoto) => image.url,
    );
    const additionalInfo = formState.data!.additionalInfo;

    const postPropertyResponse = await postProperty({
      propertyID: "1",
      ...propertyDetails,
      ...localityDetails,
      ...rentalOrResaleDetails,
      images,
      ...additionalInfo,
    })
      .unwrap()
      .catch((error: Error) => {
        console.error("Error posting property:", error);
      });
    if (postPropertyResponse) {
      console.log("Property posted successfully");
    }
  };

  const renderStepper = () => {
    switch (type) {
      case "rent":
        return (
          <RentStepper
            currentStep={currentStep}
            completedSteps={completedSteps}
          />
        );
      case "resale":
        return (
          <ResaleStepper
            currentStep={currentStep}
            completedSteps={completedSteps}
          />
        );
      case "flatmates":
        return (
          <FlatmatesStepper
            currentStep={currentStep}
            completedSteps={completedSteps}
          />
        );
      default:
        return null;
    }
  };

  const getStepsForPropertyType = (type: string): string[] => {
    const baseSteps = [
      AddPropertyFormStep.PROPERTY_DETAILS,
      AddPropertyFormStep.LOCALITY_DETAILS,
      AddPropertyFormStep.GALLERY,
      AddPropertyFormStep.ADDITIONAL_INFO,
    ];

    if (
      type.toUpperCase() === PropertyType.RENT ||
      type.toUpperCase() === PropertyType.FLATMATES
    ) {
      return [
        ...baseSteps.slice(0, 2),
        AddPropertyFormStep.RENTAL_DETAILS,
        ...baseSteps.slice(2),
      ];
    } else if (type.toUpperCase() === PropertyType.RESALE) {
      return [
        ...baseSteps.slice(0, 2),
        AddPropertyFormStep.RESALE_DETAILS,
        ...baseSteps.slice(2),
      ];
    }
    return baseSteps;
  };

  const calculateProgressPercent = (type: string, currentStep: string) => {
    const steps = getStepsForPropertyType(type);
    const currentIndex = steps.findIndex((step) => step === currentStep);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  return (
    <>
      {/* <section
        className={`py-2 px-4 fixed top-0 left-0 right-0 z-50 h-[55px] border-gray-200 bg-white flex flex-col justify-center items-center w-full md:hidden`}
      >
        {renderStepperMobile()}
      </section> */}
      <div className="h-[2px] fixed w-full bg-gray-200 mt-auto z-50">
        <div
          className="h-[2px] bg-red-500 absolute top-0 left-0 transition-all duration-300"
          style={{ width: `${calculateProgressPercent(type, currentStep)}%` }}
        />
      </div>
      <div className="flex flex-col w-full h-full top-14">
        {/* Background SVG behind left section only */}
        {/* <div className="left-0 top-14 bottom-0 z-40 w-[33.33%] fixed  bg-gray-50 max-md:hidden"> */}
        {/* <Image
            src="/images/property-add-graphic.svg"
            alt="Property Graphic"
            width={500}
            height={500}
            className="w-full h-full object-cover max-xl:hidden"
          /> */}
        {/* Left side - Steps navigation */}
        {/* <div className="absolute right-8 top-12 flex z-50"> */}
        <div className="flex p-3 justify-between sticky top-16 z-40 bg-white border-b border-b-gray-100 shadow-md xl:px-28 dark:bg-gray-900">
          {/* <div className="absolute right-8 top-12 flex z-50"> */}
          {renderStepper()}
        </div>
        {/* </div> */}
        <div className="container right-0 max-md:ml-auto pt-8 md:pt-12 pb-20 mx-auto xl:px-28 lg:px-14 md:px-8 px-8">
          {/* <div className="container right-0 ml-[33.33%] max-md:ml-auto pt-8 md:pt-12 pb-20 mx-auto xl:px-28 lg:px-14 md:px-8 px-8"> */}
          <div className="flex flex-col">
            <Formik
              initialValues={initialValues}
              onSubmit={(values) => {
                console.log("Submit all data:", values);
                // send to backend
              }}
              validateOnChange={false}
              validateOnBlur={false}
            >
              {(formik) => (
                <Form>
                  <APIProvider
                    apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
                    libraries={["places"]}
                  >
                    <FormikProvider value={formik}>{children}</FormikProvider>
                  </APIProvider>
                </Form>
              )}
            </Formik>
          </div>
          <div className="fixed bottom-0 left-80 right-0 flex justify-between py-2 px-4 border-t border-t-gray-300 bg-white dark:bg-gray-900">
            {/* <div className="fixed bottom-0 left-0 ml-[33.33%] max-md:ml-auto right-0 flex justify-between py-2 mx-auto xl:px-28 lg:px-14 md:px-8 px-8 border-t border-t-gray-300 bg-white"> */}
            <button
              type="button"
              className="px-6 py-3 border border-gray-300 hover:border-gray-500 text-gray-900 rounded-xl hover:bg-gray-50 disabled:bg-gray-300 disabled:cursor-not-allowed dark:text-gray-300 hover:dark:bg-gray-800"
              onClick={handleBack}
            >
              Back
            </button>

            <button
              type="submit"
              className="px-6 py-3 border border-red-500 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500 disabled:border-gray-300"
              disabled={!isFormValid}
              onClick={handleSaveAndNext}
            >
              Save & Continue
            </button>
          </div>
        </div>
        {isDialogOpen("list-property-success-dialog") && (
          <Dialog
            id="list-property-success-dialog"
            type="card"
            onClose={() => closeDialog("list-property-success-dialog")}
            entryAnimation="animate-fade-in"
            exitAnimation="animate-fade-out"
          >
            <DialogContent>
              <div className="flex flex-col items-center justify-center text-center p-8 gap-4">
                <div className="relative overflow-hidden rounded-lg">
                  <div className="absolute inset-0 shadow-[inset_0_0_25px_25px_rgba(255,255,255,0.8)] z-20"></div>
                  <ListPropertySuccess />
                </div>
                <h2 className="text-3xl text-gray-800">Congratulations!</h2>
                <p className="text-gray-600 text-lg">
                  You have successfully posted your property,
                  <br />
                  it will be live within 2 Hrs.
                </p>

                {/* Action buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      closeDialog("list-property-success-dialog");
                    }}
                    className="px-24 py-3 text-black border font-medium rounded-lg hover:bg-red-600 hover:text-white transition duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handlePreviewListing}
                    className="px-24 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition duration-200"
                  >
                    Preview Listing
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </>
  );
}
