import { Column } from "@/components/DataTable";
import { PropertyInfo } from "@/interfaces/Property";

import { RenderPropertyStatus } from "../components/RenderPropertyStatus";
import { TableCellActions } from "../components/TableCellActions";

type ViewDetailsFunction = (propertyID: string) => void;

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
    key: "type",
    label: "Type",
    accessor: "type",
  },
  {
    key: "config",
    label: "Config",
    accessor: "config",
  },
  {
    key: "createdAt",
    label: "Last Modified",
    render: (p) =>
      p.lastModified
        ? new Date(p.lastModified).toLocaleString()
        : new Date(p.createdAt).toLocaleString(),
  },
  {
    key: "availableFrom",
    label: "Available From",
    render: (p) => new Date(p.availableFrom).toLocaleString(),
  },
  {
    key: "status",
    label: "Status",
    render: (p) => <RenderPropertyStatus status={p.status} />,
  },
  {
    key: "action",
    label: "Action",
    render: (p) => (
      <TableCellActions viewDetails={() => viewDetails(p.propertyID)} />
    ),
  },
];
