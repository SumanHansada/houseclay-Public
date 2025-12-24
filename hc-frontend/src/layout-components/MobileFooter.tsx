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
      className={`fixed bottom-0 left-0 right-0 mx-auto px-4 py-3 border-t border-t-gray-300 bg-white z-50 md:hidden`}
    >
      <div className={`flex justify-between w-full ${className}`}>
        {children}
      </div>
    </footer>
  );
};

export default MobileFooter;
