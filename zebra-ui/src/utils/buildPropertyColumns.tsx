import { Eye, Pencil } from "lucide-react";
import { Column } from "@/components/DataTable";
import IconButtonWithTooltip from "@/components/IconButtonWithTooltip";
import { RenderPropertyStatus } from "@/components/status/RenderPropertyStatus";
import { PropertyInfo } from "@/interfaces/Property";

export type ViewDetailsFn = (propertyID: string, type: string) => void;

/**
 * Factory that returns the common columns used by all property tables.
 * Call it in your table component and pass the handler that should run
 * when the “View Details” icon is clicked.
 */
export function buildPropertyColumns(
  viewDetails: ViewDetailsFn,
): Column<PropertyInfo & { _serial: number }>[] {
  return [
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
      render: (p) => {
        const val = new Date(p.updatedOn || p.createdOn);
        const time = val.toLocaleTimeString("en-IN", {
          hour: "numeric",
          minute: "2-digit",
          // second: "2-digit",
          hour12: true,
        });
        const date = val.toLocaleDateString("en-IN");

        return `${time}, ${date}`;
      },
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
            tooltipActive
            tooltip="Edit Property"
            classNameIconCustomize="size-5"
          />
          <IconButtonWithTooltip
            onClick={() => viewDetails(p.propertyCategory, p.propertyID)}
            Icon={Eye}
            tooltipActive
            tooltip="View Details"
            classNameIconCustomize="size-6"
          />
        </div>
      ),
    },
  ];
}
