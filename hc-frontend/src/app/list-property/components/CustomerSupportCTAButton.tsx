"use client";

import { Button } from "@/base-components";
import { useDialog } from "@/providers/DialogContextProvider";

const CustomerSupportCTAButton = () => {
  const { openDialog } = useDialog();

  const handleBookAFreeCall = () => {
    openDialog("call-with-captain-dialog");
  };

  return (
    <Button
      onClick={handleBookAFreeCall}
      variant="outline"
      size="custom"
      className="px-6 py-3 border-red-500 rounded-xl hover:bg-red-50 transition-colors"
    >
      Book a Free Call Now
    </Button>
  );
};

export default CustomerSupportCTAButton;
