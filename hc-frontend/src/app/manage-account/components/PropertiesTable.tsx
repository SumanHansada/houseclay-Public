"use client";

import { CircleCheck, Ellipsis } from "lucide-react";
import { PropertyCategory, PropertyStatus } from "@/common/enums";
import { formatINRCurrency, pascalCase } from "@/common/utils";
import { DataTable, Column } from "@/components/DataTable";
import { UserOwnedProperties } from "@/interfaces/User";
import { ActionMenu, type ActionOption } from "./ActionMenu";

export function PropertyTable({
  properties,
  onDashboard,
  onMarkSold,
}: {
  properties: UserOwnedProperties[];
  onDashboard: (propertyId: string) => void;
  onMarkSold: (propertyId: string) => void;
}) {
  const columns: Column<UserOwnedProperties>[] = [
    {
      key: "propertyName",
      label: "Property",
      render: (prop) => {
        const propertyTitle = `${prop.bhkType} in ${prop.locationOrSocietyName} for ${pascalCase(prop.propertyCategory)}`;
        return (
          <span
            title={propertyTitle}
            className="inline-block max-w-xs truncate align-middle font-medium text-gray-800"
          >
            {propertyTitle}
          </span>
        );
      },
    },
    {
      key: "price",
      label: "Price",
      className: "w-32",
      render: (prop) => {
        const isResale = prop.propertyCategory === PropertyCategory.RESALE;
        const amount = isResale ? prop.price : prop.rent;
        const formattedAmount =
          amount != null ? formatINRCurrency(amount) : "-";
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
          <span className="whitespace-nowrap text-gray-700">
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
          <span className="text-gray-500 px-1">Inactive</span>
        ),
    },
    {
      key: "action",
      label: "Action",
      className: "w-20 text-center",
      render: (item) => (
        <div className="flex justify-center">
          <ActionMenu<ActionOption>
            alignEnd
            minWidthPx={180}
            options={[
              { id: "dashboard", label: "Open Dashboard" },
              { id: "sold", label: "Mark as Sold/Rented" },
            ]}
            onSelect={(opt: ActionOption) => {
              if (opt.id === "dashboard") onDashboard(item.propertyID);
              if (opt.id === "sold") onMarkSold(item.propertyID);
            }}
            className="inline-flex items-center justify-center rounded-md p-1 hover:bg-gray-100"
          >
            <Ellipsis size={24} />
          </ActionMenu>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white overflow-x-auto">
      <DataTable
        columns={columns}
        data={properties}
        getRowId={(row) => row.propertyID}
        noDataMessage="No properties found"
      />
    </div>
  );
}
