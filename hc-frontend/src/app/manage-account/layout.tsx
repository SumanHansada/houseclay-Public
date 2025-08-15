import type { ReactNode } from "react";
import { Sidebar } from "./components/Sidebar";
import { ACCOUNT_NAV } from "@/common/constants";
import { Footer } from "@/layout-components";

export const metadata = { title: "Manage Profile" };

export default function ManageProfileLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <div className="flex flex-col bg-white w-full h-full xl:px-28 lg:px-14 md:px-8 px-8 py-6">
        <h1 className="max-md:hidden pb-6 text-4xl font-medium">
          Manage Account
        </h1>
        <div className="flex md:gap-6 lg:gap-8 xl:gap-24">
          <Sidebar
            items={ACCOUNT_NAV}
            className="md:w-[320px] lg:w-[380px] xl:w-[460px] max-md:hidden"
          />
          <main className="overflow-y-auto w-full">{children}</main>
        </div>
      </div>
      <div className="w-full max-md:hidden">
        <Footer />
      </div>
    </>
  );
}
