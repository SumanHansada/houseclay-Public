"use client";

import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";

import { Column } from "@/components/DataTable";
import { LocalPaginatedTable } from "@/components/LocalPaginatedTable";
import { PropertyInfo } from "@/interfaces/PropertyInfo";
import { useGetUserByPhoneNoQuery } from "@/store/apiSlice";
import { buildPropertyColumns } from "@/utils/tableColumnBuilders";

export interface SerializedPropertyRow extends PropertyInfo {
  _serial: number;
}

export interface CustomizedPropertyRow extends SerializedPropertyRow {
  reportType: string;
  reportTime: string;
}

const extraCols: Column<CustomizedPropertyRow>[] = [
  {
    key: "reportType",
    label: "Report Type",
    accessor: "reportType",
  },
  {
    key: "reportTime",
    label: "Report Time",
    accessor: "reportTime",
    render: (row) => new Date(row.reportTime).toLocaleString("en-IN"),
  },
];

export const ReportedPropertiesView = ({
  userPhoneNo,
}: {
  userPhoneNo: string;
}) => {
  const router = useRouter();
  const { data, isLoading } = useGetUserByPhoneNoQuery({
    phoneNo: userPhoneNo,
  });

  // parent layout already ensures data is present
  if (!data?.user) return null;
  const { reportProperties = [] } = data.user;

  const rows: CustomizedPropertyRow[] = reportProperties.map(
    (reportPropertyInfo, index) => ({
      _serial: index + 1,
      ...reportPropertyInfo.userProperty,
      reportType: reportPropertyInfo.reportType,
      reportTime: reportPropertyInfo.reportTime,
    }),
  );

  const handleView = (row: SerializedPropertyRow) => {
    router.push(`/admin/properties/${row.propertyID}`);
  };

  const commonColumns = buildPropertyColumns([
    {
      icon: Eye,
      tooltip: "View Property Details",
      onClick: handleView,
    },
  ]);

  const actionIdx = commonColumns.findIndex((col) => col.key === "status");

  const columns = [
    ...commonColumns.slice(0, actionIdx),
    ...extraCols,
    ...commonColumns.slice(actionIdx),
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <LocalPaginatedTable
        tableTitle="Reported Properties"
        columns={columns}
        rows={rows}
        getRowId={(row) => row.propertyID}
        noDataMessage="No reported properties found."
        isLoading={isLoading}
      />
    </div>
  );
};
