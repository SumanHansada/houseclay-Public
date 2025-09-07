import { useRouter } from "next/navigation";
import React from "react";

interface ConnectsFooterProps {
  onBuyConnects?: () => void;
}

const ConnectsFooter: React.FC<ConnectsFooterProps> = ({ onBuyConnects }) => {
  const router = useRouter();
  return (
    <footer className="fixed bottom-0 left-0 md:hidden right-0 flex justify-between py-2 mx-auto xl:px-28 lg:px-14 md:px-8 px-6 border-t border-t-gray-300 bg-white">
      <button
        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl"
        onClick={() => router.back()}
      >
        Back
      </button>
      <button
        onClick={onBuyConnects}
        className="px-6 py-3 bg-red-500 text-white hover:bg-red-600 rounded-xl"
      >
        Buy Connects Now
      </button>
    </footer>
  );
};

export default ConnectsFooter;
