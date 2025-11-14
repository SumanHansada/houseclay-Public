"use client";

import { useParams, useRouter } from "next/navigation";

import { PropertyInfo } from "@/interfaces/PropertyInfo";
import { useGetUserByPhoneNoQuery } from "@/store/apiSlice";
import {
  buildPropertyColumns,
  createDefaultPropertyActions,
} from "@/utils/table/buildPropertyColumns";

import { PropertiesTableView } from "../../components/PropertiesTableView";

interface SerializedPropertyRow extends PropertyInfo {
  _serial: number;
}

const ViewedPropertiesPage: React.FC = () => {
  const router = useRouter();
  const { userPhoneNo } = useParams() as { userPhoneNo: string };
  const { data } = useGetUserByPhoneNoQuery({ phoneNo: userPhoneNo });

  const { viewedProperties } = data!.user;

  const rows: SerializedPropertyRow[] = viewedProperties.map(
    (propertyInfo, index) => ({
      ...propertyInfo,
      _serial: index + 1,
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

  const columns = buildPropertyColumns(
    createDefaultPropertyActions({
      onView: (row) =>
        viewPropertyDetails(row.propertyCategory, row.propertyID),
    }),
  );

  return (
    <div className="h-full">
      <PropertiesTableView
        tableTitle="Viewed Properties"
        columns={columns}
        rows={rows}
      />
    </div>
  );
};

export default ViewedPropertiesPage;
