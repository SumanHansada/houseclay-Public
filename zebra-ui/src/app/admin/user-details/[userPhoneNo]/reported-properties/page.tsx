"use client";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import { Column } from "@/components/DataTable";
import { UserPropertyInfo } from "@/interfaces/User";
import { dummyReportProperties } from "@/mock/userDetailsDummy";
import { RootState } from "@/store/store";

import { PropertiesTableView } from "../../components/PropertiesTableView";
import { createCommonColumns } from "../propertyColumns";

export interface PropertyRow extends UserPropertyInfo {
  _serial: number;
  reportType: string;
  reportTime: string;
}

const extraCols: Column<PropertyRow>[] = [
  {
    key: "reportType",
    label: "Report Type",
    accessor: "reportType",
  },
  {
    key: "reportTime",
    label: "Report Time",
    accessor: "reportTime",
    render: (row) => new Date(row.reportTime).toLocaleString(),
  },
];

const ReportedPropertiesPage: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const router = useRouter();
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <span className="text-gray-500">Loading user details…</span>
      </div>
    );
  }
  const { reportProperties } = currentUser;
  console.log(reportProperties);

  const viewPropertyDetails = (propertyID: string) => {
    router.push(`/admin/property-details/${propertyID}`);
  };

  const rows: PropertyRow[] = dummyReportProperties.map(
    // const rows: PropertyRow[] = reportProperties.map(
    (reportPropertyInfo, index) => ({
      _serial: index + 1,
      ...reportPropertyInfo.userProperty,
      reportType: reportPropertyInfo.reportType,
      reportTime: reportPropertyInfo.reportTime,
    }),
  );

  const commonColumns: Column<PropertyRow>[] =
    createCommonColumns(viewPropertyDetails);

  const actionIdx = commonColumns.findIndex((col) => col.key === "status");

  const columns = [
    ...commonColumns.slice(0, actionIdx),
    ...extraCols,
    ...commonColumns.slice(actionIdx),
  ];

  return (
    <div className="h-full">
      <PropertiesTableView
        tableTitle="Reported Properties"
        columns={columns}
        rows={rows}
      />
    </div>
  );
};

export default ReportedPropertiesPage;
