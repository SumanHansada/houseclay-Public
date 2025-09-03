import React from "react";

interface ConnectsFooterProps {
  onBuyConnects?: () => void;
}

const ConnectsFooter: React.FC<ConnectsFooterProps> = ({ onBuyConnects }) => {
  return (
    <footer className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 shadow-sm">
      <div className="flex items-center justify-end px-4 py-3">
        <button
          onClick={onBuyConnects}
          className="px-5 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg w-1/2"
        >
          Buy Connects Now
        </button>
      </div>
    </footer>
  );
};

export default ConnectsFooter;
