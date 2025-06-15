"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { RootState } from "@/store/store";

const ProfilePage: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [isBlacklisted, setIsBlacklisted] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser) {
      setIsBlacklisted(currentUser.blacklisted);
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <span className="text-gray-500">Loading user details…</span>
      </div>
    );
  }

  const { name, email, phoneNo, createdAt } = currentUser;
  const currentStatus = isBlacklisted
    ? "The user is blacklisted"
    : "The user is active";

  const handleBlacklistUser = () => {
    // call your blacklist API…
    setIsBlacklisted(true);
  };
  const handleActivateUser = () => {
    // call your activate API…
    setIsBlacklisted(false);
  };

  return (
    <div className="px-16 py-6 bg-gray-100 h-full">
      <div className="p-4 rounded-xl bg-white shadow-sm flex flex-col gap-5">
        <h2 className="text-3xl">User Details</h2>
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
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={handleActivateUser}
                className={`text-lg px-3 py-2 rounded-xl font-medium ${
                  isBlacklisted
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
              >
                Activate User
              </button>
              <button
                type="button"
                onClick={handleBlacklistUser}
                className={`ml-3 text-lg px-3 py-2 rounded-xl font-medium ${
                  isBlacklisted
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600 text-white"
                }`}
              >
                Blacklist User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
