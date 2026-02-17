"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/base-components";

export default function UnauthorizedPage() {
  const router = useRouter();
  return (
    <div className="flex-1 flex w-full items-center justify-center bg-gray-100">
      <div className="rounded-lg bg-white p-5 shadow-md">
        <div>
          <h1 className="mb-4 text-3xl font-bold text-red-600">Unauthorized</h1>
          <p className="text-gray-700 text-lg">
            You do not have permission to access this page. Please contact your
            administrator if you believe this is an error.
          </p>
        </div>
        <div className="flex justify-end mt-4">
          <Button
            className="rounded-lg"
            onClick={() => router.replace("/admin/dashboard")}
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
