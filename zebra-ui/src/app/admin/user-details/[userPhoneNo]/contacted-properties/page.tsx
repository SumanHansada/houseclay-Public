"use client";

import { dummyProperties } from "@/mock/dummyData";
import { PropertiesTableView } from "../../components/PropertiesTableView";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { createCommonColumns } from "../propertyColumns";
import { UserPropertyInfo } from "@/interfaces/User";
import { Column } from "@/components/DataTable";
import { useRouter } from "next/navigation";

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
  // const { contactedProperties } = currentUser;

  const viewPropertyDetails = (propertyID: string) => {
    router.push(`/admin/property-details/${propertyID}`);
  };

  // const rows: PropertyRow[] = contactedProperties.map((propertyInfo, index) => ({
  const rows: PropertyRow[] = dummyProperties.map((propertyInfo, index) => ({
    ...propertyInfo,
    _serial: index + 1,
  }));

  const columns: Column<PropertyRow>[] =
    createCommonColumns(viewPropertyDetails);

  return (
    <div className="h-full">
      <PropertiesTableView
        tableTitle="User Contacted Properties"
        columns={columns}
        rows={rows}
      />
    </div>
  );
};

export default ContactedPropertiesPage;
