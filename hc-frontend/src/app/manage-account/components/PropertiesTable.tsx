"use client";

import { CircleCheck, Ellipsis } from "lucide-react";

import { PropertyCategory } from "@/common/enums";
import { formatINRCurrency } from "@/common/utils";
import { Column, WebsiteDataTable } from "@/components/DataTable";

import { ActionMenu, type ActionOption } from "./ActionMenu";

interface Property {
  propertyID: string;
  propertyName: string;
  category: PropertyCategory;
  listedOn: string;
  builtupArea: number;
  price: number | null;
  rent: number | null;
  status: string;
}

export function PropertyTable({
  properties,
  onDashboard,
  onMarkSold,
}: {
  properties: Property[];
  onDashboard: (propertyId: string) => void;
  onMarkSold: (propertyId: string) => void;
}) {
  const columns: Column<Property>[] = [
    {
      key: "propertyName",
      label: "Property",
      cellClassName: "max-w-20",
      render: (item) => (
        <span
          title={item.propertyName}
          className="inline-block max-w-[90%] truncate align-middle font-medium text-gray-800"
        >
          {item.propertyName}
        </span>
      ),
    },
    {
      key: "type",
      label: "Type",
      accessor: "category",
      headerClassName: "w-[12%]",
      cellClassName: "w-[12%] whitespace-nowrap",
    },
    {
      key: "price",
      label: "Price",
      headerClassName: "w-[14%]",
      cellClassName: "w-[14%] font-medium text-gray-800 whitespace-nowrap",
      render: (item) => {
        const isResale = item.category === PropertyCategory.RESALE;
        const amount = isResale ? item.price : item.rent;
        return <span>{amount != null ? formatINRCurrency(amount) : "-"}</span>;
      },
    },
    {
      key: "listedOn",
      label: "Listed on",
      headerClassName: "w-[14%]",
      cellClassName: "w-[14%] whitespace-nowrap text-gray-700",
      render: (item) => {
        const date = new Date(item.listedOn);
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
      render: (item) => <span>{item.builtupArea}&nbsp;Sqft.</span>,
    },
    {
      key: "status",
      label: "Status",
      headerClassName: "w-[10%]",
      cellClassName: "w-[10%]",
      render: (item) =>
        item.status === "Active" ? (
          <div className="flex items-center gap-1">
            <CircleCheck size={25} className="text-white fill-lime-500" />
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
        // enforce fixed layout so widths behave
        className="hidden 2xl:block"
        columns={columns}
        data={properties}
        getRowId={(row) => row.propertyID}
        noDataMessage="No properties found"
        ariaLabel="Properties table"
      />
    </div>
  );
}
