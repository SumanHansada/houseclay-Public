"use client";

import { useDispatch } from "react-redux";

import { useLogoutMutation } from "@/store/apiSlice";
import { clearToken } from "@/store/authSlice";

export function useAppLogout() {
  const dispatch = useDispatch();
  const [logoutMutation] = useLogoutMutation();

  return async () => {
    try {
      await logoutMutation().unwrap();
    } catch (err) {
      console.error("Logout failed:", err);
      // Optional: show toast
    } finally {
      dispatch(clearToken());
    }
  };
}
