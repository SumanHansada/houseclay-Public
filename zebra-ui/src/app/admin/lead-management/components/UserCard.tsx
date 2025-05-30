import { Eye, User } from "lucide-react";
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
      className="group flex items-center justify-start pt-1 w-3/5 gap-2 rounded-xl hover:cursor-pointer hover:bg-white transition-colors"
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
      <Eye className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity mr-2" />
    </div>
  );
};

// export const UserCard = ({
//   avatar,
//   name,
//   email,
//   viewProfile,
// }: UserCardProps) => {
//   return (
//     <div className="flex items-center justify-start w-4/5 gap-2 p-1 hover:cursor-pointer">
//       <div
//         className="w-10 h-10 overflow-hidden bg-gray-200 rounded-lg"
//         onClick={viewProfile}
//       >
//         {avatar && avatar.trim() !== "" ? (
//           <img
//             src={avatar}
//             alt={name + "avatar"}
//             className="object-cover w-full h-full"
//           />
//         ) : (
//           <User className="object-cover w-full h-full" />
//         )}
//       </div>
//       <div className="flex flex-col">
//         <span className="text-xl/6 font-medium">{name}</span>
//         <span className="text-sm/5 text-gray-600">{email}</span>
//       </div>
//       {/* <button
//         onClick={viewProfile}
//         className="px-3 py-2 rounded-full cursor-pointer hover:bg-gray-300"
//       >
//         <Eye />
//       </button> */}
//     </div>
//   );
// };
