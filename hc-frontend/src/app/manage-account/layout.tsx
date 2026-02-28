"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ACCOUNT_NAV_ITEMS } from "@/common/dataConstants/navbarList";
import { AccountNavList } from "@/components/AccountNavList";
import { Footer } from "@/layout-components";
import { useGetUserDetailQuery } from "@/store/apiSlice";
import { setShortlistedProperties } from "@/store/shortlistPropertySlice";
import { RootState } from "@/store/store";
import {
  clearUserDetailError,
  setUserDetail,
  setUserDetailError,
  setUserDetailLoading,
} from "@/store/userSlice";
import { getErrorMessage } from "@/utils/rtkQueryHelpers";

/**
 * Parent layout for all manage-account routes
 * Handles common logic: authentication, data fetching, Redux state updates
 */
const ACCOUNT_NAV_ITEMS_WITHOUT_LOGOUT = ACCOUNT_NAV_ITEMS.filter(
  (navItem) => navItem.label !== "Logout",
);
export default function ManageAccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
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
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    dispatch(setUserDetailLoading(isLoading || isFetching));
  }, [dispatch, isLoading, isFetching]);

  useEffect(() => {
    if (isError) {
      const msg = getErrorMessage(error);
      dispatch(setUserDetailError(msg));
    }
    const user = data?.user;
    if (!user) return;

    // Clear error on successful fetch
    dispatch(clearUserDetailError());

    const {
      name,
      email,
      phoneNo,
      connectBal,
      onWhatsApp,
      emailVerified,
      ownedProperties,
      externalPayments,
      contactedProperties,
    } = user;

    // Update user slice
    dispatch(
      setUserDetail({
        name,
        emailID: email,
        phoneNo,
        connectBal,
        onWhatsApp,
        emailVerified,
        ownedProperties,
        externalPayments,
        contactedProperties,
      }),
    );

    // Update shortlist slice
    const shortlist = Array.isArray(user.shortlistedProperties)
      ? user.shortlistedProperties
      : [];
    dispatch(setShortlistedProperties(shortlist));
  }, [dispatch, isError, error, data]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Desktop: Sidebar + Content Area */}
      <div className="w-full h-full max-md:hidden">
        <div className="flex flex-col px-8 py-12 bg-white xl:px-28 lg:px-14 md:px-14">
          <h1 className="pb-6 text-3xl font-medium">Manage Account</h1>
          <div className="flex md:gap-6 lg:gap-8 xl:gap-24">
            <aside className="md:w-[320px] lg:w-[380px] xl:w-[460px]">
              <AccountNavList
                items={ACCOUNT_NAV_ITEMS_WITHOUT_LOGOUT}
                iconSize={36}
              />
            </aside>
            {children}
          </div>
        </div>
      </div>
      {/* Footer */}

      <Footer />

      {/* Mobile: Route groups handle their own mobile layouts */}
      <div className="w-full h-full md:hidden">{children}</div>
    </>
  );
}
