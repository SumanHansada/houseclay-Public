"use client";

import { Check, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/base-components";
import { PropertyCategory, PropertyStatus } from "@/common/enums";
import MyPropertyActionsDialog from "@/dialogs/my-property-actions";
import { MobileHeader } from "@/layout-components";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";
import { setHideStickyNavBar } from "@/store/appSlice";
import { RootState } from "@/store/store";

import { PropertyTable } from "../components/PropertiesTable";
import { PropertyCardList } from "../components/PropertyCardList";
import Loading from "./loading";

const filterOptions = [
  { label: "All", value: PropertyCategory.NONE },
  { label: "Resale", value: PropertyCategory.RESALE },
  { label: "Rent", value: PropertyCategory.RENT },
  { label: "Flatmate", value: PropertyCategory.FLATMATE },
];

const PROPERTY_ACTIONS_DIALOG_ID = "property-actions-dialog";

export default function MyPropertiesPage() {
  const router = useRouter();
  const { isMobile } = useDeviceContext();
  const [selectedCategory, setSelectedCategory] = useState<PropertyCategory>(
    PropertyCategory.NONE,
  );
  const [onlyActive, setOnlyActive] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
  const { isDialogOpen, openDialog, closeDialog } = useDialog();
  const dispatch = useDispatch();

  const { userDetail, userDetailLoading, userDetailError } = useSelector(
    (state: RootState) => state.user,
  );

  const ownedProperties = useMemo(
    () => userDetail.ownedProperties,
    [userDetail.ownedProperties],
  );

  const filteredProperties = useMemo(() => {
    return ownedProperties.filter((prop) => {
      if (
        selectedCategory !== PropertyCategory.NONE &&
        prop.propertyCategory !== selectedCategory
      )
        return false;
      if (onlyActive && prop.propertyState !== PropertyStatus.VERIFIED)
        return false;
      return true;
    });
  }, [ownedProperties, selectedCategory, onlyActive]);

  useEffect(() => {
    if (isMobile) {
      dispatch(setHideStickyNavBar(false));
    } else {
      dispatch(setHideStickyNavBar(true));
    }
  }, [isMobile, dispatch]);

  const onDashboard = (id: string) => {
    // router.push(`/account/properties/${id}`)
    console.log("Redirect to my-properties-details for: ", id);
  };

  const onMarkSold = (id: string) => {
    try {
      // TODO: call API -> mark sold, then mutate UI cache
      // await markPropertySold(id).unwrap();
      console.log("Property marked as sold:", id);
    } catch (error) {
      console.error("Failed to mark property as sold:", error);
    }
  };

  const onOpenDialog = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    openDialog(PROPERTY_ACTIONS_DIALOG_ID);
    console.log("Open dialog for:", selectedPropertyId);
  };

  const handleCloseDialog = () => {
    closeDialog(PROPERTY_ACTIONS_DIALOG_ID);
    dispatch(setHideStickyNavBar(false));
    setSelectedPropertyId("");
  };

  if (userDetailLoading) {
    return <Loading />;
  }

  if (userDetailError) {
    return <div>Error loading properties: {userDetailError}</div>;
  }

  return (
    <section>
      {/* Desktop */}
      <section className="max-md:hidden">
        {/* Header */}
        <div className="mb-8 flex justify-between border-b-2 pb-2">
          <h1 className="text-2xl font-medium">My Properties</h1>
          <button
            type="button"
            aria-pressed={onlyActive}
            onClick={() => setOnlyActive((v) => !v)}
            className="inline-flex items-center gap-2"
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-sm border border-red-500 ${
                onlyActive
                  ? "bg-red-500 text-white"
                  : "bg-transparent text-transparent"
              }`}
            >
              <Check className="h-4 w-4" />
            </span>
            <span className="text-lg text-gray-700">Only Active</span>
          </button>
        </div>

        {/* Filters */}
        <div className="mb-8 flex gap-3 text-lg font-medium text-gray-700">
          {filterOptions.map((f) => {
            const active = selectedCategory === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setSelectedCategory(f.value)}
                aria-pressed={active}
                className={`whitespace-nowrap rounded-lg border px-4 py-2 shadow-sm ${
                  active ? "bg-red-500 text-white border-red-500" : "bg-white"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="md:hidden">
        {/* Header */}
        <MobileHeader>
          <MobileHeader.LeftAction>
            <Button
              variant="secondary"
              size="custom"
              className="rounded-full p-1"
              onClick={() => router.back()}
            >
              <ChevronLeft size={24} />
            </Button>
          </MobileHeader.LeftAction>
          <MobileHeader.Title>My Properties</MobileHeader.Title>
        </MobileHeader>

        {/* Filter buttons */}
        <div className="flex justify-between text-lg m-3 border p-1.5 sm:p-2 rounded-xl mx-8">
          {filterOptions.map((f) => {
            const active = selectedCategory === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setSelectedCategory(f.value)}
                aria-pressed={active}
                className={`px-2 py-1 sm:px-4 sm:py-2 flex-1 whitespace-nowrap ${
                  active ? "border border-red-500 text-red-500 rounded-lg" : ""
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Table for ≥ 2xl */}
      <div className="max-2xl:hidden">
        <PropertyTable
          properties={filteredProperties}
          onDashboard={onDashboard}
          onMarkSold={onMarkSold}
        />
      </div>

      {/* Cards for < 2xl */}
      <div className="2xl:hidden max-md:px-6 pt-4 pb-16">
        <PropertyCardList
          items={filteredProperties}
          onDashboard={onDashboard}
          onMarkSold={onMarkSold}
          onOpenDialog={onOpenDialog}
        />
      </div>

      {isDialogOpen(PROPERTY_ACTIONS_DIALOG_ID) && (
        <MyPropertyActionsDialog
          id={PROPERTY_ACTIONS_DIALOG_ID}
          propertyID={selectedPropertyId}
          onDashboard={onDashboard}
          onMarkSold={onMarkSold}
          onClose={handleCloseDialog}
        />
      )}
    </section>
  );
}
