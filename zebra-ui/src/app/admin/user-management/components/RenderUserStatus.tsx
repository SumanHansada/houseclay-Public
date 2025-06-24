interface RenderUserStatusProps {
  isBlacklisted: boolean;
}

export const RenderUserStatus: React.FC<RenderUserStatusProps> = ({
  isBlacklisted,
}) => {
  return (
    <div className="p-px">
      {isBlacklisted ? (
        <div className="px-[10px] py-[4px] bg-red-200 border border-red-900 text-red-900 rounded-full w-fit">
          Blocked
        </div>
      ) : (
        <div className="px-[10px] py-[4px] bg-green-200 border border-green-900 text-green-900 rounded-full w-fit">
          Active
        </div>
      )}
    </div>
  );
};
