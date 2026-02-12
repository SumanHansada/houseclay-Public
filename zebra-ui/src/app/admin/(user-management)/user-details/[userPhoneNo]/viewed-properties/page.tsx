"use client";

import { Eye } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { PropertyInfo } from "@/interfaces/PropertyInfo";
import { useGetUserByPhoneNoQuery } from "@/store/apiSlice";
import { buildPropertyColumns } from "@/utils/buildPropertyColumns";

import { PaginatedPropertiesTable } from "../components/PaginatedPropertiesTable";

interface SerializedPropertyRow extends PropertyInfo {
  _serial: number;
}

const ViewedPropertiesPage: React.FC = () => {
  const router = useRouter();
  const { userPhoneNo } = useParams() as { userPhoneNo: string };
  const { data, isLoading } = useGetUserByPhoneNoQuery({
    phoneNo: userPhoneNo,
  });

  // parent layout already ensures data is present
  const { viewedProperties = [] } = data!.user;

  const rows: SerializedPropertyRow[] = viewedProperties.map(
    (propertyInfo, index) => ({
      ...propertyInfo,
      _serial: index + 1,
    }),
  );

  const handleView = (row: SerializedPropertyRow) => {
    router.push(
      `/admin/property-details/${row.propertyCategory.toLowerCase()}/${row.propertyID}`,
    );
  };

  const columns = buildPropertyColumns([
    {
      icon: Eye,
      tooltip: "View Property Details",
      onClick: handleView,
    },
  ]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <PaginatedPropertiesTable
        tableTitle="Viewed Properties"
        columns={columns}
        rows={rows}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ViewedPropertiesPage;
