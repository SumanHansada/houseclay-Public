import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";

import { InitialsAvatar } from "@/components/InitialsAvatar";
import { UserInfo } from "@/interfaces/User";

interface OwnerDetailsProps {
  currentUser: UserInfo;
}

export const OwnerDetails = ({ currentUser }: OwnerDetailsProps) => {
  const { name, email, phoneNo, blacklisted } = currentUser;
  const currentStatus = blacklisted
    ? "The user is blacklisted"
    : "The user is active";
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl">Owner Details</h2>
        <Link
          href={`/admin/users/${phoneNo}`}
          target="_blank"
          rel="noopener noreferrer"
          prefetch={false}
          className="flex gap-2 text-lg items-center hover:underline"
        >
          <span>View User</span>
          <SquareArrowOutUpRight className="size-5" />
        </Link>
      </div>
      <div className="flex gap-16 h-full">
        <InitialsAvatar name={name} size="xl" />
        <div className="flex flex-col justify-between flex-1 gap-3">
          {[
            { label: "Name", value: name },
            { label: "Phone", value: phoneNo },
            { label: "Email", value: email },
            { label: "Blacklisted Status", value: currentStatus },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-2 text-lg">
              <label className="text-gray-600 font-medium">{label}</label>
              <input
                type="text"
                value={value}
                disabled
                className="border border-gray-300 rounded-xl p-3 text-gray-800 bg-gray-50 cursor-default"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
