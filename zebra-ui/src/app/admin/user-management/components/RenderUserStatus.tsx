interface RenderUserStatusProps {
  isBlacklisted: boolean;
}

export const RenderUserStatus: React.FC<RenderUserStatusProps> = ({
  isBlacklisted,
}) => {
  return (
    <div className="p-px">
      {isBlacklisted ? (
        <div className="bg-red-200 border border-red-900 text-red-900 px-3 py-1 rounded-full w-fit">
          Blocked
        </div>
      ) : (
        <div className="bg-green-200 border border-green-900 text-green-900 px-3 py-1 rounded-full w-fit">
          Active
        </div>
      )}
    </div>
  );
};
