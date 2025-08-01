"use client";
import {
  useParams,
  useRouter,
  useSelectedLayoutSegment,
} from "next/navigation";

import { UserDetailsTabEnum } from "@/common/enums";
import AsyncFallback from "@/components/AsyncFallback";
import Tabs, { Tab, TabHeader } from "@/components/common/Tabs";
import { useGetUserByPhoneNoQuery } from "@/store/apiSlice";
import { ensureEnumValue } from "@/utils/core";
import { userDetailsTabs } from "@/common/constants/user";
import { userDetailsTestIds } from "@/utils/testIds";

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
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <Tabs onTabChange={handleTabChange} defaultActive={activeTab}>
        <TabHeader>
          {userDetailsTabs.map((tab) => (
            <Tab
              key={tab.value}
              label={tab.label}
              value={tab.value}
              testId={userDetailsTestIds.getTabButtonId(tab.value)}
            />
          ))}
        </TabHeader>
      </Tabs>
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
