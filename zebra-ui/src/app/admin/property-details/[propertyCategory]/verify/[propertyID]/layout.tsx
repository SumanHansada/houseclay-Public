"use client";
import {
  useParams,
  useRouter,
  useSelectedLayoutSegment,
} from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { VerifyPropertyTabEnum } from "@/common/enums";
import AsyncFallback from "@/components/AsyncFallback";
import Tabs, { Tab, TabHeader } from "@/components/common/Tabs";
import { useGetPropertyByIdQuery } from "@/store/apiSlice";
import {
  setFulfilled,
  setPending,
  setRejected,
} from "@/store/propertyDetailsSlice";
import { ensureEnumValue } from "@/utils/enum";

const tabs: { label: string; value: VerifyPropertyTabEnum }[] = [
  { label: "Details", value: VerifyPropertyTabEnum.DETAILS },
];

export default function VerifyPropertyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { propertyCategory, propertyID } = useParams() as {
    propertyCategory: string;
    propertyID: string;
  };
  const router = useRouter();
  const currentTabFromUrl = useSelectedLayoutSegment();
  const dispatch = useDispatch();

  const {
    data: currentProperty,
    isLoading,
    isError,
    error,
  } = useGetPropertyByIdQuery({ id: propertyID });

  useEffect(() => {
    if (isLoading) {
      dispatch(setPending());
    } else if (isError) {
      const errMsg =
        typeof error === "string" ? error : "Unknown error fetching property";
      dispatch(setRejected(errMsg));
    } else if (currentProperty) {
      dispatch(setFulfilled(currentProperty));
    }
  }, [isLoading, isError, currentProperty, error, dispatch]);

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
  console.log(currentProperty);

  const activeTab = ensureEnumValue({
    enumObj: VerifyPropertyTabEnum,
    value: currentTabFromUrl,
    fallback: VerifyPropertyTabEnum.DETAILS,
  });

  const handleTabChange = (tab: string) => {
    router.push(
      `/admin/property-details/${propertyCategory}/verify/${propertyID}/${tab}`,
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
