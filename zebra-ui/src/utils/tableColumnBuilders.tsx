import { LucideIcon } from "lucide-react";

import { Column } from "@/components/DataTable";
import IconButtonWithTooltip from "@/components/IconButtonWithTooltip";
import { Pill } from "@/components/Pill";
import { RenderPropertyStatus } from "@/components/status/RenderPropertyStatus";
import { PropertyInfo } from "@/interfaces/PropertyInfo";
import { UserInfo } from "@/interfaces/User";
import { Popover } from "@/utility-components";

import { formatDateVerbose } from "./core";

// ─────────────────────────────────────────────────────────────
// USER COLUMNS
// ─────────────────────────────────────────────────────────────

export interface SerializedUserRow extends UserInfo {
  _serial: number;
}

export interface UserActionConfig {
  icon: LucideIcon;
  tooltip: string;
  onClick: (row: SerializedUserRow) => void;
}

/**
 * buildUserColumns
 * ----------------
 * Returns the standard user-table columns (Serial, Name, Email, Phone, Status)
 * plus a dynamic "Action" column based on the provided configuration.
 *
 * @param actions - An array of action objects (icon + handler).
 * The order in the array determines the render order.
 */
export function buildUserColumns(
  actions: UserActionConfig[] = [],
): Column<SerializedUserRow>[] {
  return [
    { key: "_serial", label: "#", accessor: "_serial", className: "w-16" },
    { key: "name", label: "Name", accessor: "name" },
    { key: "email", label: "Email", accessor: "email" },
    { key: "phoneNo", label: "Phone No.", accessor: "phoneNo" },
    {
      key: "blacklisted",
      label: "Status",
      render: (user) =>
        user.blacklisted ? (
          <Pill color="red">Blacklisted</Pill>
        ) : (
          <Pill color="green">Active</Pill>
        ),
    },
    {
      key: "action",
      label: "Action",
      className: "w-24",
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

// ─────────────────────────────────────────────────────────────
// PROPERTY COLUMNS
// ─────────────────────────────────────────────────────────────

export interface SerializedPropertyRow extends PropertyInfo {
  _serial: number;
}

export interface PropertyActionConfig {
  icon: LucideIcon;
  tooltip: string;
  onClick: (row: SerializedPropertyRow) => void;
  show?: (row: SerializedPropertyRow) => boolean;
}

/**
 * buildPropertyColumns
 * --------------------
 * Returns the common property-table columns plus an "Action" column.
 *
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
      render: (p) => {
        const location = p.location || "—";

        return (
          <Popover
            id={`popover-property-location-${p.propertyID}`}
            trigger="hover"
            content={
              <div className="p-3 max-w-xs md:max-w-sm text-sm text-gray-700 font-medium break-words">
                {location}
              </div>
            }
          >
            <div className="max-w-[150px] md:max-w-[200px] xl:max-w-[250px] truncate cursor-help">
              {location}
            </div>
          </Popover>
        );
      },
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

        const visibleActions = actions.filter(
          (action) => !action.show || action.show(row),
        );
        if (!visibleActions.length) return null;

        return (
          <div className="flex items-center gap-2">
            {visibleActions.map((action, index) => (
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
