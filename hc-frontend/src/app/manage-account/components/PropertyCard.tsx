"use client";

import { CircleCheck, Ellipsis } from "lucide-react";
import { useRef, useState } from "react";

import { PropertyCategory } from "@/common/enums";
import { formatINRCurrency } from "@/common/utils";
import { MyProperty } from "@/interfaces/ManageAccount";
import { useDeviceContext } from "@/providers/DeviceContextProvider";

import { MyPropertiesActionMenu } from "./MyPropertiesActionMenu";

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
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { isMobile } = useDeviceContext();

  const isResale = category === PropertyCategory.RESALE;
  const amount = isResale ? price : rent;

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMobile) {
      onOpenDialog(propertyID);
    } else {
      setMenuFor((cur) => (cur === propertyID ? null : propertyID));
    }
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
            <button
              ref={buttonRef}
              aria-haspopup="menu"
              aria-expanded={menuFor === propertyID}
              onClick={handleActionClick}
              className="inline-flex items-center justify-center rounded-md p-1 hover:bg-gray-100"
            >
              <Ellipsis size={25} />
            </button>

            {/* Only show Actions menu for md and above */}
            <div className="max-md:hidden">
              <MyPropertiesActionMenu
                anchorEl={buttonRef.current}
                open={menuFor === propertyID}
                onClose={() => setMenuFor(null)}
                onDashboard={() => onDashboard(propertyID)}
                onMarkSold={() => onMarkSold(propertyID)}
              />
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
