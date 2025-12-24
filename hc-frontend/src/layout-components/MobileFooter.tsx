"use client";

import React from "react";

interface MobileFooterProps {
  children: React.ReactNode;
  className?: string;
}

const MobileFooter: React.FC<MobileFooterProps> = ({
  children,
  className = "",
}) => {
  return (
    <footer
      className={`fixed bottom-0 left-0 right-0 pb-safe-bottom border-t border-t-gray-200 bg-white z-50 md:hidden`}
    >
      <div className={`flex justify-between w-full px-4 py-2 ${className}`}>
        {children}
      </div>
    </footer>
  );
};

export default MobileFooter;
