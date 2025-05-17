"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { initializeToken } from "@/store/adminSlice";
import { RootState } from "@/store/store";

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { token } = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    dispatch(initializeToken());
  }, [dispatch]);

  useEffect(() => {
    setTimeout(() => {
      if (!token) {
        router.push("/admin/login");
      } else {
        router.push("/admin/dashboard");
      }
    }, 1000);
  }, [token, router]);

  return null; // Return null since we're redirecting
}
