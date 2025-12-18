"use client";

import {
  Bath,
  BedSingle,
  Binoculars,
  Blocks,
  BrushCleaning,
  CalendarDays,
  CarFront,
  CloudHail,
  Dam,
  Gem,
  Headset,
  Home,
  IndianRupee,
  Landmark,
  Mars,
  RefreshCcw,
  Salad,
  Sofa,
  Venus,
  X,
} from "lucide-react";
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button, Checkbox, RadioGroup, RangeSlider } from "@/base-components";
import {
  clubhouseIconURL,
  dedicatedWorkspaceIconURL,
  fireExtinguisherIconURL,
  firstAidKitIconURL,
  gymIconURL,
  liftIconURL,
  outdoorDiningAreaIconURL,
  parkingSpaceIconURL,
  poolTableIconURL,
  securityIconURL,
  smokeAlarmIconURL,
  swimmingPoolIconURL,
  twentyFourXSevenIconURL,
  wifiIconURL,
} from "@/common/cdnURLs";
import {
  BHK_TYPE_OPTIONS,
  FURNISHING_OPTIONS,
  PARKING_OPTIONS,
  PROPERTY_AVAILABILITY,
  YES_NO_OPTIONS,
} from "@/common/dataConstants/options";
import {
  FLATMATE_PREFERRED_TENANTS,
  PROPERTY_TYPES,
  PropertyCategory,
  RENT_PREFERRED_TENANTS,
} from "@/common/enums";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/Dialog";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import {
  resetPropertySearch,
  setAmenities,
  setAvailability,
  setBathroomType,
  setBhkType,
  setFoodPref,
  setFurnishing,
  setLookingFor,
  setParking,
  setPriceRangeForBuy,
  setPriceRangeForRent,
  setPropertyCategory,
  setPropertyType,
  setTenantType,
} from "@/store/propertySearchSlice";
import { RootState } from "@/store/store";
import {
  ImageWithLoader,
  RemoteSvg,
  SvgIcon,
  Tab,
  TabContent,
  TabHeader,
  Tabs,
} from "@/utility-components";

interface SearchFiltersDialogProps {
  id: string;
  onClose: () => void;
  onReset: () => void;
  onApply: () => void;
}

const amenities = [
  { label: "Lift", icon: <RemoteSvg src={liftIconURL} /> },
  {
    label: "Club house",
    icon: <RemoteSvg src={clubhouseIconURL} />,
  },
  { label: "Gym", icon: <RemoteSvg src={gymIconURL} /> },
  {
    label: "Outdoor Dining Area",
    icon: <RemoteSvg src={outdoorDiningAreaIconURL} />,
  },
  {
    label: "Fire Extinguisher",
    icon: <RemoteSvg src={fireExtinguisherIconURL} />,
  },
  {
    label: "Smoke Alarm",
    icon: <RemoteSvg src={smokeAlarmIconURL} />,
  },
  {
    label: "Swimming Pool",
    icon: <RemoteSvg src={swimmingPoolIconURL} />,
  },
  {
    label: "24/7 Power",
    icon: <RemoteSvg src={twentyFourXSevenIconURL} />,
  },
  { label: "Security", icon: <RemoteSvg src={securityIconURL} /> },
  {
    label: "Visitor Parking",
    icon: <RemoteSvg src={parkingSpaceIconURL} />,
  },
  {
    label: "Dedicated Workspace",
    icon: <RemoteSvg src={dedicatedWorkspaceIconURL} />,
  },
  { label: "Wifi", icon: <RemoteSvg src={wifiIconURL} /> },
  {
    label: "Pool Table",
    icon: <RemoteSvg src={poolTableIconURL} />,
  },
  {
    label: "First Aid Kit",
    icon: <RemoteSvg src={firstAidKitIconURL} />,
  },
  {
    label: "Intercom",
    icon: <Headset size={24} strokeWidth={1.5} />,
  },
  {
    label: "Sewage Treatment",
    icon: <Dam size={24} strokeWidth={1.5} />,
  },
  {
    label: "House Keeping",
    icon: <BrushCleaning size={24} strokeWidth={1.5} />,
  },
  {
    label: "Rain Water Harvesting",
    icon: <CloudHail size={24} strokeWidth={1.5} />,
  },
  {
    label: "Children Play Area",
    icon: <Blocks size={24} strokeWidth={1.5} />,
  },
  {
    label: "Guest Room",
    icon: <BedSingle size={24} strokeWidth={1.5} />,
  },
  {
    label: "Community Hall",
    icon: <Landmark size={24} strokeWidth={1.5} />,
  },
];

