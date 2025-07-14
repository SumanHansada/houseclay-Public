"use client";
import { useParams, useRouter } from "next/navigation";

import { Column } from "@/components/DataTable";
import { PropertyInfo } from "@/interfaces/Property";
import { useGetUserByPhoneNoQuery } from "@/store/apiSlice";
import {
  buildPropertyColumns,
  createDefaultPropertyActions,
} from "@/utils/table/buildPropertyColumns";

import { PropertiesTableView } from "../../components/PropertiesTableView";

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

const ReportedPropertiesPage: React.FC = () => {
  const router = useRouter();
  const { userPhoneNo } = useParams() as { userPhoneNo: string };
  const { data } = useGetUserByPhoneNoQuery({ phoneNo: userPhoneNo });

  const { reportProperties } = data!.user;

  const rows: CustomizedPropertyRow[] = reportProperties.map(
    (reportPropertyInfo, index) => ({
      _serial: index + 1,
      ...reportPropertyInfo.userProperty,
      reportType: reportPropertyInfo.reportType,
      reportTime: reportPropertyInfo.reportTime,
    }),
  );

  const viewPropertyDetails = (
    propertyCategory: string,
    propertyID: string,
  ) => {
    router.push(
      `/admin/property-details/${propertyCategory.toLowerCase()}/${propertyID}`,
    );
  };

  const commonColumns = buildPropertyColumns(
    createDefaultPropertyActions({
      onView: (row) =>
        viewPropertyDetails(row.propertyCategory, row.propertyID),
    }),
  );

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
