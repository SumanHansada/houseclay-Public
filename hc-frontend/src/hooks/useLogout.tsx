"use client";

import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

import { apiSlice, useLogoutMutation } from "@/store/apiSlice";
import { clearAuthStep, clearIsAuthenticated } from "@/store/authSlice";
import { resetPropertySearch } from "@/store/propertySearchSlice";
import { clearShortlist } from "@/store/shortlistPropertySlice";
import { clearAllUserData, clearCheckUser } from "@/store/userSlice";

export function useLogout() {
  const dispatch = useDispatch();
  const [logoutMutation, { isLoading }] = useLogoutMutation();

  const logout = async () => {
    try {
      const logoutResponse = await logoutMutation().unwrap();
      toast.success("Logged out successfully");
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

      dispatch(apiSlice.util.resetApiState());
    }
  };

  return { logout, isLoading };
}
