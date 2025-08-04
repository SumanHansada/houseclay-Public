// app/manage-profile/layout.tsx
import { ReactNode } from "react";
import Sidebar from "./components/Sidebar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Manage Profile",
};

export default function ManageProfileLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <div className="flex flex-col bg-white w-full h-full xl:px-28 lg:px-14 md:px-14 px-8 py-6">
        <h1 className="pb-6 text-3xl font-medium">Manage Account</h1>
        <div className="flex gap-10">
          <Sidebar />
          <main className="overflow-y-auto w-full">{children}</main>
        </div>
      </div>
      <Footer />
    </>
  );
}
