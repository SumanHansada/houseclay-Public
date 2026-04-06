"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
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

const tabTween = {
  type: "tween" as const,
  duration: 0.28,
  ease: [0.4, 0, 0.2, 1] as const,
};

const listCrossfade = {
  duration: 0.18,
  ease: [0.4, 0, 0.2, 1] as const,
};

export default function MyPropertiesPage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
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

  const filteredProperties = useMemo(() => {
    return ownedProperties.filter((prop) => {
      if (
        selectedFilterCategory !== PropertyCategory.NONE &&
        prop.propertyCategory !== selectedFilterCategory
      )
        return false;
      if (onlyActive && prop.propertyState !== PropertyStatus.VERIFIED)
        return false;
      return true;
    });
  }, [ownedProperties, selectedFilterCategory, onlyActive]);

  const activeFilterIndex = Math.max(
    0,
    filterOptions.findIndex((f) => f.value === selectedFilterCategory),
  );

  const listPresenceKey = `${selectedFilterCategory}-${onlyActive}`;

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
        <div className="m-3 mx-4 rounded-xl border border-gray-200 bg-gray-50/80 p-1.5 text-lg sm:p-2">
          <div className="relative flex min-h-10 sm:min-h-11">
            <motion.div
              className="pointer-events-none absolute inset-y-0 left-0 z-0 rounded-lg border border-red-500 bg-white shadow-sm"
              initial={false}
              style={{
                width: `${100 / filterOptions.length}%`,
              }}
              animate={{
                left: `${(activeFilterIndex / filterOptions.length) * 100}%`,
              }}
              transition={
                reduceMotion ? { duration: 0, ease: "linear" } : tabTween
              }
              aria-hidden
            />
            {filterOptions.map((f) => {
              const active = selectedFilterCategory === f.value;
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setSelectedFilterCategory(f.value)}
                  aria-pressed={active}
                  className="relative z-10 flex flex-1 items-center justify-center whitespace-nowrap rounded-lg px-2 py-1 sm:px-4 sm:py-2"
                >
                  <span
                    className={`text-sm font-medium sm:text-base ${
                      active ? "text-red-500" : "text-gray-800"
                    }`}
                  >
                    {f.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Table for ≥ 2xl */}
      <div className="mx-auto max-2xl:hidden grid w-full [grid-template-areas:'stack']">
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={listPresenceKey}
            className="[grid-area:stack] w-full min-w-0"
            initial={{ opacity: reduceMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: reduceMotion ? 1 : 0 }}
            transition={reduceMotion ? { duration: 0 } : listCrossfade}
          >
            <PropertyTable
              properties={filteredProperties}
              onDashboard={onDashboard}
              onMarkAsRented={handleMarkAsRented}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Cards for < 2xl */}
      <div className="mx-auto grid w-full [grid-template-areas:'stack'] pt-4 pb-16 2xl:hidden max-md:px-6">
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={listPresenceKey}
            className="[grid-area:stack] w-full min-w-0"
            initial={{ opacity: reduceMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: reduceMotion ? 1 : 0 }}
            transition={reduceMotion ? { duration: 0 } : listCrossfade}
          >
            <PropertyCardList
              items={filteredProperties}
              onDashboard={onDashboard}
              onOpenDialog={onOpenDialog}
              onMarkAsRented={handleMarkAsRented}
            />
          </motion.div>
        </AnimatePresence>
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
