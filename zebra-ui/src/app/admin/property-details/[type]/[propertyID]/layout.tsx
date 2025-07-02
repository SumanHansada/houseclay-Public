"use client";
import {
  useParams,
  useRouter,
  useSelectedLayoutSegment,
} from "next/navigation";

import { PropertyDetailsTabEnum } from "@/common/enum";
import Tabs, { Tab, TabHeader } from "@/components/common/Tabs";
import { ensureEnumValue } from "@/utils/enum";
import { useGetPropertyByIdQuery } from "@/store/apiSlice";
import AsyncFallback from "@/components/AsyncFallback";

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

  const activeTab = ensureEnumValue(
    PropertyDetailsTabEnum,
    currentTabFromUrl,
    PropertyDetailsTabEnum.DETAILS,
  );

  const handleTabChange = (tab: string) => {
    router.push(`/admin/property-details/${type}/${propertyID}/${tab}`);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <Tabs onTabChange={handleTabChange} defaultActive={activeTab}>
        <TabHeader>
          <Tab label="Details" value={PropertyDetailsTabEnum.DETAILS} />
          <Tab
            label="Owner Details"
            value={PropertyDetailsTabEnum.OWNER_DETAILS}
          />
          <Tab
            label="Shortlist Users"
            value={PropertyDetailsTabEnum.SHORTLIST}
          />
          <Tab label="Contact Users" value={PropertyDetailsTabEnum.CONTACT} />
          <Tab label="View Users" value={PropertyDetailsTabEnum.VIEW} />
          <Tab label="Report Users" value={PropertyDetailsTabEnum.REPORT} />
        </TabHeader>
      </Tabs>
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
