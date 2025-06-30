import { Eye, Pencil } from "lucide-react";

import { Column } from "@/components/DataTable";
import IconButtonWithTooltip from "@/components/IconButtonWithTooltip";
import { RenderPropertyStatus } from "@/components/status/RenderPropertyStatus";
import { PropertyInfo } from "@/interfaces/Property";

type ViewDetailsFunction = (propertyID: string, type: string) => void;

export const createCommonColumns = (
  viewDetails: ViewDetailsFunction,
): Column<PropertyInfo & { _serial: number }>[] => [
  {
    key: "serial",
    label: "Sr. No.",
    accessor: "_serial",
    className: "w-20",
  },
  {
    key: "location",
    label: "Location",
    accessor: "location",
  },
  {
    key: "propertyCategory",
    label: "Category",
    accessor: "propertyCategory",
  },
  {
    key: "bhkType",
    label: "BHK Type",
    accessor: "bhkType",
  },
  {
    key: "createdOn",
    label: "Last Modified",
    render: (p) => new Date(p.updatedOn || p.createdOn).toLocaleString("en-IN"),
  },
  {
    key: "availableFrom",
    label: "Available From",
    render: (p) => new Date(p.availableFrom).toLocaleDateString("en-IN"),
  },
  {
    key: "status",
    label: "Status",
    render: (p) => <RenderPropertyStatus status={p.propertyState} />,
  },
  {
    key: "action",
    label: "Action",
    render: (p) => (
      <div className="flex items-center gap-3">
        <IconButtonWithTooltip
          onClick={() => console.log("Edit")}
          Icon={Pencil}
          tooltipActive={true}
          tooltip="View Profile"
          classNameIconCustomize="size-5"
        />
        <IconButtonWithTooltip
          onClick={() => viewDetails(p.propertyCategory, p.propertyID)}
          Icon={Eye}
          tooltipActive={true}
          tooltip="View Profile"
          classNameIconCustomize="size-6"
        />
      </div>
    ),
  },
];
