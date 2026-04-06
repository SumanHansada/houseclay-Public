"use client";

import { useGetPropertyByIdQuery } from "@/store/apiSlice";

import { OwnerDetails } from "../../components/OwnerDetails";

const updateTypeColors: Record<string, string> = {
  CREATE: "bg-blue-500",
  VERIFIED: "bg-green-500",
  DEACTIVATE: "bg-red-500",
  UPDATE: "bg-gray-400",
  ROUTINE_CHECK: "bg-yellow-500",
};

interface Props {
  propertyID: string;
}

export const OwnerDetailsView = ({ propertyID }: Props) => {
  const { data: currentProperty } = useGetPropertyByIdQuery({
    propertyID: propertyID,
  });
  const ownerDetails = currentProperty!.owner;
  const propertyUpdates = currentProperty!.propertyUpdates;

  const sortedUpdates = [...propertyUpdates].sort(
    (a, b) =>
      new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime(),
  );

  return (
    <div className="h-full bg-gray-100 flex flex-col overflow-auto px-16 py-8">
      <div className="flex-1 flex flex-col gap-5">
        {/* Owner Info */}
        <div className="p-5 rounded-xl bg-white shadow-sm flex flex-col gap-4">
          <OwnerDetails currentUser={ownerDetails} />
        </div>

        {/* Property Update Timeline */}
        {sortedUpdates.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Property Updates ({sortedUpdates.length})
            </h2>
            <div className="flex flex-col">
              {sortedUpdates.map((update, index) => {
                const dotColor =
                  updateTypeColors[update.updateType] ?? "bg-gray-400";
                const isLast = index === sortedUpdates.length - 1;

                return (
                  <div key={index} className="flex gap-4">
                    {/* Timeline line + dot */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 ${dotColor}`}
                      />
                      {!isLast && (
                        <div className="w-px flex-1 bg-gray-200 my-1" />
                      )}
                    </div>

                    {/* Content */}
                    <div className={`pb-5 ${isLast ? "" : ""}`}>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold text-gray-900">
                          {update.updateType}
                        </span>
                        <span className="text-gray-400">&middot;</span>
                        <span className="text-gray-500">
                          {new Date(update.updateTime).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mt-0.5">
                        {update.updateBy && (
                          <span>
                            by {update.updateBy}
                            {update.userType && (
                              <span className="text-gray-400 ml-1">
                                [{update.userType}]
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                      {update.comment && (
                        <p className="text-sm text-gray-500 mt-1 italic">
                          &quot;{update.comment}&quot;
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
