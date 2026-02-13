"use client";

import { ChevronLeft, FileQuestion } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/base-components";

export default function AdminNotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center text-gray-500 gap-6">
      <div className="bg-gray-200 p-6 rounded-full">
        <FileQuestion size={64} className="text-gray-400" />
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-800">Page Not Found</h2>
        <p className="text-lg text-gray-500 max-w-md">
          The page you are looking for doesn&apos;t exist or you don&apos;t have
          permission to view it.
        </p>
      </div>

      <div className="flex gap-4">
        <Button
          variant="secondary"
          leftIcon={<ChevronLeft size={20} />}
          onClick={() => router.back()}
          className="rounded-lg"
        >
          Go Back
        </Button>

        <Button
          onClick={() => router.replace("/admin/dashboard")}
          className="rounded-lg"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
