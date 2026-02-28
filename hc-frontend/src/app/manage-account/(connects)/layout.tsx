"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode } from "react";

import { Button } from "@/base-components";
import { PRO_SUBSCRIPTION_DIALOG_ID } from "@/common/dataConstants/dialogIDs";
import { MobileFooter, MobileHeader } from "@/layout-components";
import { useDialog } from "@/providers/DialogContextProvider";

/**
 * Layout for routes that need Footer (desktop)
 * Pages in this group handle their own MobileFooter with page-specific buttons
 * Examples: connects page
 */
export default function ConnectsLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { openDialog } = useDialog();

  const handleBackClick = () => {
    router.back();
  };

  return (
    <>
      {/* Desktop: Content + Footer */}
      <section className="w-full overflow-y-auto max-md:hidden">
        {children}
      </section>

      {/* Mobile: Pages handle their own MobileFooter */}
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
          <MobileHeader.Title>Connects</MobileHeader.Title>
        </MobileHeader>
        {children}
        {/* Mobile Footer */}
        <MobileFooter>
          <button
            className="text-center border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-xl transition duration-200"
            onClick={() => router.push("/what-are-connects")}
          >
            Know more
          </button>
          <button
            className="text-center border border-red-500 bg-red-500  hover:bg-red-600 text-white px-6 py-3 rounded-xl transition duration-200"
            // onClick={() => router.push("/buy-connects")}
            onClick={() => openDialog(PRO_SUBSCRIPTION_DIALOG_ID)}
          >
            Buy Connects
          </button>
        </MobileFooter>
      </div>
    </>
  );
}
