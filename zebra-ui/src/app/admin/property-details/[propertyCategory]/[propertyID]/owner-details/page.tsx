"use client";

import { SquareArrowOutUpRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { RenderPropertyStatus } from "@/components/status/RenderPropertyStatus";
import { useGetPropertyByIdQuery } from "@/store/apiSlice";
import { InitialsAvatar } from "@/components/InitialsAvatar";

export default function PropertyDetailsOverviewPage() {
  const router = useRouter();
  const { propertyID } = useParams() as { propertyID: string };

  const { data: currentProperty } = useGetPropertyByIdQuery({
    propertyID: propertyID,
  });
  const ownerDetails = currentProperty!.owner;
  const verificationStatus = currentProperty!.propertyState;
  const propertyUpdates = currentProperty!.propertyUpdates;
  const latestUpdate = propertyUpdates[propertyUpdates.length - 1] ?? null;

  const [isBlacklisted] = useState<boolean>(ownerDetails.blacklisted);
  const { name, email, phoneNo } = ownerDetails;
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
            <InitialsAvatar name={name} size="xl" />
            <form className="flex flex-col justify-between flex-1 gap-3">
              {[
                { label: "Name", value: name },
                { label: "Phone", value: phoneNo },
                { label: "Email", value: email },
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
          <RenderPropertyStatus status={verificationStatus} />
        </div>
        {latestUpdate ? (
          <div className="bg-white rounded-xl p-6 flex flex-col gap-3">
            <h1 className="text-2xl">Property Updates:</h1>
            <ul className="ml-4 list-disc">
              <li>
                Update Type:&nbsp;
                <span className="text-lg">{latestUpdate.updateType}</span>
              </li>
              <li>
                Update Time:&nbsp;
                <span className="text-lg">
                  {new Date(latestUpdate.updateTime).toLocaleString("en-IN")}
                </span>
              </li>
              <li>
                Updated By:&nbsp;
                <span className="text-lg">{latestUpdate.updateBy}</span>
                <span className="text-sm text-gray-700 ml-1">
                  [{latestUpdate.userType}]
                </span>
              </li>
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
