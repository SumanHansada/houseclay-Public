"use client";
import { RootState } from "@/store/store";
import React, { useState } from "react";
import { useSelector } from "react-redux";

const ProfilePage: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <span className="text-gray-500">Loading user details…</span>
      </div>
    );
  }
  const { name, email, phoneNo, blacklisted, createdAt } = currentUser;
  const [isBlacklisted, setIsBlacklisted] = useState(blacklisted);

  const handleBlacklistUser = () => {
    // API to blacklist User
    console.log("blacklist user");
  };
  const handleActivateUser = () => {
    // API to activate User
    console.log("activate user");
  };

  const currentStatus = isBlacklisted
    ? "The user is blacklisted"
    : "The user is active";

  return (
    <div className="px-16 py-6 bg-gray-100 h-full">
      <div className="p-6 rounded-xl bg-white shadow-sm">
        <h2 className="sticky top-0 z-10 text-3xl mb-4">User Details</h2>
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
                <label className="">{label}</label>
                <input
                  type="text"
                  value={value}
                  disabled
                  className="border border-gray-400 rounded-xl p-3 text-gray-600 bg-white"
                />
              </div>
            ))}
            <div className="flex justify-end mt-2">
              <div className="gap-3 flex">
                <button
                  type="button"
                  onClick={handleActivateUser}
                  className={`text-lg px-3 py-2 rounded-xl font-medium  ${isBlacklisted ? "bg-green-500 hover:bg-green-600 text-white" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`}
                >
                  Activate User
                </button>
                <button
                  type="button"
                  onClick={handleBlacklistUser}
                  className={`text-lg px-3 py-2 rounded-xl font-medium  ${isBlacklisted ? "bg-gray-400 text-gray-200 cursor-not-allowed" : "bg-red-500 hover:bg-red-600 text-white"}`}
                >
                  Blacklist User
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
