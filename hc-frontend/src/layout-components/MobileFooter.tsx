"use client";

import React from "react";

interface MobileFooterProps {
  children: React.ReactNode;
  className?: string;
}

const MobileFooter: React.FC<MobileFooterProps> = ({ children, className }) => {
  return (
    <footer
      className={`fixed h-16 bottom-0 left-0 pb-safe-bottom-2 md:hidden right-0 flex justify-between pt-2 mx-auto xl:px-28 lg:px-14 md:px-8 px-4 border-t border-t-gray-300 bg-white z-50 ${className}`}
    >
      {children}
    </footer>
  );
};

export default MobileFooter;
