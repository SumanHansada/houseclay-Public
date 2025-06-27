import { SquareArrowOutUpRight } from "lucide-react";

import { User } from "@/interfaces/User";

interface OwnerDetailsProps {
  currentUser: User;
  viewUserDetails: (phoneNo: string) => void;
}

export const OwnerDetails = ({
  currentUser,
  viewUserDetails,
}: OwnerDetailsProps) => {
  const { name, email, phoneNo, createdAt, blacklisted } = currentUser;
  const currentStatus = blacklisted
    ? "The user is blacklisted"
    : "The user is active";
  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-3xl">Owner Details</h2>
        <button
          className="flex gap-2 text-lg items-center text-red-500 hover:underline hover:cursor-pointer"
          onClick={() => viewUserDetails(phoneNo)}
        >
          <span>View User</span>
          <SquareArrowOutUpRight className="size-5" />
        </button>
      </div>
      <div className="flex gap-16 h-full">
        <div className="w-52 h-52 bg-gray-200 rounded-full flex-shrink-0" />
        <div className="flex flex-col justify-between flex-1 gap-3">
          {[
            { label: "Name", value: name },
            { label: "Phone", value: phoneNo },
            { label: "Email", value: email },
            {
              label: "Joined On",
              value: new Date(createdAt).toLocaleDateString(),
            },
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
    </>
  );
};
