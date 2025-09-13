"use client";

import "react-international-phone/style.css";

import { X } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  ListPropertyDesktopStep,
  ListPropertyMobileStep,
  PropertyListingType,
} from "@/common/enums";
import Carousel2D from "@/components/Carousel2D";
import CustomerSupportBanner from "@/components/CustomerSupportBanner";
import GetStarted from "@/components/GetStarted";
import ListingOptions from "@/components/ListingOptions";
import ListPropertyAdvantages from "@/components/ListPropertyAdvantages";
import ListWithUs from "@/components/ListWithUs";
import PropertyTypeOptions from "@/components/PropertyTypeOptions";
import { TestimonialCard } from "@/components/Testimonials";
import PropertiesData from "@/data/PropertiesData.json";
import { Footer } from "@/layout-components";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import {
  setHideFooter,
  setHideHeader,
  setHideStickyNavBar,
} from "@/store/appSlice";
import { clearFormData } from "@/store/listPropertySlice";
import { RootState } from "@/store/store";
import { ImageWithLoader } from "@/utility-components";

import EditPropertyLoading from "./loading";

const EditPropertyPage = dynamic(
  () =>
    Promise.resolve(() => {
      const { isMobile } = useDeviceContext();
      const router = useRouter();
      const listingType = useSelector(
        (state: RootState) => state.listProperty.listingType,
      );
      const propertyCategory = useSelector(
        (state: RootState) => state.listProperty.propertyCategory,
      );
      const dispatch = useDispatch();
      const [mobileStep, setMobileStep] = useState<ListPropertyMobileStep>(
        ListPropertyMobileStep.GET_STARTED,
      );
      const [desktopStep, setDesktopStep] = useState<ListPropertyDesktopStep>(
        ListPropertyDesktopStep.LISTING_OPTIONS,
      );

      const testimonials = PropertiesData.testimonials;

      useEffect(() => {
        dispatch(clearFormData());
        if (isMobile) {
          dispatch(setHideHeader(true));
          dispatch(setHideFooter(true));
          dispatch(setHideStickyNavBar(true));
        } else {
          dispatch(setHideHeader(false));
          dispatch(setHideFooter(false));
          dispatch(setHideStickyNavBar(false));
        }
      }, [dispatch, isMobile]);

      const goToHomePage = () => {
        router.back();
      };

      const GetMobileHeader = () => {
        if (mobileStep === ListPropertyMobileStep.GET_STARTED) {
          return "Edit Property";
        } else if (mobileStep === ListPropertyMobileStep.LISTING_OPTIONS) {
          return "Edit Your Property";
        } else if (mobileStep === ListPropertyMobileStep.PROPERTY_TYPE) {
          return "Type of Listing";
        }
      };

      const handleListingTypeClick = async () => {
        if (listingType === PropertyListingType.CALL) {
          // For edit flow, we'll redirect to call flow if needed
          router.push("/");
        } else if (listingType === PropertyListingType.DIY) {
          if (isMobile) {
            setMobileStep(ListPropertyMobileStep.PROPERTY_TYPE);
          } else {
            setDesktopStep(ListPropertyDesktopStep.PROPERTY_TYPE);
          }
        }
      };

      const handleEditPropertyClick = () => {
        if (!propertyCategory) {
          console.error("Property type is not selected");
          return;
        }
        // For edit flow, we need a propertyID to edit
        // This would typically come from a property selection or direct URL
        // For now, we'll redirect to a placeholder or show an error
        console.error("Property ID is required for editing");
        // TODO: Implement property selection flow or redirect to user's properties
        router.push("/edit-property/select-property");
      };

      const handlePrefetch = () => {
        if (propertyCategory) {
          // For edit flow, we need a propertyID
          // This would be handled differently - maybe prefetch the property selection page
          router.prefetch("/edit-property/select-property");
        }
      };

      const handleGetStarted = () => {
        setMobileStep(ListPropertyMobileStep.LISTING_OPTIONS);
      };

      const handleBack = () => {
        if (isMobile) {
          setMobileStep(ListPropertyMobileStep.LISTING_OPTIONS);
        } else {
          setDesktopStep(ListPropertyDesktopStep.LISTING_OPTIONS);
        }
      };

      return (
        <>
          {/* Mobile Section */}
          <section
            className={`py-2 px-4 fixed top-0 left-0 right-0 z-50 border-b h-[55px] border-gray-200 bg-white flex flex-col justify-center items-center w-full md:hidden`}
          >
            <div className="flex justify-center items-center align-middle w-full md:hidden">
              <h1 className="text-lg my-auto text-black ml-auto">
                {GetMobileHeader()}
              </h1>

              <button className="border border-gray-200 rounded-full md:border-none ml-auto">
                <X onClick={goToHomePage} size={25} />
              </button>
            </div>
          </section>
          {/* Mobile Content */}
          <section className="w-full my-0 min-h-[calc(100svh-55px)] flex-col container pt-4 pb-2 px-6 mx-auto flex justify-between gap-16 md:hidden">
            {mobileStep === ListPropertyMobileStep.GET_STARTED && (
              <GetStarted onGetStarted={handleGetStarted} />
            )}
            {mobileStep === ListPropertyMobileStep.LISTING_OPTIONS && (
              <ListingOptions isMobile={true} onNext={handleListingTypeClick} />
            )}
            {mobileStep === ListPropertyMobileStep.PROPERTY_TYPE && (
              <PropertyTypeOptions
                onNext={handleEditPropertyClick}
                onBack={handleBack}
                handlePrefetch={handlePrefetch}
              />
            )}
          </section>

          {/* Desktop Section */}
          <section className="xl:min-h-[500px] min-h-[400px] max-md:min-h-[fit-content] w-full overflow-hidden max-md:hidden">
            <div className="container py-12 mx-auto xl:px-28 lg:px-14 md:px-8 px-8 flex justify-between gap-16">
              <div className="flex w-2/5 justify-around items-start">
                <ImageWithLoader
                  src={"/images/list-your-property.webp"}
                  alt="Edit Your Property"
                  width={550}
                  height={475}
                  className="my-0"
                />
              </div>
              <div className="flex w-3/5 justify-end items-start">
                <div className="max-w-lg xl:max-w-xl lg:w-full my-0 flex flex-col gap-8">
                  {desktopStep === ListPropertyDesktopStep.LISTING_OPTIONS && (
                    <ListingOptions
                      isMobile={false}
                      onNext={handleListingTypeClick}
                    />
                  )}

                  {desktopStep === ListPropertyDesktopStep.PROPERTY_TYPE && (
                    <PropertyTypeOptions
                      onNext={handleEditPropertyClick}
                      onBack={handleBack}
                      handlePrefetch={handlePrefetch}
                    />
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Rest of the sections */}
          <section className="w-full overflow-hidden max-md:hidden">
            <ListWithUs />
          </section>

          <section className="w-full overflow-hidden max-md:hidden">
            <CustomerSupportBanner />
          </section>

          <section className="w-full overflow-hidden max-md:hidden">
            <div className="container py-12 mx-auto xl:px-28 lg:px-14 md:px-8 px-8">
              <div className="flex justify-around items-center gap-16">
                <div className="flex flex-col w-1/2">
                  <h2 className="text-3xl font-bold text-gray-800">
                    Trusted by Landlords Across Top Cities
                  </h2>
                  <p className="mt-4 text-base text-gray-600">
                    Trusted by landlords in top cities to deliver fast,
                    reliable, and hassle-free property listing solutions!
                  </p>
                </div>

                <div className="flex w-1/2">
                  <Carousel2D
                    slideWidth={400}
                    gap={4}
                    showDots={true}
                    showArrows={true}
                  >
                    {testimonials.map((testimonial) => (
                      <TestimonialCard
                        key={testimonial.id}
                        testimonial={testimonial}
                      />
                    ))}
                  </Carousel2D>
                </div>
              </div>
            </div>
          </section>

          <section className="w-full overflow-hidden max-md:hidden">
            <ListPropertyAdvantages />
          </section>

          <Footer />
        </>
      );
    }),
  { ssr: false, loading: () => <EditPropertyLoading /> },
);

export default EditPropertyPage;
