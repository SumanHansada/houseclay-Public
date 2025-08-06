"use client";

import { useDispatch } from "react-redux";
import { clearToken } from "@/store/authSlice";
import { useLogoutMutation } from "@/store/apiSlice";

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
