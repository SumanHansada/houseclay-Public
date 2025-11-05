"use client";

import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { type ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ACCOUNT_NAV } from "@/common/dataConstants";
import { AccountNavList } from "@/components/AccountNavList";
import { Footer } from "@/layout-components";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useGetUserDetailQuery } from "@/store/apiSlice";
import { setHideFooter, setHideHeader } from "@/store/appSlice";
import { setShortlistedProperties } from "@/store/shortlistPropertySlice";
import { RootState } from "@/store/store";
import {
  clearUserDetailError,
  setUserDetail,
  setUserDetailError,
  setUserDetailLoading,
} from "@/store/userSlice";

export default function ManageProfileLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { isMobile } = useDeviceContext();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const { data, isLoading, isFetching, isError, error } = useGetUserDetailQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
      skip: !isAuthenticated,
    },
  );

  useEffect(() => {
    dispatch(setUserDetailLoading(isLoading || isFetching));
  }, [dispatch, isLoading, isFetching]);

  useEffect(() => {
    if (isError) {
      const msg = extractErrorMessage(error);
      dispatch(setUserDetailError(msg));
    }
    const user = data?.user;
    if (!user) return;

    // Clear error on successful fetch
    dispatch(clearUserDetailError());

    // Update user slice
    dispatch(
      setUserDetail({
        name: user.name,
        emailID: user.email,
        phoneNo: user.phoneNo,
        connectBal: user.connectBal,
        onWhatsApp: user.onWhatsApp,
        emailVerified: user.emailVerified,
        ownedProperties: user.ownedProperties,
        externalPayments: user.externalPayments,
        contactedProperties: user.contactedProperties,
      }),
    );

    // Update shortlist slice
    const shortlist = Array.isArray(user.shortlistedProperties)
      ? user.shortlistedProperties
      : [];
    dispatch(setShortlistedProperties(shortlist));
  }, [dispatch, isError, error, data]);

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
            <section className="overflow-y-auto w-full">{children}</section>
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
