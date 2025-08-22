"use client";

import { type ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ACCOUNT_NAV } from "@/common/constants";
import { AccountNavList } from "@/components/AccountNavList";
import { Footer } from "@/layout-components";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import {
  resetUIState,
  setHideFooter,
  setHideHeader,
  setHideStickyNavBar,
} from "@/store/appSlice";
import { RootState } from "@/store/store";

export default function ManageProfileLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { isMobile } = useDeviceContext();
  const dispatch = useDispatch();
  const stickyHidden = useSelector((s: RootState) => s.app.hideStickyNavBar);

  useEffect(() => {
    dispatch(setHideHeader(isMobile));
    dispatch(setHideFooter(isMobile));
    dispatch(setHideStickyNavBar(isMobile ? false : true));
    return () => {
      dispatch(resetUIState());
    };
  }, [dispatch, isMobile]);

  useEffect(() => {
    if (!isMobile && !stickyHidden) {
      dispatch(setHideStickyNavBar(true));
    }
  }, [dispatch, isMobile, stickyHidden]);

  return (
    <>
      {/* Desktop */}
      <div className="max-md:hidden w-full h-full">
        <div className="flex flex-col bg-white xl:px-24 lg:px-14 md:px-10 px-6 py-6">
          <h1 className="pb-6 text-4xl font-medium">Manage Account</h1>
          <div className="flex md:gap-6 lg:gap-8 xl:gap-24">
            <aside className="md:w-[320px] lg:w-[380px] xl:w-[460px]">
              <AccountNavList items={ACCOUNT_NAV} />
            </aside>
            <main className="overflow-y-auto w-full">{children}</main>
          </div>
        </div>
        <Footer />
      </div>

      {/* Mobile */}
      <div className="max-md:block md:hidden w-full h-full">{children}</div>
    </>
  );
}
