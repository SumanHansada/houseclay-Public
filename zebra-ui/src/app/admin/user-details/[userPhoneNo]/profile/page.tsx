"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import { useGetUserByPhoneNoQuery } from "@/store/apiSlice";

const ProfilePage: React.FC = () => {
  const { userPhoneNo } = useParams() as { userPhoneNo: string };
  const { data } = useGetUserByPhoneNoQuery({ phoneNo: userPhoneNo });

  // const [updateBlacklist, { isLoading: isUpdating }] = useUpdateUserBlacklistMutation();

  const currentUser = data!.user;
  const [isBlacklisted, setIsBlacklisted] = useState<boolean>(
    currentUser.blacklisted,
  );

  useEffect(() => {
    if (currentUser) {
      setIsBlacklisted(currentUser.blacklisted);
    }
  }, [currentUser]);

  const handleBlacklistUser = () => {
    // updateUserBlacklist({ phoneNo: user.phoneNo, blacklisted: true });
    setIsBlacklisted(true);
  };

  const handleActivateUser = () => {
    // updateUserBlacklist({ phoneNo: user.phoneNo, blacklisted: false });
    setIsBlacklisted(false);
  };

  const { name, email, phoneNo, createdAt } = currentUser;
  const currentStatus = isBlacklisted
    ? "The user is blacklisted"
    : "The user is active";

  return (
    <div className="px-16 py-8 bg-gray-100 h-full">
      <div className="p-5 rounded-xl bg-white shadow-sm flex flex-col gap-4">
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
