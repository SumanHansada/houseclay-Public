"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/base-components";
import { PropertyCategory } from "@/common/enums";
import { generateUUID } from "@/common/utils";
import { MobileFooter, MobileHeader } from "@/layout-components";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { setPropertyCategory, setPropertyID } from "@/store/listPropertySlice";
import { RootState } from "@/store/store";

export default function FindFlatmatesLayout({
  children,
}: {
  children: ReactNode;
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isMobile } = useDeviceContext();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  const handleBackClick = () => {
    router.back();
  };

  const handleGetStarted = () => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    const uuid = generateUUID();
    dispatch(setPropertyID(uuid));
    dispatch(setPropertyCategory(PropertyCategory.FLATMATE));
    const url = `/list-property/${PropertyCategory.FLATMATE.toLowerCase()}/property-details`;
    router.push(url);
  };

  if (!isMobile) {
    router.replace("/");
    return;
  }
  return (
    <>
      <MobileHeader>
        <MobileHeader.LeftAction>
          <Button
            variant="secondary"
            size="custom"
            className="rounded-full p-1"
            onClick={handleBackClick}
          >
            <ChevronLeft size={24} />
          </Button>
        </MobileHeader.LeftAction>
        <MobileHeader.Title>Find Flatmates</MobileHeader.Title>
      </MobileHeader>
      {children}
      <MobileFooter>
        <Button
          variant="primary"
          size="lg"
          isFullWidth={true}
          className="rounded-xl"
          onClick={handleGetStarted}
        >
          Get Started
        </Button>
      </MobileFooter>
    </>
  );
}
