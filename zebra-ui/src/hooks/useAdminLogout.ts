"use client";

import { useDispatch } from "react-redux";

import { logout as logoutAction } from "@/store/adminAuthSlice";
import { apiSlice, useLogoutMutation } from "@/store/apiSlice";
import { getErrorMessage } from "@/utils/rtkError";

export function useAdminLogout() {
  const dispatch = useDispatch();
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
      window.location.href = "/login?clear_session=true";
    }
  };

  return { logout, isLoading };
}
