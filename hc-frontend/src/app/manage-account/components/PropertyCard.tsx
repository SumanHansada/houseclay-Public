"use client";

import { CircleCheck, Ellipsis } from "lucide-react";
import Link from "next/link";

import { PropertyCategory, PropertyStatus } from "@/common/enums";
import { formatINRCurrency, pascalCase } from "@/common/utils";
import { UserOwnedProperties } from "@/interfaces/User";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { Popover } from "@/utility-components";

export interface PropertyCardProps {
  property: UserOwnedProperties;
  onDashboard: (propertyCategory: string, propertyId: string) => void;
  onMarkSold: (propertyId: string) => void;
  onOpenDialog: (propertyCategory: string, propertyId: string) => void;
}

export function PropertyCard({
  property,
  onDashboard,
  onMarkSold,
  onOpenDialog,
}: PropertyCardProps) {
  const { isMobile } = useDeviceContext();

  const isResale = property.propertyCategory === PropertyCategory.RESALE;
  // const amount = isResale ? property.price : property.rent;
  const formattedAmount =
    property.price != null ? formatINRCurrency(property.price) : "NA";

  const propertyLink = `/my-property-details/${property.propertyCategory?.toLowerCase()}/${property.propertyID}`;

  return (
    <div className="rounded-xl bg-gray-50 p-4 shadow-sm">
      <div className="border-b-2 pb-2">
        <div className="w-full flex justify-between">
          <div className="flex shrink-0 items-center gap-2 text-lg">
            {property.propertyState === PropertyStatus.VERIFIED ? (
              <span className="inline-flex items-center gap-1">
                <CircleCheck size={25} className="text-white fill-green-600" />
                Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1">Inactive</span>
            )}
          </div>

          <div className="flex items-center justify-center gap-4">
            <span className="py-1 px-2 border border-black rounded-lg text-sm">
              {pascalCase(property.propertyCategory)}
            </span>

            {/* Mobile: open your existing dialog */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (isMobile)
                  onOpenDialog(property.propertyCategory, property.propertyID);
              }}
              className="md:hidden inline-flex items-center justify-center rounded-md p-1 hover:bg-gray-100"
              aria-label="Open actions"
            >
              <Ellipsis size={25} />
            </button>

            {/* Desktop: use ActionMenu (portal + fixed) */}
            <div className="max-md:hidden">
              <Popover
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
                        onMarkSold(property.propertyID);
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
                  className="inline-flex items-center justify-center rounded-md p-1 hover:bg-gray-100"
                  aria-label="Actions"
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
            className="inline-block max-w-72 truncate text-lg font-medium text-gray-900"
          >
            {property.bhkType} in {property.locationOrSocietyName} for{" "}
            {pascalCase(property.propertyCategory)}
          </Link>
        </div>
      </div>

      <div className="w-full flex justify-between items-center mt-4">
        <div className="text-gray-400 text-sm">
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
