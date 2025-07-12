"use client";
import {
  useParams,
  useRouter,
  useSelectedLayoutSegment,
} from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { VerifyPropertyTabEnum } from "@/common/enums";
import AsyncFallback from "@/components/AsyncFallback";
import Tabs, { Tab, TabHeader } from "@/components/common/Tabs";
import { useGetPropertyByIdQuery } from "@/store/apiSlice";
import {
  setFulfilled,
  setPending,
  setPropertyCategory,
  setRejected,
} from "@/store/propertyDetailsSlice";
import { ensureEnumValue } from "@/utils/core";
import { RootState } from "@/store/store";

const tabs: { label: string; value: VerifyPropertyTabEnum }[] = [
  { label: "Details", value: VerifyPropertyTabEnum.DETAILS },
];

export default function VerifyPropertyLayout({
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
    data: currentProperty,
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
    } else if (currentProperty) {
      dispatch(setFulfilled(currentProperty));
      dispatch(setPropertyCategory(currentProperty.propertyCategory));
    }
  }, [isLoading, isError, currentProperty, error, dispatch]);

  const { propertyCategory } = useSelector(
    (state: RootState) => state.propertyDetails,
  );

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
  console.log("property-details/verify: currentProperty", currentProperty);

  const activeTab = ensureEnumValue({
    enumObj: VerifyPropertyTabEnum,
    value: currentTabFromUrl,
    fallback: VerifyPropertyTabEnum.DETAILS,
  });

  const handleTabChange = (tab: string) => {
    router.push(
      `/admin/property-details/${propertyCategory.toLowerCase()}/verify/${propertyID}/${tab}`,
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
