"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import Spinner from "@/components/Spinner";
import { AdminRole } from "@/interfaces/AdminAuth";
import {
  authFailure,
  setAdminInfo,
  setAdminRole,
  setIsAuthenticated,
} from "@/store/adminAuthSlice";
import { useGetAdminInfoQuery } from "@/store/apiSlice";

const publicPaths = ["/login"];

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const { data, error, isLoading } = useGetAdminInfoQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (data) {
      // Session validated by backend
      dispatch(setIsAuthenticated(true));
      dispatch(setAdminRole(data.role as AdminRole));
      dispatch(setAdminInfo({ name: data.name, username: data.username }));
    } else if (error) {
      // Session invalid (Cookie expired or tampered)
      dispatch(authFailure("Session expired"));
      if (!publicPaths.includes(pathname)) {
        window.location.href = "/login?clear_session=true";
      }
    }
  }, [data, error, dispatch, router, pathname]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center p-2 rounded-full bg-white shadow">
          <Spinner size="md" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
