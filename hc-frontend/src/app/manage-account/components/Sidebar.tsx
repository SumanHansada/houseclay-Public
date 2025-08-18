"use client";

import { ACCOUNT_NAV } from "@/common/constants";
import { AccountNavList } from "@/components/AccountNavList";

export function Sidebar() {
  return (
    <aside className="md:w-[320px] lg:w-[380px] xl:w-[460px]">
      <AccountNavList items={ACCOUNT_NAV} />
    </aside>
  );
}
