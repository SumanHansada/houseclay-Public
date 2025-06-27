"use client";
import { useParams, useRouter } from "next/navigation";

import { Column } from "@/components/DataTable";
import { PropertyInfo } from "@/interfaces/Property";
import { dummyReportProperties } from "@/mock/userDetailsDummy";
import { useGetUserByPhoneNoQuery } from "@/store/apiSlice";
import { createCommonColumns } from "@/utils/commonPropertyColumns";

import { PropertiesTableView } from "../../components/PropertiesTableView";

export interface PropertyRow extends PropertyInfo {
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
  const router = useRouter();
  const { userPhoneNo } = useParams() as { userPhoneNo: string };
  const { data } = useGetUserByPhoneNoQuery({ phoneNo: userPhoneNo });
  console.log(data!.user.reportProperties);

  // const { reportProperties } = data!.user;
  const reportProperties = dummyReportProperties;

  const viewPropertyDetails = (type: string, propertyID: string) => {
    router.push(`/admin/property-details/${type}/${propertyID}`);
  };

  const rows: PropertyRow[] = reportProperties.map(
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
