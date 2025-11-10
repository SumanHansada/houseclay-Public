"use client";

import { useDispatch } from "react-redux";

import { useLogoutMutation } from "@/store/apiSlice";
import { clearAuthStep, clearIsAuthenticated } from "@/store/authSlice";
import { clearAllUserData } from "@/store/userSlice";

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
      dispatch(clearAllUserData());
      dispatch(clearAuthStep());
    }
  };

  return { logout, isLoading };
}
