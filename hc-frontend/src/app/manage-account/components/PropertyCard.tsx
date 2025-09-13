"use client";

import { CircleCheck, Ellipsis } from "lucide-react";

import { PropertyCategory } from "@/common/enums";
import { formatINRCurrency } from "@/common/utils";
import { MyProperty } from "@/interfaces/ManageAccount";
import { useDeviceContext } from "@/providers/DeviceContextProvider";

import { ActionMenu, type ActionOption } from "./ActionMenu";

export interface PropertyCardProps extends MyProperty {
  onDashboard: (propertyId: string) => void;
  onMarkSold: (propertyId: string) => void;
  onOpenDialog: (propertyId: string) => void;
}

export function PropertyCard({
  propertyID,
  propertyName,
  category,
  builtupArea,
  price,
  rent,
  status,
  onDashboard,
  onMarkSold,
  onOpenDialog,
}: PropertyCardProps) {
  const { isMobile } = useDeviceContext();

  const isResale = category === PropertyCategory.RESALE;
  const amount = isResale ? price : rent;

  // Desktop menu options
  const options: ActionOption[] = [
    { id: "dashboard", label: "Open Dashboard" },
    { id: "sold", label: "Mark as Sold/Rented" },
  ];

  const handleSelect = (opt: ActionOption) => {
    if (opt.id === "dashboard") onDashboard(propertyID);
    if (opt.id === "sold") onMarkSold(propertyID);
  };

  return (
    <div className="rounded-xl bg-gray-50 p-4 shadow-sm">
      <div className="border-b-2 pb-2">
        <div className="w-full flex justify-between">
          <div className="flex shrink-0 items-center gap-2 text-lg">
            {status === "Active" ? (
              <span className="inline-flex items-center gap-1">
                <CircleCheck size={25} className="text-white fill-lime-500" />
                Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1">Inactive</span>
            )}
          </div>

          <div className="flex items-center justify-center gap-4">
            <span className="py-1 px-2 border border-black rounded-lg text-sm">
              {category}
            </span>

            {/* Mobile: open your existing dialog */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (isMobile) onOpenDialog(propertyID);
              }}
              className="md:hidden inline-flex items-center justify-center rounded-md p-1 hover:bg-gray-100"
              aria-label="Open actions"
            >
              <Ellipsis size={25} />
            </button>

            {/* Desktop: use ActionMenu (portal + fixed) */}
            <div className="max-md:hidden">
              <ActionMenu
                options={options}
                onSelect={handleSelect}
                alignEnd
                minWidthPx={180}
                className="inline-flex items-center justify-center rounded-md p-1 hover:bg-gray-100"
              >
                <Ellipsis size={25} />
              </ActionMenu>
            </div>
          </div>
        </div>

        <div className="min-w-0 mt-4">
          <h1 className="truncate text-lg font-medium text-gray-900">
            {propertyName}
          </h1>
        </div>
      </div>

      <div className="w-full flex justify-between items-center mt-4">
        <div className="text-gray-400 text-sm">
          Buildup Area
          <span className="ml-2 text-gray-800">{builtupArea}&nbsp;Sqft.</span>
        </div>
        <div className="text-lg font-medium text-gray-900">
          {amount != null ? formatINRCurrency(amount) : "-"}
        </div>
      </div>
    </div>
  );
}
