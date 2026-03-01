"use client";

import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";

import { MARK_RENTED_ACTION_DIALOG_ID } from "@/common/dataConstants/dialogIDs";
import { PropertyCategory, PropertyStatus } from "@/common/enums";
import { MyPropertyActionsDialog } from "@/dialogs";
import { ActionDialog } from "@/dialogs/action-dialog";
import { useDialog } from "@/providers/DialogContextProvider";
import { useDeactivatePropertyMutation } from "@/store/apiSlice";
import { RootState } from "@/store/store";

import { PropertyTable } from "../../components/PropertiesTable";
import { PropertyCardList } from "../../components/PropertyCardList";
import Loading from "./loading";

const filterOptions = [
  { label: "All", value: PropertyCategory.NONE },
  // { label: "Resale", value: PropertyCategory.RESALE },
  { label: "Rent", value: PropertyCategory.RENT },
  { label: "Flatmate", value: PropertyCategory.FLATMATE },
];

const PROPERTY_ACTIONS_DIALOG_ID = "property-actions-dialog";

export default function MyPropertiesPage() {
  const router = useRouter();
  const [selectedFilterCategory, setSelectedFilterCategory] =
    useState<PropertyCategory>(PropertyCategory.NONE);
  const [onlyActive, setOnlyActive] = useState(false);
  const [selectedPropertyCategory, setSelectedPropertyCategory] = useState("");
  const [selectedPropertySate, setSelectedPropertySate] = useState("");
  const selectedPropertyIdRef = useRef("");
  const { isDialogOpen, openDialog, closeDialog } = useDialog();

  const [deactivatingProperty] = useDeactivatePropertyMutation();

  const { userDetail, userDetailLoading, userDetailError } = useSelector(
    (state: RootState) => state.user,
  );

  const ownedProperties = userDetail.ownedProperties;

  const filteredProperties = ownedProperties.filter((prop) => {
    if (
      selectedFilterCategory !== PropertyCategory.NONE &&
      prop.propertyCategory !== selectedFilterCategory
    )
      return false;
    if (onlyActive && prop.propertyState !== PropertyStatus.VERIFIED)
      return false;
    return true;
  });

  const onDashboard = (category: string, id: string) => {
    router.push(`/my-property-details/${category?.toLowerCase()}/${id}`);
  };

  const onOpenDialog = (
    propertyCategory: string,
    propertyId: string,
    propertyState: string,
  ) => {
    selectedPropertyIdRef.current = propertyId;
    setSelectedPropertyCategory(propertyCategory);
    setSelectedPropertySate(propertyState);
    openDialog(PROPERTY_ACTIONS_DIALOG_ID);
  };

  const handleMarkAsRented = (propertyId: string) => {
    selectedPropertyIdRef.current = propertyId;
    openDialog(MARK_RENTED_ACTION_DIALOG_ID);
  };

  const handleCloseDialog = (isTransitioning: boolean) => {
    closeDialog(PROPERTY_ACTIONS_DIALOG_ID);
    if (isTransitioning) return;
    selectedPropertyIdRef.current = "";
    setSelectedPropertyCategory("");
    setSelectedPropertySate("");
  };

  const handleDeactivatingProperty = async () => {
    try {
      const response = await deactivatingProperty({
        propertyID: selectedPropertyIdRef.current,
      }).unwrap();
      console.log(response);
      // Reset after success
      selectedPropertyIdRef.current = "";
    } catch (error) {
      console.error("Error marking property as rented:", error);
    }
  };

  if (userDetailLoading || userDetailError) {
    return <Loading />;
  }

  return (
    <section>
      {/* Desktop */}
      <section className="max-md:hidden">
        {/* Header */}
        <div className="flex justify-between pb-2 mb-8 border-b-2">
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
              <Check className="w-4 h-4" />
            </span>
            <span className="text-lg text-gray-700">Only Active</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-8 text-lg font-medium text-gray-700">
          {filterOptions.map((f) => {
            const active = selectedFilterCategory === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setSelectedFilterCategory(f.value)}
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
        {/* Filter buttons */}
        <div className="flex justify-between text-lg m-3 border p-1.5 sm:p-2 rounded-xl mx-6">
          {filterOptions.map((f) => {
            const active = selectedFilterCategory === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setSelectedFilterCategory(f.value)}
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
          onMarkAsRented={handleMarkAsRented}
        />
      </div>

      {/* Cards for < 2xl */}
      <div className="pt-4 pb-16 2xl:hidden max-md:px-6">
        <PropertyCardList
          items={filteredProperties}
          onDashboard={onDashboard}
          onOpenDialog={onOpenDialog}
          onMarkAsRented={handleMarkAsRented}
        />
      </div>

      {isDialogOpen(PROPERTY_ACTIONS_DIALOG_ID) && (
        <MyPropertyActionsDialog
          id={PROPERTY_ACTIONS_DIALOG_ID}
          propertyID={selectedPropertyIdRef.current}
          propertyState={selectedPropertySate}
          propertyCategory={selectedPropertyCategory}
          onDashboard={onDashboard}
          onMarkAsRented={handleMarkAsRented}
          onClose={handleCloseDialog}
        />
      )}

      {isDialogOpen(MARK_RENTED_ACTION_DIALOG_ID) && (
        <ActionDialog
          id={MARK_RENTED_ACTION_DIALOG_ID}
          title="Mark as rented out"
          prompt="Are you sure you want to mark this property as Rented out?"
          confirmLabel="Yes, mark as rented!"
          colour="red"
          requireComment={false}
          onConfirm={handleDeactivatingProperty}
          // onSuccess={async () => await refetch()}
          onClose={() => {
            closeDialog(MARK_RENTED_ACTION_DIALOG_ID);
            selectedPropertyIdRef.current = "";
            setSelectedPropertyCategory("");
          }}
        />
      )}
    </section>
  );
}
