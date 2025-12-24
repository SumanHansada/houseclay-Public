"use client";

import { ChevronLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode } from "react";

import { Button } from "@/base-components";
import { ACCOUNT_NAV_ITEMS } from "@/common/dataConstants/navbar";
import { MobileHeader, PageTransition } from "@/layout-components";

const accountNavMap = ACCOUNT_NAV_ITEMS.reduce(
  (acc, item) => {
    acc[item.href] = item.headerLabel;
    return acc;
  },
  {} as Record<string, string>,
);

/**
 * Layout for common manage-account routes
 * Handles UI rendering: mobile header, PageTransition
 * Desktop sidebar is provided by root layout
 */
export default function CommonLayout({ children }: { children: ReactNode }) {
  const pathName = usePathname();
  const router = useRouter();

  const headerName = accountNavMap[pathName];

  const handleBackClick = () => {
    router.back();
  };

  return (
    <>
      {/* Desktop */}
      <section className="w-full overflow-y-auto max-md:hidden">
        <PageTransition
          transitionType="slideRight"
          backTransitionType="slideLeft"
        >
          {children}
        </PageTransition>
      </section>

      {/* Mobile */}
      <div className="w-full h-full md:hidden">
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
          <MobileHeader.Title>{headerName}</MobileHeader.Title>
        </MobileHeader>
        <PageTransition
          transitionType="slideRight"
          backTransitionType="slideLeft"
        >
          {children}
        </PageTransition>
      </div>
    </>
  );
}
