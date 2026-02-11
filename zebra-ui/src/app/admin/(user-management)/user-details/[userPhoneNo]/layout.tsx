"use client";

import {
  useParams,
  useRouter,
  useSelectedLayoutSegment,
} from "next/navigation";

import { userDetailsTabs } from "@/common/constants/user";
import { UserDetailsTabEnum } from "@/common/enums";
import AsyncFallback from "@/components/AsyncFallback";
import { useGetUserByPhoneNoQuery } from "@/store/apiSlice";
// import { userDetailsTestIds } from "@/utils/testIds";
import { Tab, TabHeader, Tabs } from "@/utility-components";
import { ensureEnumValue } from "@/utils/core";

export default function UserDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userPhoneNo } = useParams() as { userPhoneNo: string };
  const router = useRouter();
  const currentTabFromUrl = useSelectedLayoutSegment();

  const {
    data: currentUser,
    isLoading,
    isError,
    error,
  } = useGetUserByPhoneNoQuery(
    { phoneNo: userPhoneNo },
    { skip: !userPhoneNo },
  );
  console.log("currentUser: ", currentUser);

  if (isLoading || isError || !currentUser) {
    return (
      <AsyncFallback
        isLoading={isLoading}
        isError={isError || !currentUser}
        error={error}
        loadingMessage="Loading user details…"
        errorMessage="Failed to fetch user."
      />
    );
  }

  const activeTab = ensureEnumValue({
    enumObj: UserDetailsTabEnum,
    value: currentTabFromUrl,
    fallback: UserDetailsTabEnum.PROFILE,
  });

  const handleTabChange = (value: string) => {
    router.push(`/admin/user-details/${userPhoneNo}/${value}`);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Tabs onTabChange={handleTabChange} defaultActive={activeTab}>
        <TabHeader
          containerClassName="border-b border-gray-200"
          tabsClassName="flex w-full"
        >
          {userDetailsTabs.map((tab) => (
            <Tab
              key={tab.value}
              label={tab.label}
              value={tab.value}
              containerClassName="w-full py-3 font-medium"
              activeClassName="text-red-500 border-b-2 border-red-500"
              inactiveClassName="text-gray-500 hover:text-gray-700"
              // testId={userDetailsTestIds.getTabButtonId(tab.value)}
            />
          ))}
        </TabHeader>
      </Tabs>
      <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
    </div>
  );
}
