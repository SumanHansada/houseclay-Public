"use client";

import {
  Bath,
  BedDouble,
  BedSingle,
  Binoculars,
  CalendarDays,
  CarFront,
  Gem,
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
import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button, Checkbox, RadioGroup } from "@/base-components";
import {
  apartmentImageURL,
  balconyIconURL,
  clubhouseIconURL,
  communityVillaImageURL,
  gymIconURL,
  independentHouseImageURL,
  liftIconURL,
  parkingSpaceIconURL,
  securityIconURL,
  standaloneBuildingImageURL,
  swimmingPoolIconURL,
  twentyFourSevenIconURL,
} from "@/common/constants/cdnURLs";
import {
  AMENITY_LABELS,
  AMENITY_VALUES,
  BALCONY_TYPE_OPTIONS,
  BATHROOM_TYPE_OPTIONS,
  BHK_TYPE_OPTIONS,
  FLATMATE_PRICE_OPTIONS,
  FURNISHING_OPTIONS,
  PARKING_OPTIONS,
  PROPERTY_AVAILABILITY,
  RENT_PRICE_OPTIONS,
  ROOM_TYPE_OPTIONS,
} from "@/common/constants/formOptions";
import {
  PreferredTenantValue,
  PropertyCategory,
  PropertyTypeValue,
  TenantTypeValue,
} from "@/common/enums";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/Dialog";
import { PriceOption } from "@/interfaces/Options";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import {
  resetPropertySearchFilters,
  setAmenities,
  setAvailability,
  setBalconyType,
  setBathroomType,
  setBhkType,
  setFurnishing,
  setNonVegAllowed,
  setParking,
  setPreferredTenants,
  setPriceRangeForBuy,
  setPriceRangeForFlatmate,
  setPriceRangeForRent,
  setPropertyCategory,
  setPropertyType,
  setRoomType,
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
  onReset?: () => void;
  onApply: (dialogSelectedCategory?: PropertyCategory) => void;
}

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  [AMENITY_VALUES.LIFT]: <RemoteSvg src={liftIconURL} />,
  [AMENITY_VALUES.GYM]: <RemoteSvg src={gymIconURL} />,
  [AMENITY_VALUES.SWIMMING_POOL]: <RemoteSvg src={swimmingPoolIconURL} />,
  [AMENITY_VALUES.POWER_BACKUP]: <RemoteSvg src={twentyFourSevenIconURL} />,
  [AMENITY_VALUES.CLUB_HOUSE]: <RemoteSvg src={clubhouseIconURL} />,
  [AMENITY_VALUES.SECURITY]: <RemoteSvg src={securityIconURL} />,
  [AMENITY_VALUES.VISITOR_PARKING]: <RemoteSvg src={parkingSpaceIconURL} />,
  [AMENITY_VALUES.COMMUNITY_HALL]: <Landmark size={24} strokeWidth={1.5} />,
  // [AMENITY_VALUES.GUEST_ROOM]: <BedSingle size={24} strokeWidth={1.5} />,
  // [AMENITY_VALUES.OUTDOOR_DINING]: <RemoteSvg src={outdoorDiningAreaIconURL} />,
  // [AMENITY_VALUES.FIRE_EXTINGUISHER]: (
  //   <RemoteSvg src={fireExtinguisherIconURL} />
  // ),
  // [AMENITY_VALUES.SMOKE_ALARM]: <RemoteSvg src={smokeAlarmIconURL} />,

  // [AMENITY_VALUES.DEDICATED_WORKSPACE]: (
  //   <RemoteSvg src={dedicatedWorkspaceIconURL} />
  // ),
  // [AMENITY_VALUES.WIFI]: <RemoteSvg src={wifiIconURL} />,
  // [AMENITY_VALUES.POOL_TABLE]: <RemoteSvg src={poolTableIconURL} />,
  // [AMENITY_VALUES.FIRST_AID]: <RemoteSvg src={firstAidKitIconURL} />,
  // [AMENITY_VALUES.INTERCOM]: <Headset size={24} strokeWidth={1.5} />,
  // [AMENITY_VALUES.SEWAGE_TREATMENT]: <Dam size={24} strokeWidth={1.5} />,
  // [AMENITY_VALUES.HOUSE_KEEPING]: <BrushCleaning size={24} strokeWidth={1.5} />,
  // [AMENITY_VALUES.RAIN_WATER]: <CloudHail size={24} strokeWidth={1.5} />,
  // [AMENITY_VALUES.PLAY_AREA]: <Blocks size={24} strokeWidth={1.5} />,
};

