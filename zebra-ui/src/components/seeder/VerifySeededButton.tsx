"use client";

import { CheckCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/base-components";
import { useVerifyPropertyMutation } from "@/store/apiSlice";

export const VerifySeededButton = () => {
  const [verifyProperty] = useVerifyPropertyMutation();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleBulkVerify = async () => {
    if (
      !confirm(
        "This will verify properties ID 1 to 48 with a score of 80. Continue?",
      )
    )
      return;

    setLoading(true);
    setProgress(0);
    let successCount = 0;

    try {
      // Loop from 1 to 48
      for (let i = 1; i <= 48; i++) {
        try {
          // Send verification request
          await verifyProperty({
            propertyID: i.toString(),
            comment: "Auto-verified seeded property via script",
            score: 80,
          }).unwrap();

          successCount++;
        } catch (err) {
          // We ignore errors for individual items (e.g., if ID 5 is already verified)
          // so the loop continues for the rest.
          console.warn(`Failed to verify ID ${i}`, err);
        }

        // Update progress for UI
        setProgress(i);
      }
      toast.success(`Batch complete! Verified ${successCount}/48 properties.`);
    } catch (error) {
      console.error("Bulk verification failed:", error);
      toast.error("Something went wrong with the bulk operation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleBulkVerify}
      disabled={loading}
      className="bg-green-600 text-white hover:bg-green-700 border-green-700 flex items-center gap-2 rounded-lg"
    >
      {loading ? (
        <span>Verifying... {progress}/48</span>
      ) : (
        <span className="flex items-center gap-2">
          <CheckCircle size={16} />
          <span>Verify Seeded (1-48)</span>
        </span>
      )}
    </Button>
  );
};
