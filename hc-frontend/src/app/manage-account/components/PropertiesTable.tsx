"use client";

import { CircleCheck, Ellipsis } from "lucide-react";

import { PropertyCategory, PropertyStatus } from "@/common/enums";
import { formatINRCurrency, pascalCase } from "@/common/utils";
import { Column, WebsiteDataTable } from "@/components/DataTable";
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
      cellClassName: "max-w-20",
      render: (prop) => {
        const propertyTitle = `${prop.bhkType} in ${prop.locationOrSocietyName} for ${pascalCase(prop.propertyCategory)}`;
        return (
          <span
            title={propertyTitle}
            className="inline-block max-w-[90%] truncate align-middle font-medium text-gray-800"
          >
            {propertyTitle}
          </span>
        );
      },
    },
    {
      key: "price",
      label: "Price",
      headerClassName: "w-[14%]",
      cellClassName: "w-[14%] font-medium text-gray-800 whitespace-nowrap",
      render: (prop) => {
        const isResale = prop.propertyCategory === PropertyCategory.RESALE;
        const amount = isResale ? prop.price : prop.rent;
        const formattedAmount =
          amount != null ? formatINRCurrency(amount) : "-";
        return (
          <span>{isResale ? formattedAmount : `${formattedAmount}/Month`}</span>
        );
      },
    },
    {
      key: "listedOn",
      label: "Listed on",
      headerClassName: "w-[14%]",
      cellClassName: "w-[14%] whitespace-nowrap text-gray-700",
      render: (prop) => {
        const date = new Date(prop.createdOn);
        const day = date.getDate().toString().padStart(2, "0");
        const month = date.toLocaleString("en-US", { month: "short" });
        const year = date.getFullYear();
        return <>{`${day}-${month}-${year}`}</>;
      },
    },
    {
      key: "builtupArea",
      label: "Built-up",
      headerClassName: "w-[12%]",
      cellClassName: "w-[12%] whitespace-nowrap",
      render: (prop) => <span>{prop.builtUpArea}&nbsp;Sqft.</span>,
    },
    {
      key: "status",
      label: "Status",
      headerClassName: "w-[10%]",
      cellClassName: "w-[10%]",
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
      headerClassName: "w-[8%] text-center",
      cellClassName: "w-[8%] text-center",
      render: (item) => (
        <div className="inline-flex">
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
    <div className="bg-white overflow-x-auto 2xl:overflow-visible">
      <WebsiteDataTable
        className="max-2xl:hidden"
        columns={columns}
        data={properties}
        getRowId={(row) => row.propertyID}
        noDataMessage="No properties found"
        ariaLabel="Properties table"
      />
    </div>
  );
}
