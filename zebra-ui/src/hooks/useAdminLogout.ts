"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import { logout as logoutAction } from "@/store/adminAuthSlice";
import { apiSlice, useLogoutMutation } from "@/store/apiSlice";
import { getErrorMessage } from "@/utils/rtkError";

export function useAdminLogout() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [logoutApi, { isLoading }] = useLogoutMutation();

  const logout = async () => {
    try {
      await logoutApi().unwrap();
      console.log("Logout successful on backend.");
    } catch (err) {
      // Log the formatted error, but proceed with client logout
      console.error("Logout API failed:", getErrorMessage(err));
    } finally {
      dispatch(logoutAction());
      dispatch(apiSlice.util.resetApiState());
      router.replace("/login");
    }
  };

  return { logout, isLoading };
}
