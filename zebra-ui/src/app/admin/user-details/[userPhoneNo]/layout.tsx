"use client";
import { useParams, usePathname, useRouter } from "next/navigation";

import { UserDetailsTabEnum } from "@/common/enums";
import Tabs, { Tab, TabHeader } from "@/components/common/Tabs";
import { useGetUserByPhoneNoQuery } from "@/store/apiSlice";

export default function UserDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userPhoneNo } = useParams() as { userPhoneNo: string };
  const router = useRouter();
  const pathname = usePathname();

  const { data, isLoading, isError } = useGetUserByPhoneNoQuery(
    { phoneNo: userPhoneNo },
    { skip: !userPhoneNo },
  );

  const handleTabChange = (value: string) => {
    router.push(`/admin/user-details/${userPhoneNo}/${value}`);
  };

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <span className="text-gray-500">Loading user details…</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <span className="text-red-500">Failed to fetch user details.</span>
      </div>
    );
  }

  const validTabValues = Object.values(UserDetailsTabEnum) as readonly string[];
  const isValidTab = (currentTab: string): currentTab is UserDetailsTabEnum => {
    return validTabValues.includes(currentTab);
  };

  const pathSegments = pathname.split("/");
  const currentTabFromUrl = pathSegments[pathSegments.length - 1];

  const activeTab: UserDetailsTabEnum = isValidTab(currentTabFromUrl)
    ? currentTabFromUrl
    : UserDetailsTabEnum.PROFILE;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <Tabs onTabChange={handleTabChange} defaultActive={activeTab}>
        <TabHeader>
          <Tab label="Profile" value={UserDetailsTabEnum.PROFILE} />
          <Tab label="Listed Properties" value={UserDetailsTabEnum.LISTED} />
          <Tab label="Shortlisted" value={UserDetailsTabEnum.SHORTLISTED} />
          <Tab label="Connect History" value={UserDetailsTabEnum.CONNECT} />
          <Tab label="Payment History" value={UserDetailsTabEnum.PAYMENT} />
          <Tab label="Contacted" value={UserDetailsTabEnum.CONTACTED} />
          <Tab label="Viewed" value={UserDetailsTabEnum.VIEWED} />
          <Tab label="Reported" value={UserDetailsTabEnum.REPORT} />
        </TabHeader>
      </Tabs>
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
