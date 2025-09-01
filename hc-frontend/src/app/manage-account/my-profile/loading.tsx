// app/manage-account/my-profile/loading.tsx
import Skeleton from "react-loading-skeleton";

export default function Loading() {
  return (
    <>
      {/* Mobile */}
      <section className="md:hidden">
        {/* Sticky-like header */}
        <div className="fixed top-0 left-0 right-0 z-50 h-[55px] border-b border-gray-200 bg-white flex items-center px-4">
          <Skeleton height={22} width={120} />
          <div className="ml-auto">
            <Skeleton circle height={36} width={36} />
          </div>
        </div>

        <div className="pt-[70px] pb-20 px-8">
          {/* Avatar */}
          <div className="flex flex-col items-center py-6">
            <Skeleton circle height={144} width={144} />
          </div>

          {/* Display rows */}
          <div className="space-y-4">
            {/* Name */}
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-3">
              <div className="flex-1">
                <Skeleton width={80} height={14} />
                <div className="mt-1">
                  <Skeleton width={"70%"} height={18} />
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-3">
              <div className="flex-1">
                <Skeleton width={110} height={14} />
                <div className="mt-1">
                  <Skeleton width={"60%"} height={18} />
                </div>
              </div>
              <div className="shrink-0 pt-4">
                <Skeleton width={88} height={18} />
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-3">
              <div className="flex-1">
                <Skeleton width={160} height={14} />
                <div className="mt-1">
                  <Skeleton width={80} height={18} />
                </div>
              </div>
              <div className="shrink-0 pt-3">
                {/* toggle */}
                <Skeleton width={40} height={22} borderRadius={999} />
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-3">
              <div className="flex-1">
                <Skeleton width={60} height={14} />
                <div className="mt-1">
                  <Skeleton width={"75%"} height={18} />
                </div>
              </div>
              <div className="shrink-0 pt-4">
                <Skeleton width={88} height={18} />
              </div>
            </div>

            {/* Email verify incentive card/button placeholder */}
            <div className="mt-4">
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                <div className="flex items-center gap-3">
                  <Skeleton circle width={28} height={28} />
                  <Skeleton width={"60%"} height={16} />
                </div>
                <div className="mt-3">
                  <Skeleton width={160} height={36} borderRadius={8} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Desktop */}
      <section className="max-md:hidden">
        {/* Page title row (matches DesktopClient header area inside main) */}
        <div className="border-b-2 pb-2 flex items-center justify-between mb-8">
          <Skeleton width={140} height={24} />
          <Skeleton width={84} height={36} borderRadius={8} />
        </div>

        <div className="flex flex-col lg:flex-row lg:gap-6 xl:gap-10 2xl:gap-20 space-y-8 lg:space-y-0">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <Skeleton circle height={160} width={160} />
          </div>

          {/* Right side form body */}
          <div className="flex-1 space-y-6">
            {/* Name */}
            <div className="space-y-2 w-2/3">
              <Skeleton width={60} height={14} />
              <Skeleton height={44} />
            </div>

            {/* Phone + WhatsApp */}
            <div className="mt-1 flex flex-col lg:flex-row items-end lg:items-center justify-between lg:gap-4">
              <div className="flex flex-col w-full lg:w-fit 2xl:w-3/4">
                <Skeleton width={110} height={14} />
                <div className="mt-1">
                  <Skeleton height={44} width={320} />
                </div>
                <div className="mt-2">
                  <Skeleton width={100} height={18} />
                </div>
              </div>

              {/* WhatsApp toggle */}
              <div className="flex items-center gap-3 mt-4 lg:mt-0">
                <Skeleton circle width={40} height={40} />
                <Skeleton width={150} height={18} />
                <Skeleton width={44} height={24} borderRadius={999} />
              </div>
            </div>

            {/* Email + verify section */}
            <div className="space-y-3 w-2/3">
              <Skeleton width={48} height={14} />
              <Skeleton height={44} />
              <div className="space-y-4">
                <Skeleton width={130} height={18} />
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 max-w-md">
                  <div className="flex items-center gap-3">
                    <Skeleton circle width={28} height={28} />
                    <Skeleton width={"60%"} height={16} />
                  </div>
                  <div className="mt-3">
                    <Skeleton width={180} height={40} borderRadius={8} />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 border-t-2 pt-4 flex justify-between shadow-sm">
              <Skeleton width={100} height={40} borderRadius={8} />
              <Skeleton width={120} height={40} borderRadius={8} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
