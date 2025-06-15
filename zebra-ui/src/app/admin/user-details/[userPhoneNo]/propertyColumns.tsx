import { Column } from "@/components/DataTable";
import { UserPropertyInfo } from "@/interfaces/User";

import { RenderPropertyStatus } from "../components/RenderPropertyStatus";
import { TableCellActions } from "../components/TableCellActions";

type ViewDetailsFunction = (propertyID: string) => void;

export const createCommonColumns = (
  viewDetails: ViewDetailsFunction,
): Column<UserPropertyInfo & { _serial: number }>[] => [
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