const amenitiesFilter = [
  AMENITY_VALUES.LIFT,
  AMENITY_VALUES.GYM,
  AMENITY_VALUES.SWIMMING_POOL,
  AMENITY_VALUES.POWER_BACKUP,
  AMENITY_VALUES.CLUB_HOUSE,
  AMENITY_VALUES.SECURITY,
  AMENITY_VALUES.VISITOR_PARKING,
  AMENITY_VALUES.COMMUNITY_HALL,
];

const SearchFiltersDialog: React.FC<SearchFiltersDialogProps> = ({
  id,
  onClose,
  onReset,
  onApply,
}) => {
  const { isMobile } = useDeviceContext();
  const dispatch = useDispatch();

  // Redux state selectors
  const {
    nonVegAllowed,
    propertyCategory,
    propertyType,
    tenantType,
    roomType,
    bathroomType,
    balconyType,
    furnishing,
    availability,
    preferredTenants,
    amenities: stateAmenities,
    parking,
    priceRangeForRent,
    priceRangeForFlatmate,
    bhkType,
  } = useSelector((state: RootState) => state.propertySearch);

  const [currentPropertyCategory, setCurrentPropertyCategory] = useState(
    propertyCategory ?? PropertyCategory.RENT,
  );

  const activePriceRange =
    currentPropertyCategory === PropertyCategory.FLATMATE
      ? priceRangeForFlatmate
      : priceRangeForRent;

  const activePriceOptions =
    currentPropertyCategory === PropertyCategory.FLATMATE
      ? FLATMATE_PRICE_OPTIONS
      : RENT_PRICE_OPTIONS;

  // Parse BHK selections from comma-separated Redux string
  const bhkSelectedValues = useMemo<string[]>(
    () => (bhkType ? String(bhkType).split(",") : []),
    [bhkType],
  );

  const currentPriceValue = useMemo(() => {
    if (!activePriceRange || activePriceRange.length < 2) return "";

    const [currentMin, currentMax] = activePriceRange;

    const foundOption = activePriceOptions.find(
      (opt: PriceOption) => opt.min === currentMin && opt.max === currentMax,
    );

    return foundOption ? foundOption.value : "";
  }, [activePriceRange, activePriceOptions]);

  const handleReset = () => {
    dispatch(resetPropertySearchFilters());
    onReset?.();
  };

  const handleSubmit = () => {
    dispatch(setPropertyCategory(currentPropertyCategory as PropertyCategory));
    onApply(currentPropertyCategory as PropertyCategory);
  };

  const handleTabChange = (value: string) => {
    // TODO: is it better to have category specific resets?
    handleReset();
    setCurrentPropertyCategory(value as PropertyCategory);
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
          {currentPropertyCategory !== PropertyCategory.RESALE && (
            <div>
              <div className="flex items-center gap-2 mb-2 text-lg">
                <Binoculars size={20} /> Looking For
              </div>
              <Tabs
                defaultActive={currentPropertyCategory}
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
                  {/* Price Range */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-lg">
                      <IndianRupee size={20} /> Price Range
                    </div>
                    <RadioGroup
                      name="priceRange"
                      columns={2}
                      options={activePriceOptions.map(
                        ({ value, label }: PriceOption) => ({
                          value,
                          label,
                        }),
                      )}
                      value={currentPriceValue}
                      onChange={(value) => {
                        const selectedOption = activePriceOptions.find(
                          (opt: PriceOption) => opt.value === value,
                        );

                        if (selectedOption) {
                          dispatch(
                            setPriceRangeForRent([
                              selectedOption.min,
                              selectedOption.max,
                            ]),
                          );
                        }
                      }}
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
                      columns={3}
                      options={FURNISHING_OPTIONS}
                      value={furnishing}
                      onChange={(value) =>
                        dispatch(setFurnishing(value as string))
                      }
                    />
                  </div>

                  <hr className="my-4" />

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
                          value: PropertyTypeValue.APARTMENT,
                          label: "Apartment",
                          icon: (
                            <ImageWithLoader
                              src={apartmentImageURL}
                              alt="Apartment"
                              height={75}
                              width={75}
                            />
                          ),
                        },
                        {
                          value: PropertyTypeValue.HOUSE,
                          label: "Independent House/Villa",
                          icon: (
                            <ImageWithLoader
                              src={independentHouseImageURL}
                              alt="Independent House/Villa"
                              height={75}
                              width={75}
                            />
                          ),
                        },
                        {
                          value: PropertyTypeValue.VILLA,
                          label: "Community Villa",
                          icon: (
                            <ImageWithLoader
                              src={communityVillaImageURL}
                              alt="Community Villa"
                              height={75}
                              width={75}
                            />
                          ),
                        },
                        {
                          value: PropertyTypeValue.BUILDING,
                          label: "Standalone Building",
                          icon: (
                            <ImageWithLoader
                              src={standaloneBuildingImageURL}
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
                      columns={3}
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
                          value: PreferredTenantValue.FAMILY,
                          label: "Family",
                          icon: (
                            <SvgIcon iconSize="large" name="family" size={68} />
                          ),
                        },
                        {
                          value: PreferredTenantValue.COMPANY,
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
                          value: PreferredTenantValue.BACHELOR,
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
                          value: PreferredTenantValue.COUPLE,
                          label: "Couple",
                          icon: (
                            <SvgIcon iconSize="large" name="couple" size={68} />
                          ),
                        },
                      ]}
                      withIcons={true}
                      value={preferredTenants as string}
                      onChange={(value) =>
                        dispatch(setPreferredTenants(value as string))
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
                      columns={3}
                      options={PARKING_OPTIONS}
                      value={parking}
                      onChange={(value) =>
                        dispatch(setParking(value as string))
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
                      {amenitiesFilter.map((amenityValue) => (
                        <button
                          key={amenityValue}
                          className={`flex flex-col items-start justify-center border rounded-xl p-3 gap-2 ${stateAmenities.includes(amenityValue) ? "border-red-500" : "border-gray-200 text-gray-700"}`}
                          onClick={() =>
                            dispatch(
                              setAmenities(
                                stateAmenities.includes(amenityValue)
                                  ? stateAmenities.filter(
                                      (a) => a !== amenityValue,
                                    )
                                  : [...stateAmenities, amenityValue],
                              ),
                            )
                          }
                        >
                          {AMENITY_ICONS[amenityValue] ?? amenityValue}
                          <span className="text-sm text-left">
                            {AMENITY_LABELS[amenityValue] ?? amenityValue}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </TabContent>
                <TabContent value={PropertyCategory.FLATMATE}>
                  {/* Price Range */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-lg">
                      <IndianRupee size={20} /> Price Range
                    </div>
                    <RadioGroup
                      name="priceRange"
                      columns={2}
                      options={activePriceOptions.map(({ value, label }) => ({
                        value,
                        label,
                      }))}
                      value={currentPriceValue}
                      onChange={(value) => {
                        const selectedOption = activePriceOptions.find(
                          (opt: PriceOption) => opt.value === value,
                        );

                        if (selectedOption) {
                          dispatch(
                            setPriceRangeForFlatmate([
                              selectedOption.min,
                              selectedOption.max,
                            ]),
                          );
                        }
                      }}
                    />
                  </div>

                  <hr className="my-4" />

                  {/* Room Type */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-lg">
                      <BedDouble size={20} /> Room Type
                    </div>
                    <RadioGroup
                      name="roomType"
                      columns={2}
                      options={ROOM_TYPE_OPTIONS}
                      value={roomType}
                      onChange={(value) =>
                        dispatch(setRoomType(value as string))
                      }
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
                      columns={3}
                      options={FURNISHING_OPTIONS}
                      value={furnishing}
                      onChange={(value) =>
                        dispatch(setFurnishing(value as string))
                      }
                    />
                  </div>

                  <hr className="my-4" />

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
                          value: PropertyTypeValue.APARTMENT,
                          label: "Apartment",
                          icon: (
                            <ImageWithLoader
                              src={apartmentImageURL}
                              alt="Apartment"
                              height={75}
                              width={75}
                            />
                          ),
                        },
                        {
                          value: PropertyTypeValue.HOUSE,
                          label: "Independent House/Villa",
                          icon: (
                            <ImageWithLoader
                              src={independentHouseImageURL}
                              alt="Independent House/Villa"
                              height={75}
                              width={75}
                            />
                          ),
                        },
                        {
                          value: PropertyTypeValue.VILLA,
                          label: "Community Villa",
                          icon: (
                            <ImageWithLoader
                              src={communityVillaImageURL}
                              alt="Community Villa"
                              height={75}
                              width={75}
                            />
                          ),
                        },
                        {
                          value: PropertyTypeValue.BUILDING,
                          label: "Standalone Building",
                          icon: (
                            <ImageWithLoader
                              src={standaloneBuildingImageURL}
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

                  {/* Tenant type & Food Preference */}
                  <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2 text-lg">
                        <span className="flex">
                          <Mars size={20} />
                          <Venus size={20} />
                        </span>{" "}
                        Tenant Type
                      </div>

                      <RadioGroup
                        name="tenantType"
                        columns={2}
                        options={[
                          {
                            value: TenantTypeValue.FEMALE,
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
                            value: TenantTypeValue.MALE,
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
                        name="nonVegAllowed"
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
                        value={nonVegAllowed === null ? "" : nonVegAllowed}
                        onChange={(value) =>
                          dispatch(setNonVegAllowed(value as boolean))
                        }
                      />
                    </div>
                  </div>

                  <hr className="my-4" />

                  {/* Bathroom Type */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-lg">
                      <Bath size={20} /> Bathroom Type
                    </div>
                    <RadioGroup
                      name="bathroomType"
                      columns={3}
                      options={BATHROOM_TYPE_OPTIONS}
                      value={bathroomType}
                      onChange={(value) =>
                        dispatch(setBathroomType(value as string))
                      }
                    />
                  </div>

                  <hr className="my-4" />

                  {/* Balcony Type */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-lg">
                      <RemoteSvg src={balconyIconURL} className="" />
                      Balcony Type
                    </div>
                    <RadioGroup
                      name="balconyType"
                      columns={2}
                      options={BALCONY_TYPE_OPTIONS.filter(
                        (option) => option.value !== "no-balcony",
                      )}
                      value={balconyType}
                      onChange={(value) =>
                        dispatch(setBalconyType(value as string))
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

                  <hr className="my-4" />

                  {/* Amenities */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-lg">
                      <Gem size={20} /> Amenities
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {amenitiesFilter.map((amenityValue) => (
                        <button
                          key={amenityValue}
                          className={`flex flex-col items-start justify-center border rounded-xl p-3 gap-2 ${stateAmenities.includes(amenityValue) ? "border-red-500" : "border-gray-200 text-gray-700"}`}
                          onClick={() =>
                            dispatch(
                              setAmenities(
                                stateAmenities.includes(amenityValue)
                                  ? stateAmenities.filter(
                                      (a) => a !== amenityValue,
                                    )
                                  : [...stateAmenities, amenityValue],
                              ),
                            )
                          }
                        >
                          {AMENITY_ICONS[amenityValue] ?? amenityValue}
                          <span className="text-sm text-left">
                            {AMENITY_LABELS[amenityValue] ?? amenityValue}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </TabContent>
              </Tabs>
            </div>
          )}

          {currentPropertyCategory === PropertyCategory.RESALE && (
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
                      value: PropertyTypeValue.APARTMENT,
                      label: "Apartment",
                      icon: (
                        <ImageWithLoader
                          src={apartmentImageURL}
                          alt="Apartment"
                          height={75}
                          width={75}
                        />
                      ),
                    },
                    {
                      value: PropertyTypeValue.HOUSE,
                      label: "Independent House/Villa",
                      icon: (
                        <ImageWithLoader
                          src={independentHouseImageURL}
                          alt="Independent House/Villa"
                          height={75}
                          width={75}
                        />
                      ),
                    },
                    {
                      value: PropertyTypeValue.VILLA,
                      label: "Community Villa",
                      icon: (
                        <ImageWithLoader
                          src={communityVillaImageURL}
                          alt="Community Villa"
                          height={75}
                          width={75}
                        />
                      ),
                    },
                    {
                      value: PropertyTypeValue.BUILDING,
                      label: "Standalone Building",
                      icon: (
                        <ImageWithLoader
                          src={standaloneBuildingImageURL}
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
                      value: PreferredTenantValue.FAMILY,
                      label: "Family",
                      icon: (
                        <SvgIcon iconSize="large" name="family" size={68} />
                      ),
                    },
                    {
                      value: PreferredTenantValue.COMPANY,
                      label: "Company",
                      icon: (
                        <SvgIcon iconSize="large" name="company" size={68} />
                      ),
                    },
                    {
                      value: PreferredTenantValue.BACHELOR,
                      label: "Bachelor",
                      icon: (
                        <SvgIcon iconSize="large" name="bachelor" size={68} />
                      ),
                    },
                    {
                      value: PreferredTenantValue.COUPLE,
                      label: "Couple",
                      icon: (
                        <SvgIcon iconSize="large" name="couple" size={68} />
                      ),
                    },
                  ]}
                  withIcons={true}
                  value={preferredTenants as string}
                  onChange={(value) =>
                    dispatch(setPreferredTenants(value as string))
                  }
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
                  columns={3}
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
                <RadioGroup
                  name="priceRange"
                  columns={2}
                  options={activePriceOptions.map(
                    ({ value, label }: PriceOption) => ({ value, label }),
                  )}
                  value={currentPriceValue}
                  onChange={(value) => {
                    const selectedOption = activePriceOptions.find(
                      (opt: PriceOption) => opt.value === value,
                    );

                    if (selectedOption) {
                      dispatch(
                        setPriceRangeForBuy([
                          selectedOption.min,
                          selectedOption.max,
                        ]),
                      );
                    }
                  }}
                />
              </div>
              <hr className="my-4" />
              {/* Amenities */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-lg">
                  <Gem size={20} /> Amenities
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {amenitiesFilter.map((amenityValue) => (
                    <button
                      key={amenityValue}
                      className={`flex flex-col items-start justify-center border rounded-xl p-3 gap-2 ${stateAmenities.includes(amenityValue) ? "border-red-500" : "border-gray-200 text-gray-700"}`}
                      onClick={() =>
                        dispatch(
                          setAmenities(
                            stateAmenities.includes(amenityValue)
                              ? stateAmenities.filter((a) => a !== amenityValue)
                              : [...stateAmenities, amenityValue],
                          ),
                        )
                      }
                    >
                      {AMENITY_ICONS[amenityValue] ?? amenityValue}
                      <span className="text-sm text-left">
                        {AMENITY_LABELS[amenityValue] ?? amenityValue}
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
            onClick={handleSubmit}
          >
            Show Results
          </Button>
        </div>
      </DialogFooter>
    </Dialog>
  );
};

export default SearchFiltersDialog;
