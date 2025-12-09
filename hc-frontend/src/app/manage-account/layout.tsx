"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ACCOUNT_NAV } from "@/common/dataConstants/navbar";
import { AccountNavList } from "@/components/AccountNavList";
import { Footer, PageTransition } from "@/layout-components";
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

export default function ManageProfileLayout({
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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Desktop */}
      <div className="w-full h-full max-md:hidden">
        <div className="flex flex-col px-8 py-12 bg-white xl:px-28 lg:px-14 md:px-14">
          <h1 className="pb-6 text-3xl font-medium">Manage Account</h1>
          <div className="flex md:gap-6 lg:gap-8 xl:gap-24">
            <aside className="md:w-[320px] lg:w-[380px] xl:w-[460px]">
              <AccountNavList items={ACCOUNT_NAV} iconSize={36} />
            </aside>
            <section className="w-full overflow-y-auto">
              <PageTransition
                transitionType="slideRight"
                backTransitionType="slideLeft"
              >
                {children}
              </PageTransition>
            </section>
          </div>
        </div>
        <Footer />
      </div>

      {/* Mobile */}
      <div className="w-full h-full md:hidden">
        <PageTransition
          transitionType="slideRight"
          backTransitionType="slideLeft"
        >
          {children}
        </PageTransition>
      </div>
    </>
  );
}
