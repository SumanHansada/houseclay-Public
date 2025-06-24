"use client";

import { SearchIcon, SlidersHorizontal } from "lucide-react";
// import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useReducer } from "react";
import { useDispatch } from "react-redux";

import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";
import { setHideFooter, setHideHeader } from "@/store/appSlice";

import Autocomplete from "./common/Autocomplete";
import Button from "./common/Button";
import SelectDropdown from "./common/SelectDropdown";
import SearchFilterDialog from "./MoreSearchFilters";

type PropertySearchState = {
  propertyType: string | number | boolean;
  propertyCategory: string | number | boolean;
  propertyBhk: string | number | boolean;
  tenantType: string | number | boolean;
};

type PropertySearchAction = {
  type:
    | "SET_PROPERTY_TYPE"
    | "SET_PROPERTY_CATEGORY"
    | "SET_PROPERTY_BHK"
    | "SET_TENANT_TYPE";
  payload: string | number | boolean;
};

const initialState: PropertySearchState = {
  propertyType: "",
  propertyCategory: "buy",
  propertyBhk: "",
  tenantType: "",
};

const propertyReducer = (
  state: PropertySearchState,
  action: PropertySearchAction,
): PropertySearchState => {
  switch (action.type) {
    case "SET_PROPERTY_TYPE":
      return { ...state, propertyType: action.payload };
    case "SET_PROPERTY_CATEGORY":
      return { ...state, propertyCategory: action.payload };
    case "SET_PROPERTY_BHK":
      return { ...state, propertyBhk: action.payload };
    case "SET_TENANT_TYPE":
      return { ...state, tenantType: action.payload };
    default:
      return state;
  }
};

export const SearchAndFilterBar: React.FC = () => {
  // const searchParams = useSearchParams();
  // const router = useRouter();
  const { isMobile } = useDeviceContext();
  const dispatch = useDispatch();
  const { openDialog, closeDialog, isDialogOpen } = useDialog();

  // hide header/footer on mobile
  useEffect(() => {
    if (isMobile) {
      dispatch(setHideHeader(true));
      dispatch(setHideFooter(true));
    } else {
      dispatch(setHideHeader(false));
      dispatch(setHideFooter(false));
    }
  }, [dispatch, isMobile]);

  const [searchState, searchDispatch] = useReducer(
    propertyReducer,
    initialState,
  );
  return (
    <>
      {/* Mobile bar */}
      {/* <section className="w-full h-[55px] border-b border-gray-200 bg-white flex gap-2 justify-center items-center md:hidden">
        <button
          className="rounded-full items-center justify-center"
          onClick={() => router.back()}
        >
          <ChevronLeft size={25} />
        </button>
        <Autocomplete
          items={[
            "The Godfather",
            "12 Angry Men",
            "The Shawshank Redemption",
            "Schindler's List",
            "Pulp Fiction",
          ]}
          inputClassName="flex items-center h-10 bg-gray-100 w-full p-2 border-none rounded-full"
          placeholder="Search for a property"
        />
        <Button
          leftIcon={<SlidersHorizontal size={16} />}
          variant="outline"
          size="sm"
          className="h-10 text-black text-sm bg-gray-100 rounded-full p-2 border-none"
          onClick={() => openDialog("property-filters")}
          buttonTextClassName="hidden"
        >
          Filters
        </Button>
      </section> */}

      {/* Desktop bar */}
      <section className="flex w-full">
        <div className="flex justify-between items-center border-gray-200 w-full gap-4">
          <div className="flex-1">
            <Autocomplete
              items={[
                "The Godfather",
                "12 Angry Men",
                "The Shawshank Redemption",
                "Schindler's List",
                "Pulp Fiction",
              ]}
              inputClassName="flex items-center min-h-[46px] w-full px-3 py-2 border border-gray-300 rounded-xl bg-white"
              placeholder="Search for a property"
            />
          </div>
          <div className="flex items-center gap-2 flex-row">
            <SelectDropdown
              options={[
                { value: "flatmates", label: "Flatmates" },
                { value: "rent", label: "Rent" },
                { value: "buy", label: "Buy" },
              ]}
              name="property-category"
              id="property-category"
              value={searchState.propertyCategory}
              onChange={(v) =>
                searchDispatch({ type: "SET_PROPERTY_CATEGORY", payload: v })
              }
              size="sm"
              containerClassName="relative w-20"
              buttonClassName="flex justify-between items-center w-full p-3 border rounded-xl text-left border-red-500 text-red-500 hover:border-red-500 hover:text-red-500"
            />
            <SelectDropdown
              options={[
                { value: "Apartment", label: "Apartment" },
                { value: "Villa", label: "Villa" },
                { value: "House", label: "House" },
                { value: "Plot", label: "Plot" },
                { value: "Commercial", label: "Commercial" },
              ]}
              name="property-type"
              id="property-type"
              value={searchState.propertyType}
              placeholder="Property type"
              onChange={(v) =>
                searchDispatch({ type: "SET_PROPERTY_TYPE", payload: v })
              }
              size="sm"
              containerClassName="relative w-36 lg:block md:hidden"
            />
            <SelectDropdown
              options={[
                { value: "1BHK", label: "1 BHK" },
                { value: "2BHK", label: "2 BHK" },
                { value: "3BHK", label: "3 BHK" },
                { value: "4BHK", label: "4 BHK" },
                { value: "5+BHK", label: "5+ BHK" },
              ]}
              name="property-bhk"
              id="property-bhk"
              value={searchState.propertyBhk}
              placeholder="Beds"
              onChange={(v) =>
                searchDispatch({ type: "SET_PROPERTY_BHK", payload: v })
              }
              size="sm"
              containerClassName="relative w-28 lg:w-28 md:w-24"
            />
            <SelectDropdown
              options={[
                { value: "couple", label: "Couple" },
                { value: "family", label: "Family" },
                { value: "bachelor", label: "Bachelor" },
                { value: "company", label: "Company" },
              ]}
              name="tenant-type"
              id="tenant-type"
              value={searchState.tenantType}
              placeholder="Tenant type"
              onChange={(v) =>
                searchDispatch({ type: "SET_TENANT_TYPE", payload: v })
              }
              size="sm"
              containerClassName="relative w-32"
            />
            <Button
              leftIcon={<SlidersHorizontal size={16} />}
              variant="outline"
              size="md"
              className="min-h-[46px] text-black rounded-xl border text-sm"
              onClick={() => openDialog("property-filters")}
            >
              Filters
            </Button>
            <Button
              leftIcon={<SearchIcon size={16} />}
              variant="primary"
              size="md"
              className="min-h-[46px] rounded-xl text-sm"
            >
              Search
            </Button>
          </div>
        </div>
      </section>
      {isDialogOpen("property-filters") && (
        <SearchFilterDialog
          id="property-filters"
          onClose={() => closeDialog("property-filters")}
          onReset={() => console.log("reset filter states")}
          onApply={() => closeDialog("property-filters")}
        />
      )}
    </>
  );
};
