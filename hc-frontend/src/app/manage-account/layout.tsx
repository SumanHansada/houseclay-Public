"use client";

import { type ReactNode, useEffect } from "react";
import { useDispatch } from "react-redux";

import { ACCOUNT_NAV } from "@/common/dataConstants";
import { AccountNavList } from "@/components/AccountNavList";
import { Footer } from "@/layout-components";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { setHideFooter, setHideHeader } from "@/store/appSlice";
import { useGetUserDetailQuery } from "@/store/apiSlice";
import {
  setUser,
  setUserDetailError,
  setUserDetailLoading,
} from "@/store/userSlice";
import { syncUserDetails } from "@/store/authSlice";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

export default function ManageProfileLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { isMobile } = useDeviceContext();
  const dispatch = useDispatch();

  const { data, isLoading, isFetching, isError, error } =
    useGetUserDetailQuery();

  useEffect(() => {
    dispatch(setUserDetailLoading(isLoading || isFetching));
  }, [dispatch, isLoading, isFetching]);

  useEffect(() => {
    if (!isError) return;
    const msg = extractErrorMessage(error);
    dispatch(setUserDetailError(msg));
  }, [dispatch, isError, error]);

  useEffect(() => {
    const userDetail = data?.user;
    if (!userDetail) return;

    dispatch(
      syncUserDetails({
        name: userDetail.name,
        email: userDetail.email,
        phoneNo: userDetail.phoneNo,
        connectBal: userDetail.connectBal,
      }),
    );

    dispatch(setUser(userDetail));
  }, [dispatch, data]);

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

function extractErrorMessage(
  err: FetchBaseQueryError | SerializedError | undefined,
): string {
  if (!err) return "Unknown error";
  if ("status" in err) {
    const data = (err.data ?? {}) as { message?: string; error?: string };
    return data.message || data.error || `HTTP ${String(err.status)}`;
  }
  return err.message ?? "Request failed";
}
