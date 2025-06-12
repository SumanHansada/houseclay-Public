"use client";
import { useParams, useRouter } from "next/navigation";

import { Column } from "@/components/DataTable";
import { PropertyInfo } from "@/interfaces/Property";
import { dummyProperties } from "@/mock/userDetailsDummy";

import { PropertiesTableView } from "../../components/PropertiesTableView";
import { createCommonColumns } from "../propertyColumns";
import { useGetUserByPhoneNoQuery } from "@/store/apiSlice";

interface PropertyRow extends PropertyInfo {
  _serial: number;
}

const ListedPropertiesPage: React.FC = () => {
  const { userPhoneNo } = useParams() as { userPhoneNo: string };
  const router = useRouter();
  const { data } = useGetUserByPhoneNoQuery({ phoneNo: userPhoneNo });
  console.log(data!.user.ownedProperties);

  // const { ownedProperties }: { ownedProperties: PropertyInfo[] } = data!.user;
  const ownedProperties: PropertyInfo[] = dummyProperties;

  const viewPropertyDetails = (propertyID: string) => {
    router.push(`/admin/property-details/${propertyID}`);
  };

  const rows: PropertyRow[] = ownedProperties.map((propertyInfo, index) => ({
    ...propertyInfo,
    _serial: index + 1,
  }));

  const columns: Column<PropertyRow>[] =
    createCommonColumns(viewPropertyDetails);

  return (
    <div className="h-full">
      <PropertiesTableView
        tableTitle="Owned Properties"
        columns={columns}
        rows={rows}
      />
    </div>
  );
};

export default ListedPropertiesPage;
