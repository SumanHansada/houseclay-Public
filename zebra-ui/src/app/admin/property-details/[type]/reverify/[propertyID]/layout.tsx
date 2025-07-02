"use client";
import {
  useParams,
  useRouter,
  useSelectedLayoutSegment,
} from "next/navigation";

import { ReverifyPropertyTabEnum } from "@/common/enum";
import Tabs, { Tab, TabHeader } from "@/components/common/Tabs";
import { ensureEnumValue } from "@/utils/enum";
import { useGetPropertyByIdQuery } from "@/store/apiSlice";
import AsyncFallback from "@/components/AsyncFallback";

const tabs: { label: string; value: ReverifyPropertyTabEnum }[] = [
  { label: "Details", value: ReverifyPropertyTabEnum.DETAILS },
];

export default function ReverifyPropertyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { type, propertyID } = useParams() as {
    type: string;
    propertyID: string;
  };
  const router = useRouter();
  const currentTabFromUrl = useSelectedLayoutSegment();

  const {
    data: currentProperty,
    isLoading,
    isError,
    error,
  } = useGetPropertyByIdQuery({ id: propertyID });

  if (isLoading || isError || !currentProperty) {
    return (
      <AsyncFallback
        isLoading={isLoading}
        isError={isError || !currentProperty}
        error={error}
        loadingMessage="Loading property details…"
        errorMessage="Failed to fetch property."
      />
    );
  }

  const activeTab = ensureEnumValue({
    enumObj: ReverifyPropertyTabEnum,
    value: currentTabFromUrl,
    fallback: ReverifyPropertyTabEnum.DETAILS,
  });

  const handleTabChange = (tab: string) => {
    router.push(
      `/admin/property-details/${type}/reverify/${propertyID}/${tab}`,
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Using Tabs - for future scaling */}
      <Tabs onTabChange={handleTabChange} defaultActive={activeTab}>
        <TabHeader>
          {tabs.map((tab) => (
            <Tab key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </TabHeader>
      </Tabs>
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
