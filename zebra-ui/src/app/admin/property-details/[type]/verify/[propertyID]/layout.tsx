"use client";
import { useParams, usePathname, useRouter } from "next/navigation";

import { VerifyPropertyTabEnum } from "@/common/enums";
import Tabs, { Tab, TabHeader } from "@/components/common/Tabs";
// import { useGetUserByPhoneNoQuery } from "@/store/apiSlice";

export default function VerifyPropertyLayout({
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
    router.push(`/admin/property-details/${type}/verify/${propertyID}/${tab}`);
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
    VerifyPropertyTabEnum,
  ) as readonly string[];
  const isValidTab = (
    currentTab: string,
  ): currentTab is VerifyPropertyTabEnum => {
    return validTabValues.includes(currentTab);
  };

  const pathSegments = pathname.split("/");
  const currentTabFromUrl = pathSegments[pathSegments.length - 1];

  const activeTab: VerifyPropertyTabEnum = isValidTab(currentTabFromUrl)
    ? currentTabFromUrl
    : VerifyPropertyTabEnum.DETAILS;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <Tabs onTabChange={handleTabChange} defaultActive={activeTab}>
        <TabHeader>
          <Tab label="Details" value={VerifyPropertyTabEnum.DETAILS} />
        </TabHeader>
      </Tabs>
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
