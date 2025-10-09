"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { useGetUserDetailQuery } from "@/store/apiSlice";
import { clearIsAuthenticated, setIsAuthenticated } from "@/store/authSlice";
import { setUserDetail } from "@/store/userSlice";

/**
 * AuthSyncProvider syncs the server-side auth state (HTTP-only cookie)
 * with the client-side Redux state on app load.
 *
 * Since the token is in an HTTP-only cookie, we can't read it directly
 * from JavaScript. Instead, we make an API call to verify authentication.
 */
export function AuthSyncProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  // This query will automatically include the cookie in the request
  const {
    data: userDetail,
    isError,
    isSuccess,
  } = useGetUserDetailQuery(undefined, {
    // Only fetch once on mount
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (isSuccess && userDetail?.user) {
      // User is authenticated - sync Redux state
      dispatch(setIsAuthenticated(true));
      dispatch(setUserDetail(userDetail.user));
    } else if (isError) {
      // User is not authenticated or token is invalid
      dispatch(clearIsAuthenticated());
    }
  }, [isSuccess, isError, userDetail, dispatch]);

  return <>{children}</>;
}
