import { User } from "lucide-react";
import React from "react";

interface UserCardProps {
  avatar?: string;
  name: string;
  email: string;
  viewProfile: () => void;
}

export const UserCard = ({
  avatar,
  name,
  email,
  viewProfile,
}: UserCardProps) => {
  return (
    <div
      className="group flex items-center justify-start pt-1 w-3/5 gap-2 rounded-xl hover:cursor-pointer hover:shadow-md transition-colors"
      onClick={viewProfile}
    >
      <div className="w-10 h-10 overflow-hidden bg-gray-200 rounded-lg">
        {avatar?.trim() ? (
          <img
            src={avatar}
            alt={`${name} avatar`}
            className="object-cover w-full h-full"
          />
        ) : (
          <User className="object-cover w-full h-full" />
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-xl/6 font-medium group-hover:underline">
          {name}
        </span>
        <span className="text-sm/5 text-gray-600">{email}</span>
      </div>
    </div>
  );
};
