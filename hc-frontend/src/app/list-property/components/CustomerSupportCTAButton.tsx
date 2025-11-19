"use client";

import { Button } from "@/base-components";
import { LeadCategory } from "@/common/enums";
import { useDialog } from "@/providers/DialogContextProvider";
import { useGenerateLeadMutation } from "@/store/apiSlice";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

const CustomerSupportCTAButton = () => {
  const { openDialog } = useDialog();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  const [generateLead] = useGenerateLeadMutation();

  const handleBookAFreeCall = async () => {
    try {
      const response = await generateLead({
        leadCategory: LeadCategory.PROPERTY_LISTING,
      });
      console.log(response);
      openDialog("call-with-captain-dialog");
    } catch (error) {
      console.error("Error generating lead:", error);
    }
  };

  return (
    <Button
      onClick={
        isAuthenticated ? handleBookAFreeCall : () => openDialog("login-dialog")
      }
      variant="outline"
      size="custom"
      className="px-6 py-3 border-red-500 rounded-xl hover:bg-red-50 transition-colors"
    >
      {isAuthenticated ? "Book a Free Call Now" : "Login to book a free call"}
    </Button>
  );
};

export default CustomerSupportCTAButton;
