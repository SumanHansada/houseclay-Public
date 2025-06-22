"use client";
import { useParams, usePathname, useRouter } from "next/navigation";

import { PropertyDetailsTabEnum } from "@/common/enums";
import Tabs, { Tab, TabHeader } from "@/components/common/Tabs";
// import { useGetUserByPhoneNoQuery } from "@/store/apiSlice";

export default function PropertyDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { type, propertyID } = useParams() as {
    type: string;
    propertyID: string;
  };
  const router = useRouter();
  const pathname = usePathname();

  //   const { data, isLoading, isError } = useGetUserByPhoneNoQuery(
  //     { phoneNo: userPhoneNo },
  //     { skip: !userPhoneNo },
  //   );

  const handleTabChange = (tab: string) => {
    router.push(`/admin/property-details/${type}/${propertyID}/${tab}`);
  };

  //   if (isLoading || !data) {
  //     return (
  //       <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
  //         <span className="text-gray-500">Loading user details…</span>
  //       </div>
  //     );
  //   }

  //   if (isError) {
  //     return (
  //       <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
  //         <span className="text-red-500">Failed to fetch user details.</span>
  //       </div>
  //     );
  //   }

  const validTabValues = Object.values(
    PropertyDetailsTabEnum,
  ) as readonly string[];
  const isValidTab = (
    currentTab: string,
  ): currentTab is PropertyDetailsTabEnum => {
    return validTabValues.includes(currentTab);
  };

  const pathSegments = pathname.split("/");
  const currentTabFromUrl = pathSegments[pathSegments.length - 1];

  const activeTab: PropertyDetailsTabEnum = isValidTab(currentTabFromUrl)
    ? currentTabFromUrl
    : PropertyDetailsTabEnum.DETAILS;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <Tabs onTabChange={handleTabChange} defaultActive={activeTab}>
        <TabHeader>
          <Tab label="Details" value={PropertyDetailsTabEnum.DETAILS} />
          <Tab
            label="Owner Details"
            value={PropertyDetailsTabEnum.OWNER_DETAILS}
          />
          <Tab label="Shortlisted" value={PropertyDetailsTabEnum.SHORTLISTED} />
          <Tab label="Contacted" value={PropertyDetailsTabEnum.CONTACTED} />
          <Tab label="Viewed" value={PropertyDetailsTabEnum.VIEWED} />
        </TabHeader>
      </Tabs>
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
