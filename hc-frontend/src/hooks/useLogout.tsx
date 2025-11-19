"use client";

import { useDispatch } from "react-redux";

import { useLogoutMutation } from "@/store/apiSlice";
import { clearAuthStep, clearIsAuthenticated } from "@/store/authSlice";
import { clearShortlist } from "@/store/shortlistPropertySlice";
import { clearAllUserData, clearCheckUser } from "@/store/userSlice";
import { resetPropertySearch } from "@/store/propertySearchSlice";

export function useLogout() {
  const dispatch = useDispatch();
  const [logoutMutation, { isLoading }] = useLogoutMutation();

  const logout = async () => {
    try {
      const logoutResponse = await logoutMutation().unwrap();
      console.log(logoutResponse);
    } catch (err) {
      console.error("Logout API failed:", err);
    } finally {
      dispatch(clearIsAuthenticated());
      dispatch(clearCheckUser());
      dispatch(clearAllUserData());
      dispatch(clearShortlist());
      dispatch(resetPropertySearch());
      dispatch(clearAuthStep());
    }
  };

  return { logout, isLoading };
}
