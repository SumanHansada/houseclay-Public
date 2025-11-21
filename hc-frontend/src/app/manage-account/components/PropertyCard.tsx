"use client";

import { CircleCheck, Clock, Ellipsis } from "lucide-react";
import Link from "next/link";

import { MARK_RENTED_ACTION_DIALOG_ID } from "@/common/constants";
import {
  BHK_TYPE_OPTIONS,
  getOptionLabel,
} from "@/common/dataConstants/options";
import { PropertyCategory, PropertyStatus } from "@/common/enums";
import { formatINRCurrency, pascalCase } from "@/common/utils";
import { UserOwnedProperties } from "@/interfaces/User";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";
import { Popover } from "@/utility-components";

export interface PropertyCardProps {
  property: UserOwnedProperties;
  onDashboard: (propertyCategory: string, propertyId: string) => void;
  onOpenDialog: (propertyCategory: string, propertyId: string) => void;
}

export function PropertyCard({
  property,
  onDashboard,
  onOpenDialog,
}: PropertyCardProps) {
  const { isMobile } = useDeviceContext();
  const { openDialog } = useDialog();

  const isResale = property.propertyCategory === PropertyCategory.RESALE;
  // const amount = isResale ? property.price : property.rent;
  const formattedAmount =
    property.price != null ? formatINRCurrency(property.price) : "NA";

  const propertyLink = `/my-property-details/${property.propertyCategory?.toLowerCase()}/${property.propertyID}`;

  return (
    <div className="p-4 shadow-sm rounded-xl bg-gray-50">
      <div className="pb-2 border-b-2">
        <div className="flex justify-between w-full">
          <div className="flex items-center gap-2 text-lg shrink-0">
            {property.propertyState === PropertyStatus.VERIFIED ? (
              <span className="inline-flex items-center gap-1">
                <CircleCheck size={25} className="text-white fill-green-600" />
                Active
              </span>
            ) : property.propertyState === PropertyStatus.PENDING ? (
              <span className="inline-flex items-center gap-1">
                <Clock size={20} className="text-orange-500" />
                Pending
              </span>
            ) : (
              <span className="inline-flex items-center gap-1">Inactive</span>
            )}
          </div>

          <div className="flex items-center justify-center gap-4">
            <span className="px-2 py-1 text-sm border border-black rounded-lg">
              {pascalCase(property.propertyCategory)}
            </span>

            {/* Mobile: open your existing dialog */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (isMobile)
                  onOpenDialog(property.propertyCategory, property.propertyID);
              }}
              className="inline-flex items-center justify-center p-1 rounded-md md:hidden hover:bg-gray-100"
              aria-label="Open actions"
            >
              <Ellipsis size={25} />
            </button>

            {/* Desktop: use ActionMenu (portal + fixed) */}
            <div className="max-md:hidden">
              <Popover
                id="property-card-popover"
                trigger="click"
                align="end"
                offset={2}
                panelClassName="w-44 py-1 text-sm"
                content={({ close }) => (
                  <div>
                    <button
                      type="button"
                      className="block w-full px-3 py-2 text-left hover:bg-gray-100"
                      onClick={() => {
                        onDashboard(
                          property.propertyCategory,
                          property.propertyID,
                        );
                        close();
                      }}
                    >
                      Open Dashboard
                    </button>
                    <button
                      type="button"
                      className="block w-full px-3 py-2 text-left hover:bg-gray-100"
                      onClick={() => {
                        openDialog(MARK_RENTED_ACTION_DIALOG_ID);
                        close();
                      }}
                    >
                      Mark as Sold/Rented
                    </button>
                  </div>
                )}
              >
                <button
                  type="button"
                  className="inline-flex items-center justify-center p-1 rounded-md hover:bg-gray-100"
                  aria-label="property-card-actions"
                >
                  <Ellipsis size={24} />
                </button>
              </Popover>
            </div>
          </div>
        </div>

        <div className="min-w-0 mt-4">
          <Link
            href={propertyLink}
            className="inline-block text-lg font-medium text-gray-900 truncate max-w-72"
          >
            {getOptionLabel(BHK_TYPE_OPTIONS, property.bhkType)} in{" "}
            {property.locationOrSocietyName} for{" "}
            {pascalCase(property.propertyCategory)}
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between w-full mt-4">
        <div className="text-sm text-gray-400">
          BuiltUp Area
          <span className="ml-2 text-gray-800">
            {property.builtUpArea}&nbsp;Sqft.
          </span>
        </div>
        <div className="text-lg font-medium text-gray-900">
          {isResale ? formattedAmount : `${formattedAmount}/Month`}
        </div>
      </div>
    </div>
  );
}
