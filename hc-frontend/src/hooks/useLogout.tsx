"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

import { logoutAction } from "@/actions/authActions";
import { apiSlice } from "@/store/apiSlice";
import { clearAuthStep, clearIsAuthenticated } from "@/store/authSlice";
import { resetPropertySearchSlice } from "@/store/propertySearchSlice";
import { clearShortlist } from "@/store/shortlistPropertySlice";
import { clearAllUserData, clearCheckUser } from "@/store/userSlice";

export function useLogout() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const logout = async () => {
    setIsLoading(true);
    try {
      const result = await logoutAction();

      if (!result.success) {
        throw new Error(result.error || "Logout failed");
      }

      toast.success("Logged out successfully");
    } catch (err) {
      console.error("Logout failed:", err);
      const errorMessage = err instanceof Error ? err.message : "Logout failed";
      toast.error(errorMessage);
    } finally {
      // Clear Redux state
      dispatch(clearIsAuthenticated());
      dispatch(clearCheckUser());
      dispatch(clearAllUserData());
      dispatch(clearShortlist());
      dispatch(resetPropertySearchSlice());
      dispatch(clearAuthStep());
      dispatch(apiSlice.util.resetApiState());

      // Refresh the page to update server-side state
      router.refresh();
      setIsLoading(false);
    }
  };

  return { logout, isLoading };
}
