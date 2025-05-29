"use client";

import { useRouter } from "next/navigation";
import { UserDetailsNavbar } from "../components/UserDetailsNavbar";

export default function UserDetailsIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex flex-col flex-1 min-h-0">
        <div className="sticky top-0 z-10 bg-black text-white px-28">
          <UserDetailsNavbar />
        </div>

        <div className="flex-1 bg-gray-100 px-28 py-4 min-h-0">{children}</div>

        <footer className="sticky bottom-0 bg-black text-white py-2 text-center flex px-28 items-start">
          <button
            className="py-3 px-4 rounded-xl bg-gray-300 text-black hover:bg-gray-100"
            onClick={() => router.back()}
          >
            Back
          </button>
        </footer>
      </div>
    </div>
  );
}
