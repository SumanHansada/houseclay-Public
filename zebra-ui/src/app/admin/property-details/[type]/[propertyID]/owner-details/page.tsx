"use client";

import { SquareArrowOutUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { RenderPropertyStatus } from "@/components/status/RenderPropertyStatus";
import { PropertyStatusEnum } from "@/interfaces/Property";
import { dummyUserDataList } from "@/mock/userDetailsDummy";

export default function PropertyDetailsOverviewPage() {
  const router = useRouter();
  const currentUser = dummyUserDataList[0];
  const [isBlacklisted] = useState<boolean>(currentUser.blacklisted);
  const { name, email, phoneNo, createdAt } = currentUser;
  const currentStatus = isBlacklisted
    ? "The user is blacklisted"
    : "The user is active";

  const viewUserDetails = (userPhoneNo: string) => {
    router.push(`/admin/user-details/${userPhoneNo}`);
  };

  return (
    <div className="h-full bg-gray-100 flex flex-col overflow-auto px-16 py-8">
      <div className="flex-1 flex flex-col gap-5">
        <div className="p-5 rounded-xl bg-white shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl">Owner Details</h2>
            <button
              className="flex gap-2 text-lg items-center hover:underline hover:cursor-pointer"
              onClick={() => viewUserDetails(phoneNo)}
            >
              <span>View User</span>
              <SquareArrowOutUpRight className="size-5" />
            </button>
          </div>

          <div className="flex gap-16 h-full">
            <div className="w-52 h-52 bg-gray-900 rounded-full flex-shrink-0" />
            <form className="flex flex-col justify-between flex-1 gap-3">
              {[
                { label: "Name", value: name },
                { label: "Phone", value: phoneNo },
                { label: "Email", value: email },
                {
                  label: "Joined On",
                  value: new Date(createdAt).toLocaleString(),
                },
                { label: "Blacklisted Status", value: currentStatus },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-2 text-lg">
                  <label>{label}</label>
                  <input
                    type="text"
                    value={value}
                    disabled
                    className="border border-gray-400 rounded-xl p-3 text-gray-600 bg-white"
                  />
                </div>
              ))}
            </form>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 flex items-center gap-3">
          <h1 className="text-2xl">Verification Status:</h1>
          <RenderPropertyStatus status={PropertyStatusEnum.PENDING} />
          {/* <RenderPropertyStatus status={"PENDING"} /> */}
        </div>
        <div className="bg-white rounded-xl p-6 flex items-center gap-3">
          <h1 className="text-2xl">Report History:</h1>
          <span className="text-lg">No Reports</span>
        </div>
      </div>
    </div>
  );
}
