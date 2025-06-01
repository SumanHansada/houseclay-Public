import { User } from "lucide-react";
import React from "react";

interface UserCardProps {
  avatar?: string;
  name: string;
  email: string;
}

export const UserCard = ({ avatar, name, email }: UserCardProps) => {
  return (
    <div className="flex items-center justify-start w-4/5 gap-2 p-1">
      <div className="w-10 h-10 overflow-hidden bg-gray-200 rounded-lg">
        {avatar && avatar.trim() !== "" ? (
          <img
            src={avatar}
            alt={name + "avatar"}
            className="object-cover w-full h-full"
          />
        ) : (
          <User className="object-cover w-full h-full" />
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-xl/6 font-medium">{name}</span>
        <span className="text-sm/5 text-gray-600">{email}</span>
      </div>
    </div>
  );
};
