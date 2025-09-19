import React from "react";

interface MobileFooterProps {
  children: React.ReactNode;
}

const MobileFooter: React.FC<MobileFooterProps> = ({ children }) => {
  return (
    <footer className="fixed bottom-0 left-0 pb-safe-bottom-2 md:hidden right-0 flex justify-between pt-2 mx-auto xl:px-28 lg:px-14 md:px-8 px-4 border-t border-t-gray-300 bg-white">
      {children}
    </footer>
  );
};

export default MobileFooter;
