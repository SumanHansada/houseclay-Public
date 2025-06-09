import React, { useState } from "react";

interface Props {
  name: string;
  email: string;
  phoneNo: string;
  createdAt: string;
  isBlacklisted: boolean;
  onToggleBlacklist?: (b: boolean) => void;
}

export const UserProfile: React.FC<Props> = ({
  name,
  email,
  phoneNo,
  createdAt,
  isBlacklisted,
  onToggleBlacklist,
}) => {
  const [blacklisted, setBlacklisted] = useState(isBlacklisted);
  const toggle = () => {
    const next = !blacklisted;
    setBlacklisted(next);
    onToggleBlacklist?.(next);
  };
  const currentStatus = blacklisted
    ? "The user is blacklisted"
    : "The user is active";

  return (
    <div className="px-28">
      <h2 className="sticky top-0 z-10 text-3xl font-medium mb-4 border-b-2 border-b-gray-400">
        User Details
      </h2>
      <div className="flex gap-16 h-full">
        <div className="w-56 h-56 bg-gray-900 rounded-full flex-shrink-0" />
        <form className="flex flex-col justify-between flex-1 gap-5">
          {[
            { label: "Name", value: name },
            { label: "Phone", value: phoneNo },
            { label: "Email", value: email },
            { label: "Joined On", value: new Date(createdAt).toLocaleString() },
            { label: "Blacklisted Status", value: currentStatus },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-2 text-2xl">
              <label className="">{label}</label>
              <input
                type="text"
                value={value}
                disabled
                className="border border-gray-400 rounded-xl p-3 text-gray-600 bg-white"
              />
            </div>
          ))}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={toggle}
              className={`text-lg px-3 py-2 rounded-xl font-medium text-white ${!blacklisted ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
            >
              {blacklisted ? "Activate User" : "Blacklist User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