const SearchFiltersDialog: React.FC<SearchFiltersDialogProps> = ({
  id,
  onClose,
  onReset,
  onApply,
}) => {
  // Redux state selectors
  const {
    propertyCategory,
    propertyType,
    tenantType,
    foodPref,
    bathroomType,
    furnishing,
    availability,
    amenities: stateAmenities,
    parking,
    priceRangeForRent,
    priceRangeForBuy,
    bhkType,
  } = useSelector((state: RootState) => state.propertySearch);

  // Parse BHK selections from comma-separated Redux string
  const bhkSelectedValues = useMemo<string[]>(
    () => (bhkType ? String(bhkType).split(",") : []),
    [bhkType],
  );

  const marksForRent = [
    { value: 0, label: "0" },
    { value: 200000, label: "200K" },
    { value: 400000, label: "400K" },
    { value: 800000, label: "800K" },
    { value: 1000000, label: "1M" },
  ];

  const marksForBuy = [
    { value: 0, label: "0" },
    { value: 10000000, label: "10M" },
    { value: 20000000, label: "20M" },
    { value: 40000000, label: "40M" },
    { value: 80000000, label: "80M" },
    { value: 100000000, label: "100M" },
  ];

  const { isMobile } = useDeviceContext();
  const dispatch = useDispatch();

  const handleReset = () => {
    dispatch(resetPropertySearch());
    onReset();
  };

  const handleTabChange = (value: string) => {
    dispatch(setLookingFor(value as string));
    dispatch(setPropertyCategory(value as PropertyCategory));
  };

  return (
    <Dialog
      id={id}
      type={isMobile ? "fullscreen" : "card"}
      onClose={onClose}
      entryAnimation={isMobile ? "animate-slide-in-bottom" : "animate-fade-in"}
      exitAnimation={isMobile ? "animate-slide-out-bottom" : "animate-fade-out"}
    >
      <DialogHeader>
        <div className="flex border-gray-200 items-center w-full justify-between">
          <span className="text-xl max-md:hidden">More Filters</span>
          {/* Commented Resale Logic */}
          {/* <div className="flex justify-center text-xl ml-auto md:hidden">
            <button
              onClick={() =>
                dispatch(setPropertyCategory(PropertyCategory.RENT))
              }
              className={`px-8 py-1 border-b-2 text-base border-gray-300 ${propertyCategory === PropertyCategory.RENT || propertyCategory === PropertyCategory.FLATMATE ? "text-red-500 border-red-500" : "text-gray-700 "}`}
            >
              Rent
            </button>
            <button
              onClick={() =>
                dispatch(setPropertyCategory(PropertyCategory.RESALE))
              }
              className={`px-8 py-1 border-b-2 text-base border-gray-300 ${propertyCategory === PropertyCategory.RESALE ? "text-red-500 border-red-500" : "text-gray-700 "}`}
            >
              Buy
            </button>
          </div> */}

          <Button
            variant="secondary"
            size="custom"
            className="rounded-full p-1 ml-auto"
            onClick={onClose}
          >
            <X size={24} />
          </Button>
        </div>
      </DialogHeader>
      <DialogContent>
        <div className="flex flex-col gap-6 px-6 py-2">
          {/* Looking For */}
          {propertyCategory !== PropertyCategory.RESALE && (
            <div>
              <div className="flex items-center gap-2 mb-2 text-lg">
                <Binoculars size={20} /> Looking For
              </div>
              <Tabs
                defaultActive={propertyCategory}
                onTabChange={handleTabChange}
              >
                <TabHeader tabsClassName="justify-between border rounded-xl p-2 w-full flex gap-2">
                  <Tab
                    label="Full house"
                    value={PropertyCategory.RENT}
                    containerClassName="w-1/2 p-2 md:p-3 text-base font-medium max-md:font-normal rounded-xl border transition-colors duration-300"
                    activeClassName="text-red-600 border-red-500"
                    inactiveClassName="text-gray-700 border-transparent"
                  />
                  <Tab
                    label="Rooms"
                    value={PropertyCategory.FLATMATE}
                    containerClassName="w-1/2 p-2 md:p-3 text-base font-medium max-md:font-normal rounded-xl border transition-colors duration-300"
                    activeClassName="text-red-600 border-red-500"
                    inactiveClassName="text-gray-700 border-transparent"
                  />
                </TabHeader>
                <TabContent value={PropertyCategory.RENT} className="gap-4">
                  {/* Property Type */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-lg">
                      <Home size={20} /> Property Type
                    </div>
                    <RadioGroup
                      name="propertyType"
                      columns={4}
                      options={[
                        {
                          value: PROPERTY_TYPES.APARTMENT,
                          label: "Apartment",
                          icon: (
                            <ImageWithLoader
                              src="images/apartment.webp"
                              alt="Apartment"
                              height={75}
                              width={75}
                            />
                          ),
                        },
                        {
                          value: PROPERTY_TYPES.HOUSE,
                          label: "Independent House/Villa",
                          icon: (
                            <ImageWithLoader
                              src="images/independent-house.webp"
                              alt="Independent House/Villa"
                              height={75}
                              width={75}
                            />
                          ),
                        },
                        {
                          value: PROPERTY_TYPES.VILLA,
                          label: "Community Villa",
                          icon: (
                            <ImageWithLoader
                              src="images/community-villa.webp"
                              alt="Community Villa"
                              height={75}
                              width={75}
                            />
                          ),
                        },
                        {
                          value: PROPERTY_TYPES.BUILDING,
                          label: "Standalone Building",
                          icon: (
                            <ImageWithLoader
                              src="images/standalone-building.webp"
                              alt="Standalone Building"
                              height={75}
                              width={75}
                            />
                          ),
                        },
                      ]}
                      withIcons={true}
                      value={propertyType as string}
                      onChange={(value) =>
                        dispatch(setPropertyType(value as string))
                      }
                    />
                  </div>
                  <hr className="my-4" />
                  {/* BHK Type */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-lg">
                      <BedSingle size={20} /> BHK Type
                    </div>
                    <div>
                      <Checkbox
                        name="bhkType"
                        columns={4}
                        options={BHK_TYPE_OPTIONS}
                        value={bhkSelectedValues}
                        onChange={(value) => {
                          dispatch(setBhkType(value.join(",")));
                        }}
                      />
                    </div>
                  </div>
                  <hr className="my-4" />
                  {/* Availability */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-lg">
                      <CalendarDays size={20} /> Availability
                    </div>
                    <RadioGroup
                      name="availability"
                      columns={4}
                      options={PROPERTY_AVAILABILITY}
                      value={availability}
                      onChange={(value) =>
                        dispatch(setAvailability(value as string))
                      }
                    />
                  </div>
                  <hr className="my-4" />
                  {/* Preferred Tenants */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-lg">
                      <span className="flex">
                        <Mars size={20} />
                        <Venus size={20} />
                      </span>{" "}
                      Preferred Tenants
                    </div>

                    <RadioGroup
                      name="preferredTenants"
                      columns={4}
                      options={[
                        {
                          value: RENT_PREFERRED_TENANTS.FAMILY,
                          label: "Family",
                          icon: (
                            <SvgIcon iconSize="large" name="family" size={68} />
                          ),
                        },
                        {
                          value: RENT_PREFERRED_TENANTS.COMPANY,
                          label: "Company",
                          icon: (
                            <SvgIcon
                              iconSize="large"
                              name="company"
                              size={68}
                            />
                          ),
                        },
                        {
                          value: RENT_PREFERRED_TENANTS.BACHELOR,
                          label: "Bachelor",
                          icon: (
                            <SvgIcon
                              iconSize="large"
                              name="bachelor"
                              size={68}
                            />
                          ),
                        },
                        {
                          value: RENT_PREFERRED_TENANTS.COUPLE,
                          label: "Couple",
                          icon: (
                            <SvgIcon iconSize="large" name="couple" size={68} />
                          ),
                        },
                      ]}
                      withIcons={true}
                      value={tenantType as string}
                      onChange={(value) =>
                        dispatch(setTenantType(value as string))
                      }
                    />
                  </div>
                  <hr className="my-4" />
                  {/* Price Range */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-lg">
                      <IndianRupee size={20} /> Price Range
                    </div>
                    <RangeSlider
                      name="priceRangeForRent"
                      label=""
                      min={0}
                      max={1000000}
                      step={50000}
                      value={priceRangeForRent}
                      onChange={(value) =>
                        dispatch(
                          setPriceRangeForRent(value as [number, number]),
                        )
                      }
                      marks={marksForRent}
                      rangeClassName="absolute h-2 bg-red-500 rounded-full top-1/2 transform -translate-y-1/2"
                      thumbClassName="absolute w-6 h-6 flex justify-center items-center bg-white border-2 border-white-500 rounded-full shadow-md cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                      containerClassName="mb-8"
                      showInputs={isMobile ? false : true}
                    />
                  </div>
                  <hr className="my-4" />
                  {/* Furnishing */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-lg">
                      <Sofa size={20} /> Furnishing
                    </div>
                    <RadioGroup
                      name="furnishing"
                      columns={4}
                      options={FURNISHING_OPTIONS}
                      value={furnishing}
                      onChange={(value) =>
                        dispatch(setFurnishing(value as string))
                      }
                    />
                  </div>
                  <hr className="my-4" />
                  {/* Amenities */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-lg">
                      <Gem size={20} /> Amenities
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {amenities.map((amenity) => (
                        <button
                          key={amenity.label}
                          className={`flex flex-col items-start justify-center border rounded-xl p-3 gap-2 ${stateAmenities.includes(amenity.label) ? "border-red-500" : "border-gray-200 text-gray-700"}`}
                          onClick={() =>
                            dispatch(
                              setAmenities(
                                stateAmenities.includes(amenity.label)
                                  ? stateAmenities.filter(
                                      (a) => a !== amenity.label,
                                    )
                                  : [...stateAmenities, amenity.label],
                              ),
                            )
                          }
                        >
                          {amenity.icon}
                          <span className="text-sm text-left">
                            {amenity.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <hr className="my-4" />
                  {/* Parking */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-lg">
                      <CarFront size={20} /> Parking
                    </div>
                    <RadioGroup
                      name="parking"
                      columns={2}
                      options={PARKING_OPTIONS}
                      value={parking}
                      onChange={(value) =>
                        dispatch(setParking(value as string))
                      }
                    />
                  </div>
                </TabContent>
                <TabContent value={PropertyCategory.FLATMATE}>
                  {/* Property Type */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-lg">
                      <Home size={20} /> Property Type
                    </div>
                    <RadioGroup
                      name="propertyType"
                      columns={4}
                      options={[
                        {
                          value: PROPERTY_TYPES.APARTMENT,
                          label: "Apartment",
                          icon: (
                            <ImageWithLoader
                              src="images/apartment.webp"
                              alt="Apartment"
                              height={75}
                              width={75}
                            />
                          ),
                        },
                        {
                          value: PROPERTY_TYPES.HOUSE,
                          label: "Independent House/Villa",
                          icon: (
                            <ImageWithLoader
                              src="images/independent-house.webp"
                              alt="Independent House/Villa"
                              height={75}
                              width={75}
                            />
                          ),
                        },
                        {
                          value: PROPERTY_TYPES.VILLA,
                          label: "Community Villa",
                          icon: (
                            <ImageWithLoader
                              src="images/community-villa.webp"
                              alt="Community Villa"
                              height={75}
                              width={75}
                            />
                          ),
                        },
                        {
                          value: PROPERTY_TYPES.BUILDING,
                          label: "Standalone Building",
                          icon: (
                            <ImageWithLoader
                              src="images/standalone-building.webp"
                              alt="Standalone Building"
                              height={75}
                              width={75}
                            />
                          ),
                        },
                      ]}
                      withIcons={true}
                      value={propertyType as string}
                      onChange={(value) =>
                        dispatch(setPropertyType(value as string))
                      }
                    />
                  </div>
                  <hr className="my-4" />
                  {/* Availability */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-lg">
                      <CalendarDays size={20} /> Availability
                    </div>
                    <RadioGroup
                      name="availability"
                      columns={4}
                      options={PROPERTY_AVAILABILITY}
                      value={availability}
                      onChange={(value) =>
                        dispatch(setAvailability(value as string))
                      }
                    />
                  </div>
                  <hr className="my-4" />
                  {/* Preferred Tenants & Preferences */}
                  <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2 text-lg">
                        <span className="flex">
                          <Mars size={20} />
                          <Venus size={20} />
                        </span>{" "}
                        Preferred Tenants
                      </div>

                      <RadioGroup
                        name="preferredTenants"
                        columns={2}
                        options={[
                          {
                            value: FLATMATE_PREFERRED_TENANTS.FEMALE,
                            label: "Female",
                            icon: (
                              <SvgIcon
                                name="female"
                                iconSize="medium"
                                size={75}
                              />
                            ),
                          },
                          {
                            value: FLATMATE_PREFERRED_TENANTS.MALE,
                            label: "Male",
                            icon: (
                              <SvgIcon
                                name="male"
                                iconSize="medium"
                                size={75}
                              />
                            ),
                          },
                        ]}
                        withIcons={true}
                        value={tenantType as string}
                        onChange={(value) =>
                          dispatch(setTenantType(value as string))
                        }
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2 text-lg">
                        <Salad size={20} /> Food Preferences
                      </div>
                      <RadioGroup
                        name="foodPreferences"
                        columns={2}
                        options={[
                          {
                            value: false,
                            label: "Veg",
                            icon: (
                              <SvgIcon name="veg" iconSize="large" size={68} />
                            ),
                          },
                          {
                            value: true,
                            label: "Non-Veg",
                            icon: (
                              <SvgIcon
                                name="non-veg"
                                iconSize="large"
                                size={68}
                              />
                            ),
                          },
                        ]}
                        withIcons={true}
                        horizontal
                        value={foodPref}
                        onChange={(value) =>
                          dispatch(setFoodPref(value as string))
                        }
                      />
                    </div>
                  </div>
                  <hr className="my-4" />
                  {/* Price Range */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-lg">
                      <IndianRupee size={20} /> Price Range
                    </div>
                    <RangeSlider
                      name="priceRangeForRent"
                      label=""
                      min={0}
                      max={1000000}
                      step={50000}
                      value={priceRangeForRent}
                      onChange={(value) =>
                        dispatch(
                          setPriceRangeForRent(value as [number, number]),
                        )
                      }
                      marks={marksForRent}
                      rangeClassName="absolute h-2 bg-red-500 rounded-full top-1/2 transform -translate-y-1/2"
                      thumbClassName="absolute w-6 h-6 flex justify-center items-center bg-white border-2 border-white-500 rounded-full shadow-md cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                      containerClassName="mb-8"
                      showInputs={isMobile ? false : true}
                    />
                  </div>
                  <hr className="my-4" />
                  {/* Furnishing */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-lg">
                      <Sofa size={20} /> Furnishing
                    </div>
                    <RadioGroup
                      name="furnishing"
                      columns={4}
                      options={FURNISHING_OPTIONS}
                      value={furnishing}
                      onChange={(value) =>
                        dispatch(setFurnishing(value as string))
                      }
                    />
                  </div>
                  {/* Amenities */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-lg">
                      <Gem size={20} /> Amenities
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {amenities.map((amenity) => (
                        <button
                          key={amenity.label}
                          className={`flex flex-col items-start justify-center border rounded-xl p-3 gap-2 ${stateAmenities.includes(amenity.label) ? "border-red-500" : "border-gray-200 text-gray-700"}`}
                          onClick={() =>
                            dispatch(
                              setAmenities(
                                stateAmenities.includes(amenity.label)
                                  ? stateAmenities.filter(
                                      (a) => a !== amenity.label,
                                    )
                                  : [...stateAmenities, amenity.label],
                              ),
                            )
                          }
                        >
                          {amenity.icon}
                          <span className="text-sm text-left">
                            {amenity.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <hr className="my-4" />
                  {/* Bathroom Type */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-lg">
                      <Bath size={20} /> Attached Bathroom
                    </div>
                    <RadioGroup
                      name="bathroomType"
                      columns={2}
                      options={YES_NO_OPTIONS}
                      containerClassName="w-1/2 max-md:w-full"
                      value={bathroomType}
                      onChange={(value) =>
                        dispatch(setBathroomType(value as string))
                      }
                    />
                  </div>
                  <hr className="my-4" />
                  {/* Parking */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-lg">
                      <CarFront size={20} /> Parking
                    </div>
                    <RadioGroup
                      name="parking"
                      columns={2}
                      options={PARKING_OPTIONS}
                      value={parking}
                      onChange={(value) =>
                        dispatch(setParking(value as string))
                      }
                    />
                  </div>
                </TabContent>
              </Tabs>
            </div>
          )}

          {propertyCategory === PropertyCategory.RESALE && (
            <div>
              {/* Property Type */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-lg">
                  <Home size={20} /> Property Type
                </div>
                <RadioGroup
                  name="propertyType"
                  columns={4}
                  options={[
                    {
                      value: PROPERTY_TYPES.APARTMENT,
                      label: "Apartment",
                      icon: (
                        <ImageWithLoader
                          src="images/apartment.webp"
                          alt="Apartment"
                          height={75}
                          width={75}
                        />
                      ),
                    },
                    {
                      value: PROPERTY_TYPES.HOUSE,
                      label: "Independent House/Villa",
                      icon: (
                        <ImageWithLoader
                          src="images/independent-house.webp"
                          alt="Independent House/Villa"
                          height={75}
                          width={75}
                        />
                      ),
                    },
                    {
                      value: PROPERTY_TYPES.VILLA,
                      label: "Community Villa",
                      icon: (
                        <ImageWithLoader
                          src="images/community-villa.webp"
                          alt="Community Villa"
                          height={75}
                          width={75}
                        />
                      ),
                    },
                    {
                      value: PROPERTY_TYPES.BUILDING,
                      label: "Standalone Building",
                      icon: (
                        <ImageWithLoader
                          src="images/standalone-building.webp"
                          alt="Standalone Building"
                          height={75}
                          width={75}
                        />
                      ),
                    },
                  ]}
                  withIcons={true}
                  value={propertyType as string}
                  onChange={(value) =>
                    dispatch(setPropertyType(value as string))
                  }
                />
              </div>
              <hr className="my-4" />
              {/* BHK Type */}

              <div>
                <div className="flex items-center gap-2 mb-2 text-lg">
                  <BedSingle size={20} /> BHK Type
                </div>
                <div>
                  <RadioGroup
                    name="bhkType"
                    columns={4}
                    options={BHK_TYPE_OPTIONS}
                    value={bhkType}
                    onChange={(value) => {
                      dispatch(setBhkType(value as string));
                    }}
                  />
                </div>
              </div>
              <hr className="my-4" />
              {/* Availability */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-lg">
                  <CalendarDays size={20} /> Availability
                </div>
                <RadioGroup
                  name="availability"
                  columns={4}
                  options={PROPERTY_AVAILABILITY}
                  value={availability}
                  onChange={(value) =>
                    dispatch(setAvailability(value as string))
                  }
                />
              </div>
              <hr className="my-4" />
              {/* Preferred Tenants */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-lg">
                  <span className="flex">
                    <Mars size={20} />
                    <Venus size={20} />
                  </span>{" "}
                  Preferred Tenants
                </div>

                <RadioGroup
                  name="preferredTenants"
                  columns={4}
                  options={[
                    {
                      value: RENT_PREFERRED_TENANTS.FAMILY,
                      label: "Family",
                      icon: (
                        <SvgIcon iconSize="large" name="family" size={68} />
                      ),
                    },
                    {
                      value: RENT_PREFERRED_TENANTS.COMPANY,
                      label: "Company",
                      icon: (
                        <SvgIcon iconSize="large" name="company" size={68} />
                      ),
                    },
                    {
                      value: RENT_PREFERRED_TENANTS.BACHELOR,
                      label: "Bachelor",
                      icon: (
                        <SvgIcon iconSize="large" name="bachelor" size={68} />
                      ),
                    },
                    {
                      value: RENT_PREFERRED_TENANTS.COUPLE,
                      label: "Couple",
                      icon: (
                        <SvgIcon iconSize="large" name="couple" size={68} />
                      ),
                    },
                  ]}
                  withIcons={true}
                  value={tenantType as string}
                  onChange={(value) => dispatch(setTenantType(value as string))}
                />
              </div>
              <hr className="my-4" />
              {/* Furnishing */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-lg">
                  <Sofa size={20} /> Furnishing
                </div>
                <RadioGroup
                  name="furnishing"
                  columns={4}
                  options={FURNISHING_OPTIONS}
                  value={furnishing}
                  onChange={(value) => dispatch(setFurnishing(value as string))}
                />
              </div>
              <hr className="my-4" />
              {/* Price Range */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-lg">
                  <IndianRupee size={20} /> Price Range
                </div>
                <RangeSlider
                  name="priceRangeForBuy"
                  label=""
                  min={0}
                  max={100000000}
                  step={5000000}
                  value={priceRangeForBuy}
                  onChange={(value) =>
                    dispatch(setPriceRangeForBuy(value as [number, number]))
                  }
                  marks={marksForBuy}
                  rangeClassName="absolute h-2 bg-red-500 rounded-full top-1/2 transform -translate-y-1/2"
                  thumbClassName="absolute w-6 h-6 flex justify-center items-center bg-white border-2 border-white-500 rounded-full shadow-md cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  containerClassName="mb-8"
                  showInputs={isMobile ? false : true}
                />
              </div>
              <hr className="my-4" />
              {/* Amenities */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-lg">
                  <Gem size={20} /> Amenities
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {amenities.map((amenity) => (
                    <button
                      key={amenity.label}
                      className={`flex flex-col items-start justify-center border rounded-xl p-3 gap-2 ${stateAmenities.includes(amenity.label) ? "border-red-500" : "border-gray-200 text-gray-700"}`}
                      onClick={() =>
                        dispatch(
                          setAmenities(
                            stateAmenities.includes(amenity.label)
                              ? stateAmenities.filter(
                                  (a) => a !== amenity.label,
                                )
                              : [...stateAmenities, amenity.label],
                          ),
                        )
                      }
                    >
                      {amenity.icon}
                      <span className="text-sm text-left">{amenity.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <hr className="my-4" />
              {/* Parking */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-lg">
                  <CarFront size={20} /> Parking
                </div>
                <RadioGroup
                  name="parking"
                  columns={2}
                  options={PARKING_OPTIONS}
                  value={parking}
                  onChange={(value) => dispatch(setParking(value as string))}
                />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
      <DialogFooter className="border-t">
        <div className="flex border-gray-200 w-full justify-between max-md:gap-4">
          <Button
            variant="outline"
            leftIcon={<RefreshCcw size={20} />}
            size="md"
            className="flex items-center gap-2 max-md:w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-500 bg-white hover:bg-gray-100"
            onClick={handleReset}
          >
            Reset All
          </Button>
          <Button
            variant="primary"
            size="md"
            className="max-md:w-full px-4 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
            onClick={onApply}
          >
            Show Results
          </Button>
        </div>
      </DialogFooter>
    </Dialog>
  );
};

export default SearchFiltersDialog;
