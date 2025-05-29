interface UserStatusProps {
  isBlacklisted: boolean;
}

export const UserStatus: React.FC<UserStatusProps> = ({ isBlacklisted }) => {
  return (
    <div>
      {isBlacklisted ? (
        <div className="bg-red-300 border border-red-800 text-red-800 px-4 py-1 rounded-full w-fit">
          Blocked
        </div>
      ) : (
        <div className="bg-green-300 border border-green-800 text-green-800 px-4 py-1 rounded-full w-fit">
          Active
        </div>
      )}
    </div>
  );
};
