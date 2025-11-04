"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { initializeToken } from "@/store/adminSlice";

export function InitializeAuthToken({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initializeToken());
  }, [dispatch]);

  return <>{children}</>;
}
