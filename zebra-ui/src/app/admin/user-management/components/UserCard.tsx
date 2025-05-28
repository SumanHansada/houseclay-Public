import React from "react";

interface UserCardProps {
  avatar?: string;
  name: string;
  email: string;
}

export const UserCard = ({ avatar, name, email }: UserCardProps) => {
  const src =
    avatar && avatar.trim() !== "" ? avatar : "/icons/default/user-avatar.svg";
  return (
    <div className="flex items-center justify-start w-4/5 gap-3 p-1">
      <div className="w-10 h-10 overflow-hidden bg-gray-400 rounded-full">
        <img
          src={src}
          alt={name + "avatar"}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex flex-col">
        <span>{name}</span>
        <span>{email}</span>
      </div>
    </div>
  );
};
