"use client";

import { CircleCheck, Ellipsis } from "lucide-react";
import Link from "next/link";

import {
  BHK_TYPE_OPTIONS,
  getOptionLabel,
} from "@/common/dataConstants/options";
import { PropertyCategory, PropertyStatus } from "@/common/enums";
import { formatINRCurrency, pascalCase } from "@/common/utils";
import { Column, DataTable } from "@/components/DataTable";
import { UserOwnedProperties } from "@/interfaces/User";
import { Popover } from "@/utility-components";

export function PropertyTable({
  properties,
  onDashboard,
  onMarkSold,
}: {
  properties: UserOwnedProperties[];
  onDashboard: (propertyCategory: string, propertyId: string) => void;
  onMarkSold: (propertyId: string) => void;
}) {
  // getOptionLabel(BHK_TYPE_OPTIONS, prop.bhkType);
  const columns: Column<UserOwnedProperties>[] = [
    {
      key: "propertyName",
      label: "Property",
      render: (prop) => {
        const propertyLink = `/my-property-details/${prop.propertyCategory?.toLowerCase()}/${prop.propertyID}`;
        const propertyTitle = `${getOptionLabel(BHK_TYPE_OPTIONS, prop.bhkType)} in ${prop.locationOrSocietyName} for ${pascalCase(prop.propertyCategory)}`;
        return (
          <Link
            href={propertyLink}
            className="inline-block max-w-[360px] truncate align-middle font-medium text-gray-800"
          >
            {propertyTitle}
          </Link>
        );
      },
    },
    {
      key: "price",
      label: "Price",
      className: "w-32",
      render: (prop) => {
        const isResale = prop.propertyCategory === PropertyCategory.RESALE;
        // const amount = isResale ? prop.price : prop.rent;
        const formattedAmount =
          prop.price != null ? formatINRCurrency(prop.price) : "-";
        return (
          <span className="font-medium text-gray-800 whitespace-nowrap">
            {isResale ? formattedAmount : `${formattedAmount}/Month`}
          </span>
        );
      },
    },
    {
      key: "listedOn",
      label: "Listed on",
      className: "w-28",
      render: (prop) => {
        const date = new Date(prop.createdOn);
        const day = date.getDate().toString().padStart(2, "0");
        const month = date.toLocaleString("en-US", { month: "short" });
        const year = date.getFullYear();
        return (
          <span className="text-gray-700 whitespace-nowrap">
            {day}-{month}-{year}
          </span>
        );
      },
    },
    {
      key: "builtupArea",
      label: "Built-up",
      className: "w-28",
      render: (prop) => (
        <span className="whitespace-nowrap">{prop.builtUpArea} Sqft.</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      className: "w-24",
      render: (prop) =>
        prop.propertyState === PropertyStatus.VERIFIED ? (
          <div className="flex items-center gap-1">
            <CircleCheck size={25} className="text-white fill-green-600" />
            <span>Active</span>
          </div>
        ) : (
          <span className="px-1 text-gray-500">Inactive</span>
        ),
    },
    {
      key: "action",
      label: "Action",
      className: "w-20 text-center",
      render: (item) => (
        <Popover
          id="manage-account-popover"
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
                  onDashboard(item.propertyCategory, item.propertyID);
                  close();
                }}
              >
                Open Dashboard
              </button>
              <button
                type="button"
                className="block w-full px-3 py-2 text-left hover:bg-gray-100"
                onClick={() => {
                  onMarkSold(item.propertyID);
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
            aria-label="Actions"
          >
            <Ellipsis size={24} />
          </button>
        </Popover>
      ),
    },
  ];

  return (
    <div className="overflow-x-auto bg-white">
      <DataTable
        columns={columns}
        data={properties}
        getRowId={(row) => row.propertyID}
        noDataMessage="No properties found"
      />
    </div>
  );
}
