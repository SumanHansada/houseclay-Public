"use client";

import { type ReactNode, useEffect } from "react";
import { useDispatch } from "react-redux";

import { ACCOUNT_NAV } from "@/common/dataConstants";
import { AccountNavList } from "@/components/AccountNavList";
import { Footer } from "@/layout-components";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { setHideFooter, setHideHeader } from "@/store/appSlice";
import { useGetUserDetailQuery } from "@/store/apiSlice";

export default function ManageProfileLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { isMobile } = useDeviceContext();
  const dispatch = useDispatch();

  const { data: user, isLoading: _isUserDetailLoading } =
    useGetUserDetailQuery();
  _isUserDetailLoading ? "Loading" : console.log(user);

  useEffect(() => {
    if (isMobile) {
      dispatch(setHideHeader(true));
      dispatch(setHideFooter(true));
    } else {
      dispatch(setHideHeader(false));
      dispatch(setHideFooter(false));
    }
  }, [dispatch, isMobile]);

  return (
    <>
      {/* Desktop */}
      <div className="max-md:hidden w-full h-full">
        <div className="flex flex-col bg-white xl:px-28 lg:px-14 md:px-14 px-8 py-12">
          <h1 className="pb-6 text-3xl font-medium">Manage Account</h1>
          <div className="flex md:gap-6 lg:gap-8 xl:gap-24">
            <aside className="md:w-[320px] lg:w-[380px] xl:w-[460px]">
              <AccountNavList items={ACCOUNT_NAV} iconSize={36} />
            </aside>
            <main className="overflow-y-auto w-full">{children}</main>
          </div>
        </div>
        <Footer />
      </div>

      {/* Mobile */}
      <div className="md:hidden w-full h-full">{children}</div>
    </>
  );
}
