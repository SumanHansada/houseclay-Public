/*
 * Usage
 * -----
 * 1.  Standard Edit + View buttons
 *     --------------------------------------------------------------
 *     const columns = buildPropertyColumns(
 *      createDefaultPropertyActions({
 *        onEdit: (row) =>
 *         console.log("Edit", row.propertyID),
 *        onView: (row) =>
 *          router.push(
 *            `/admin/property-details/${row.propertyCategory}/${row.propertyID}`,
 *          ),
 *      }),
 *    );
 *
 *
 * 2.  Custom buttons (e.g. Verify, Delete)
 *     --------------------------------------------------------------
 *     const columns = buildPropertyColumns({
 *       verify: {
 *         icon: ShieldCheck,
 *         tooltip: "Verify Listing",
 *         onClick: (row) => openVerificationPanel(row.propertyID),
 *         classNameIcon: "size-5 text-primary",
 *       },
 *       delete: { ... },
 *     });
 *
 */
import { Eye, LucideIcon, Pencil } from "lucide-react";

import { Column } from "@/components/DataTable";
import IconButtonWithTooltip from "@/components/IconButtonWithTooltip";
import { RenderPropertyStatus } from "@/components/status/RenderPropertyStatus";
import { PropertyInfo } from "@/interfaces/PropertyInfo";

import { formatDateVerbose } from "../core";

export interface SerializedPropertyRow extends PropertyInfo {
  _serial: number;
}

export interface ActionConfig {
  icon: LucideIcon;
  tooltip: string;
  onClick: (row: SerializedPropertyRow) => void;
  classNameIcon?: string;
}

export type ActionMap = Record<string, ActionConfig>;

/**
 * buildPropertyColumns
 * ----------
 * Returns the common property‑table columns plus an “Action” column. 

 * **Notes**(in case of custom actions)  
 *  The **insertion order** of keys in the map = render order of buttons.  
 *  If you pass an **empty object**, you still get the Action column—it will just be blank.
 */
export function buildPropertyColumns(
  actions: ActionMap,
): Column<SerializedPropertyRow>[] {
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
      render: (row) => (
        <div className="flex items-center gap-3">
          {Object.values(actions).map(
            ({ icon: Icon, tooltip, onClick, classNameIcon }, i) => (
              <IconButtonWithTooltip
                key={i}
                Icon={Icon}
                tooltipActive
                tooltip={tooltip}
                onClick={() => onClick(row)}
                classNameIconCustomize={classNameIcon}
              />
            ),
          )}
        </div>
      ),
    },
  ];
}

interface DefaultActionOpts {
  onView: (row: SerializedPropertyRow) => void;
  onEdit?: (row: SerializedPropertyRow) => void;
}

/**
 * createDefaultPropertyActions
 * ----------------------------
 * Convenience helper that returns the usual Edit + View button map.
 *
 *   const actions = createDefaultPropertyActions({
 *     onView: (row) => router.push(`/admin/${row.propertyID}`),
 *     onEdit: (row) => openEditDialog(row.propertyID),   // optional
 *   });
 */
export function createDefaultPropertyActions({
  onView,
  onEdit = (row) => console.log("Edit: ", row.propertyID),
}: DefaultActionOpts): ActionMap {
  return {
    edit: {
      icon: Pencil,
      tooltip: "Edit Property",
      onClick: onEdit,
      classNameIcon: "size-5",
    },
    view: {
      icon: Eye,
      tooltip: "View Details",
      onClick: onView,
      classNameIcon: "size-6",
    },
  };
}
