import { useRouter } from "next/navigation";
import React from "react";

import { MobileFooter } from "@/layout-components";

interface ConnectsFooterProps {
  onBuyConnects?: () => void;
}

const ConnectsMobileFooter: React.FC<ConnectsFooterProps> = ({
  onBuyConnects,
}) => {
  const router = useRouter();
  return (
    <MobileFooter>
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
    </MobileFooter>
  );
};

export default ConnectsMobileFooter;
