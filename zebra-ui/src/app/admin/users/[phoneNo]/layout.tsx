"use client";

import { Building2, ChevronLeft } from "lucide-react";
import Link from "next/link";
import {
  useParams,
  useRouter,
  useSelectedLayoutSegment,
} from "next/navigation";
import { useEffect, useRef } from "react";

import { Button } from "@/base-components";
import { userDetailsTabs } from "@/common/constants/user";
import { UserDetailsTabEnum } from "@/common/enums";
import AsyncFallback from "@/components/AsyncFallback";
import { useGetUserByPhoneNoQuery } from "@/store/apiSlice";
import { ensureEnumValue, safeUrlDecode } from "@/utils/core";

export default function UserDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const params = useParams();
  const userPhoneNo = safeUrlDecode(params.phoneNo as string);
  const activeSegment = useSelectedLayoutSegment();

  // Create a Ref for the scrollable container
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const {
    data: currentUser,
    isLoading,
    isError,
    error,
  } = useGetUserByPhoneNoQuery({ phoneNo: userPhoneNo });

  // Add Wheel Event Listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (evt: WheelEvent) => {
      // Check if content overflows horizontally
      if (container.scrollWidth > container.clientWidth) {
        // We only want to hijack the scroll if the user is scrolling vertically (deltaY)
        // and expecting horizontal movement.
        if (Math.abs(evt.deltaY) > 0) {
          evt.preventDefault();
          // Speed up the scroll a bit (optional multiplier)
          container.scrollLeft += evt.deltaY;
        }
      }
    };

    // 'passive: false' is CRITICAL to allow evt.preventDefault()
    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [isLoading]);

  // ─── LOADING & ERROR STATES ───
  if (isLoading) {
    return (
      <AsyncFallback
        isLoading={true}
        isError={false}
        loadingMessage="Loading user details..."
      />
    );
  }

  if (isError || !currentUser) {
    return (
      <AsyncFallback
        isLoading={false}
        isError={true}
        error={error}
        errorMessage="Failed to fetch user details!"
      />
    );
  }

  const activeTab = ensureEnumValue({
    enumObj: UserDetailsTabEnum,
    value: activeSegment,
    fallback: UserDetailsTabEnum.PROFILE,
  });

  const handleAddProperty = () => {
    router.push(`/admin/list-property/${userPhoneNo}`);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* ─── COMPACT HEADER (Single Row) ─── */}
      <header className="shrink-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 gap-6 shadow-sm z-10">
        {/* Identity & Back Nav */}
        <div className="flex items-center gap-1 min-w-[20%] max-w-[30%]">
          <Link
            href="/admin/users"
            className="flex items-center justify-center text-gray-400 hover:text-gray-800 hover:bg-gray-100 p-1 rounded-md transition-colors"
            title="Redirect to Users"
          >
            <ChevronLeft size={20} />
          </Link>

          <div className="flex items-center gap-2 overflow-hidden">
            <h1
              className="text-lg font-semibold text-gray-900 truncate"
              title={currentUser.user.name}
            >
              {currentUser.user.name || "Unknown User"}
            </h1>
            <span className="shrink-0 flex items-center text-sm text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded border">
              {userPhoneNo}
            </span>

            {/* BROKER TAG */}
            {currentUser.user.broker && (
              <span className="shrink-0 bg-yellow-100 text-yellow-800 border border-yellow-200 text-sm font-medium px-1.5 py-0.5 rounded uppercase tracking-wider">
                Broker
              </span>
            )}

            {/* BANNED TAG */}
            {currentUser.user.blacklisted && (
              <span className="shrink-0 bg-red-50 text-red-600 border border-red-100 text-sm font-medium px-1.5 py-0.5 rounded uppercase tracking-wider">
                Banned
              </span>
            )}
          </div>
        </div>

        {/* Navigation Tabs (Center) */}
        <nav className="flex-1 flex justify-center overflow-hidden min-w-0 px-4">
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg border border-gray-200 overflow-x-auto scrollbar-hide max-w-full whitespace-nowrap"
          >
            {userDetailsTabs.map((tab) => {
              const isActive = activeTab === tab.value;
              return (
                <Link
                  key={tab.value}
                  href={`/admin/users/${userPhoneNo}/${tab.value}`}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200
                    ${
                      isActive
                        ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                    }
                  `}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Global Actions (Right) */}
        <div className="flex items-center justify-end min-w-fit">
          <Button
            size="custom"
            onClick={handleAddProperty}
            className="rounded-full text-nowrap px-4 py-2"
            leftIcon={<Building2 size={18} />}
          >
            Add Property
          </Button>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-1 overflow-hidden relative flex flex-col">
        {children}
      </main>
    </div>
  );
}
