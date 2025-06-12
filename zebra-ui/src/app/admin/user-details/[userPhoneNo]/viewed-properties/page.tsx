"use client";

import { useParams, useRouter } from "next/navigation";

import { Column } from "@/components/DataTable";
import { PropertyInfo } from "@/interfaces/Property";
import { dummyProperties } from "@/mock/userDetailsDummy";
import { useGetUserByPhoneNoQuery } from "@/store/apiSlice";

import { PropertiesTableView } from "../../components/PropertiesTableView";
import { createCommonColumns } from "../propertyColumns";

interface PropertyRow extends PropertyInfo {
  _serial: number;
}

const ViewedPropertiesPage: React.FC = () => {
  const router = useRouter();
  const { userPhoneNo } = useParams() as { userPhoneNo: string };
  const { data } = useGetUserByPhoneNoQuery({ phoneNo: userPhoneNo });
  console.log(data!.user.viewedProperties);

  // const { viewedProperties } = data!.user;
  const viewedProperties = dummyProperties;

  const viewPropertyDetails = (propertyID: string) => {
    router.push(`/admin/property-details/${propertyID}`);
  };

  const rows: PropertyRow[] = viewedProperties.map((propertyInfo, index) => ({
    ...propertyInfo,
    _serial: index + 1,
  }));

  const columns: Column<PropertyRow>[] =
    createCommonColumns(viewPropertyDetails);

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
