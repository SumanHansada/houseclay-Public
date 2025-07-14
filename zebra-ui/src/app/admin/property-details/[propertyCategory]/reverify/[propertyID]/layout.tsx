"use client";
import {
  useParams,
  useRouter,
  useSelectedLayoutSegment,
} from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ReverifyPropertyTabEnum } from "@/common/enums";
import AsyncFallback from "@/components/AsyncFallback";
import Tabs, { Tab, TabHeader } from "@/components/common/Tabs";
import { useGetPropertyByIdQuery } from "@/store/apiSlice";
import {
  selectFormData,
  setFulfilled,
  setPending,
  setRejected,
} from "@/store/propertyDetailsSlice";
import { ensureEnumValue } from "@/utils/core";
import { apiToForm } from "@/utils/transform/propertyToFormValues";

const tabs: { label: string; value: ReverifyPropertyTabEnum }[] = [
  { label: "Details", value: ReverifyPropertyTabEnum.DETAILS },
];

export default function ReverifyPropertyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { propertyID } = useParams() as {
    propertyID: string;
  };
  const router = useRouter();
  const currentTabFromUrl = useSelectedLayoutSegment();
  const dispatch = useDispatch();

  const {
    data: apiPropertyData,
    isLoading,
    isError,
    error,
  } = useGetPropertyByIdQuery({ propertyID: propertyID });

  useEffect(() => {
    if (isLoading) {
      dispatch(setPending());
    } else if (isError) {
      const errMsg =
        typeof error === "string" ? error : "Unknown error fetching property";
      dispatch(setRejected(errMsg));
    } else if (apiPropertyData) {
      const currentProperty = apiToForm(apiPropertyData);
      dispatch(setFulfilled(currentProperty));
    }
  }, [isLoading, isError, apiPropertyData, error, dispatch]);

  const currentProperty = useSelector(selectFormData);

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
  const { propertyCategory } = currentProperty;

  const activeTab = ensureEnumValue({
    enumObj: ReverifyPropertyTabEnum,
    value: currentTabFromUrl,
    fallback: ReverifyPropertyTabEnum.DETAILS,
  });

  const handleTabChange = (tab: string) => {
    router.push(
      `/admin/property-details/${propertyCategory}/reverify/${propertyID}/${tab}`,
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
