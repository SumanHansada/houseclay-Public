"use client";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { setHideStickyNavBar } from "@/store/appSlice";

interface MobileFooterProps {
  children: React.ReactNode;
}

const MobileFooter: React.FC<MobileFooterProps> = ({ children }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setHideStickyNavBar(true));
    // return () => {
    //   dispatch(setHideStickyNavBar(false));
    // };
  }, [dispatch]);
  return (
    <footer className="fixed bottom-0 left-0 pb-safe-bottom-2 md:hidden right-0 flex justify-between pt-2 mx-auto xl:px-28 lg:px-14 md:px-8 px-4 border-t border-t-gray-300 bg-white z-50">
      {children}
    </footer>
  );
};

export default MobileFooter;
