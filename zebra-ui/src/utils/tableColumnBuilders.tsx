import { LucideIcon } from "lucide-react";

import { CorporateDomainStatus } from "@/common/enums";
import { Column } from "@/components/DataTable";
import IconButtonWithTooltip from "@/components/IconButtonWithTooltip";
import { Pill } from "@/components/Pill";
import { RenderPropertyStatus } from "@/components/status/RenderPropertyStatus";
import { CorporateDomain } from "@/interfaces/api";
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

// ─────────────────────────────────────────────────────────────
// CORPORATE DOMAIN COLUMNS
// ─────────────────────────────────────────────────────────────

export interface SerializedCorporateDomainRow extends CorporateDomain {
  _serial: number;
}

export interface CorporateDomainActionConfig {
  icon: LucideIcon;
  tooltip: string;
  onClick: (row: SerializedCorporateDomainRow) => void;
  show?: (row: SerializedCorporateDomainRow) => boolean;
}

/**
 * buildCorporateDomainColumns
 * ---------------------------
 * Returns the column configuration for the Corporate Domains table.
 * Extracts the layout logic to maintain consistency with User and Property tables.
 *
 * @param actions - An array of action objects (icon + handler) for the Action column.
 * The order in the array determines the render order.
 */
export function buildCorporateDomainColumns(
  actions: CorporateDomainActionConfig[] = [],
): Column<SerializedCorporateDomainRow>[] {
  return [
    {
      key: "serial",
      label: "#",
      accessor: "_serial",
      className: "w-16",
    },
    {
      key: "domainName",
      label: "Domain Name",
      accessor: "domainName",
    },
    {
      key: "websiteTitle",
      label: "Website Title",
      render: (d) => {
        const title = d.websiteTitle || "—";

        return (
          <Popover
            id={`popover-domain-title-${d.id}`}
            trigger="hover"
            // The content panel with some basic padding and max-width so very long titles wrap nicely
            content={
              <div className="p-3 max-w-xs md:max-w-sm text-sm text-gray-700 font-medium break-words">
                {title}
              </div>
            }
          >
            {/* The truncate class requires a width constraint (like max-w) to trigger the ellipsis (...) */}
            <div className="max-w-[150px] md:max-w-[200px] xl:max-w-[250px] truncate cursor-help">
              {title}
            </div>
          </Popover>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      render: (d) => {
        let color: "green" | "red" | "yellow" = "yellow";
        if (d.status === CorporateDomainStatus.ALLOWED) color = "green";
        if (d.status === CorporateDomainStatus.DENIED) color = "red";
        return <Pill color={color}>{d.status}</Pill>;
      },
    },
    {
      key: "updatedAt",
      label: "Last Updated",
      render: (d) => new Date(d.updatedAt).toLocaleString("en-IN"),
    },
    {
      key: "action",
      label: "Action",
      className: "w-24",
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
