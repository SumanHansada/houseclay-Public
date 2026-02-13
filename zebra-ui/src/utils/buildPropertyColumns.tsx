import { LucideIcon } from "lucide-react";

import { Column } from "@/components/DataTable";
import IconButtonWithTooltip from "@/components/IconButtonWithTooltip";
import { RenderPropertyStatus } from "@/components/status/RenderPropertyStatus";
import { PropertyInfo } from "@/interfaces/PropertyInfo";

import { formatDateVerbose } from "./core";

export interface SerializedPropertyRow extends PropertyInfo {
  _serial: number;
}

export interface PropertyActionConfig {
  icon: LucideIcon;
  tooltip: string;
  onClick: (row: SerializedPropertyRow) => void;
}

/**
 * buildPropertyColumns
 * ----------
 * Returns the common property‑table columns plus an “Action” column. 

 * @param actions - An array of action objects. 
 * The order in the array determines the render order.
 */
export function buildPropertyColumns(
  actions: PropertyActionConfig[] = [],
): Column<SerializedPropertyRow>[] {
  return [
    {
      key: "serial",
      label: "#",
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
      render: (p) =>
        new Date(p.updatedOn || p.createdOn).toLocaleString("en-IN"),
    },
    {
      key: "availableFrom",
      label: "Available From",
      render: (p) => formatDateVerbose(p.availableFrom, "en-IN"),
    },
    {
      key: "status",
      label: "Status",
      render: (p) => <RenderPropertyStatus status={p.propertyState} />,
    },
    {
      key: "action",
      label: "Action",
      render: (row) => {
        if (!actions.length) return null;
        return (
          <div className="flex items-center gap-2">
            {actions.map((action, index) => (
              <IconButtonWithTooltip
                key={`${action.tooltip}-${index}`}
                icon={action.icon}
                tooltip={action.tooltip}
                onClick={() => action.onClick(row)}
              />
            ))}
          </div>
        );
      },
    },
  ];
}
