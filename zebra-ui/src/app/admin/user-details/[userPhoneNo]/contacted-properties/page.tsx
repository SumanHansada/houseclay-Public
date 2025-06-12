"use client";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import { Column } from "@/components/DataTable";
import { UserPropertyInfo } from "@/interfaces/User";
import { dummyProperties } from "@/mock/userDetailsDummy";
import { RootState } from "@/store/store";

import { PropertiesTableView } from "../../components/PropertiesTableView";
import { createCommonColumns } from "../propertyColumns";

interface PropertyRow extends UserPropertyInfo {
  _serial: number;
}
const ContactedPropertiesPage: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const router = useRouter();
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <span className="text-gray-500">Loading user details…</span>
      </div>
    );
  }
  const { contactedProperties } = currentUser;
  console.log(contactedProperties);

  const viewPropertyDetails = (propertyID: string) => {
    router.push(`/admin/property-details/${propertyID}`);
  };

  const rows: PropertyRow[] = dummyProperties.map((propertyInfo, index) => ({
    // const rows: PropertyRow[] = contactedProperties.map((propertyInfo, index) => ({
    ...propertyInfo,
    _serial: index + 1,
  }));

  const columns: Column<PropertyRow>[] =
    createCommonColumns(viewPropertyDetails);

  return (
    <div className="h-full">
      <PropertiesTableView
        tableTitle="Contacted Properties"
        columns={columns}
        rows={rows}
      />
    </div>
  );
};

export default ContactedPropertiesPage;
