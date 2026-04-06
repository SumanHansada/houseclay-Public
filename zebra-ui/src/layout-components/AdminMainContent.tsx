"use client";

import { useSidebar } from "@/providers/SidebarContext";

export default function AdminMainContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isCollapsed } = useSidebar();

  return (
    <main
      className={`pt-16 flex-1 flex flex-col overflow-hidden transition-[padding-left] duration-300 ease-in-out ${
        isCollapsed ? "pl-16" : "pl-72 lg:pl-80"
      }`}
    >
      {children}
    </main>
  );
}
