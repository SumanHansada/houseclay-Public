interface UserStatusProps {
  isBlacklisted: boolean;
}

export const UserStatus: React.FC<UserStatusProps> = ({ isBlacklisted }) => {
  return (
    <div>
      {isBlacklisted ? (
        <div className="bg-red-400 border border-red-900 text-red-900 px-4 py-1 rounded-full w-fit">
          Blocked
        </div>
      ) : (
        <div className="bg-green-400 border border-green-900 text-green-900 px-4 py-1 rounded-full w-fit">
          Active
        </div>
      )}
    </div>
  );
};
