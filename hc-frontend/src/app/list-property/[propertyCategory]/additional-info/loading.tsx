import React from "react";
import Skeleton from "react-loading-skeleton";

interface AdditionalInfoLoadingProps {
  formType?: string;
  className?: string;
}

export default function AdditionalInfoLoading({
  formType = "rentForm", // Defaults to rent form
  className = "",
}: AdditionalInfoLoadingProps) {
  // Determine what to render based on form type
  const isResaleForm = formType === "resaleForm";
  const isRentOrFlatmatesForm =
    formType === "rentForm" || formType === "flatmatesForm";

  // Skeleton for a form field with label
  const FormFieldSkeleton = () => (
    <div className="flex flex-col gap-2 mb-2">
      <Skeleton width={150} height={20} />
      <Skeleton height={40} borderRadius={8} />
    </div>
  );

  return (
    <div className={className}>
      {/* Page header */}
      <div className="mb-8">
        <Skeleton width={400} height={36} />
      </div>

      {/* Form content */}
      <div>
        {isRentOrFlatmatesForm && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="col-span-1">
              <FormFieldSkeleton />
            </div>
            <div className="col-span-1">
              <FormFieldSkeleton />
            </div>
          </div>
        )}

        {isResaleForm && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="col-span-1">
                <FormFieldSkeleton />
              </div>
              <div className="col-span-1">
                <FormFieldSkeleton />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="col-span-1">
                <FormFieldSkeleton />
              </div>
              <div className="col-span-1">
                <FormFieldSkeleton />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
