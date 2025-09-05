import "react-loading-skeleton/dist/skeleton.css";

import { ChevronLeft } from "lucide-react";
import Skeleton from "react-loading-skeleton";

const ConnectsBundleCardSkeleton = ({
  isMobile = false,
}: {
  isMobile?: boolean;
}) => (
  <div
    className={`relative w-full rounded-xl p-6 ${
      isMobile ? "rounded-lg p-4 border-2 border-gray-200" : "h-[26rem]"
    }`}
  >
    {/* Recommended Badge Skeleton */}
    <div
      className={`absolute ${isMobile ? "-top-2 left-4" : "-top-3 left-1/2 transform -translate-x-1/2"}`}
    >
      <Skeleton
        width={isMobile ? 60 : 80}
        height={isMobile ? 20 : 24}
        borderRadius={20}
        className="bg-red-100"
      />
    </div>

    {/* Radio Button Skeleton */}
    <div className="w-6 h-6 mb-4 rounded-full border-2 border-gray-300 bg-gray-200" />

    {/* Title Skeletons */}
    <Skeleton height={32} width="60%" className="mb-2" />
    <Skeleton height={32} width="80%" className="mb-4" />

    {/* Connects Info Skeleton */}
    <div className="flex items-center gap-1 rounded-full mb-4">
      <Skeleton circle width={24} height={24} />
      <Skeleton height={16} width={80} />
    </div>

    {/* Price Skeletons */}
    <div className="flex mb-2">
      <Skeleton height={20} width={120} />
    </div>
    <div className="flex">
      <Skeleton height={32} width={140} className="mb-4" />
    </div>

    {/* Discount Badge Skeleton */}
    <div className="flex items-center justify-between mb-8">
      <Skeleton height={24} width={60} borderRadius={12} />
    </div>

    {/* Validity Skeleton */}
    <div className="flex items-center gap-1">
      <Skeleton height={12} width={50} />
      <Skeleton height={16} width={80} />
    </div>
  </div>
);

const PurchaseSummarySkeleton = ({
  isMobile = false,
}: {
  isMobile?: boolean;
}) => (
  <div
    className={`bg-white rounded-lg ${isMobile ? "p-4 shadow-lg" : "sticky"}`}
  >
    <div className="space-y-4 mb-6">
      {/* Account Charge */}
      <div className="flex justify-between">
        <Skeleton height={16} width={120} />
        <Skeleton height={16} width={100} />
      </div>

      {/* New Balance */}
      <div className="flex justify-between">
        <Skeleton height={16} width={140} />
        <div className="flex items-center gap-1">
          <Skeleton circle width={24} height={24} />
          <Skeleton height={16} width={80} />
        </div>
      </div>

      {/* Expiry Date */}
      <div className="flex justify-between">
        <Skeleton height={16} width={100} />
        <Skeleton height={16} width={120} />
      </div>

      {/* Total Amount */}
      <div className="border-t pt-4">
        <div className="flex justify-between">
          <Skeleton height={20} width={100} />
          <Skeleton height={20} width={80} />
        </div>
      </div>
    </div>

    {/* Info Box Skeleton */}
    <div className="bg-gray-50 rounded-lg p-4 mb-6">
      <Skeleton height={14} width="100%" className="mb-2" />
      <Skeleton height={14} width="80%" className="mb-2" />
      <Skeleton height={14} width={60} />
    </div>

    {/* Terms Checkbox Skeleton */}
    <div className="mb-6">
      <Skeleton height={14} width="100%" className="mb-4" />
      <div className="flex items-center gap-2">
        <Skeleton width={20} height={20} borderRadius={4} />
        <Skeleton height={14} width={200} />
      </div>
    </div>

    <hr className="mb-6" />

    {/* Action Buttons Skeleton */}
    <div className={`flex ${isMobile ? "gap-3" : "justify-between gap-3"}`}>
      <Skeleton height={48} width={isMobile ? "100%" : 120} borderRadius={12} />
      <Skeleton height={48} width={isMobile ? "100%" : 140} borderRadius={12} />
    </div>
  </div>
);

export default function Loading() {
  return (
    <>
      {/* Desktop Layout */}
      <section className="w-full max-md:hidden">
        <div className="flex justify-between items-start xl:px-28 lg:px-14 md:px-14 px-8 py-12 gap-8 md:gap-8 xl:gap-8 2xl:gap-24 relative">
          <div className="relative w-2/3 max-xl:w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Skeleton height={36} width={200} />
              </div>
            </div>

            {/* Available Connects */}
            <div className="flex items-center gap-2 justify-between mb-6">
              <Skeleton height={20} width={180} />
              <div className="flex items-center gap-1 px-3 py-1 rounded-full">
                <Skeleton circle width={25} height={25} />
                <Skeleton height={20} width={100} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {/* Left Column - Bundle Selection */}
              <div className="lg:col-span-2">
                {/* Tabs Skeleton */}
                <div className="mb-8">
                  <div className="border-b border-gray-200">
                    <div className="flex">
                      <div className="px-6 py-3">
                        <Skeleton height={20} width={180} />
                      </div>
                      <div className="px-6 py-3">
                        <Skeleton height={20} width={160} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tab Content Skeleton */}
                <div>
                  <Skeleton height={32} width={300} className="mb-6" />

                  {/* Bundle Cards Grid */}
                  <div className="grid grid-cols-3 gap-8 md:gap-10 xl:gap-12">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <ConnectsBundleCardSkeleton key={i} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Purchase Summary */}
              <div className="lg:col-span-1">
                <PurchaseSummarySkeleton />
              </div>
            </div>
          </div>

          {/* Right Side Graphic Skeleton */}
          <div className="sticky top-8 w-1/3 max-xl:hidden">
            <Skeleton height={400} width="100%" borderRadius={12} />
          </div>
        </div>
      </section>

      {/* Mobile Layout */}
      <section className="md:hidden min-h-screen bg-gray-50">
        {/* Mobile Header */}
        <header className="fixed top-0 inset-x-0 z-50 h-[55px] border-b border-gray-200 bg-white">
          <div className="grid grid-cols-3 items-center h-full px-4">
            <button
              aria-label="Go back"
              className="justify-self-start rounded-full size-10 border flex items-center justify-center"
            >
              <ChevronLeft size={25} />
            </button>

            <div className="col-start-2 text-center">
              <Skeleton height={20} width={120} />
            </div>
          </div>
        </header>

        <div className="px-4 pt-16 pb-20">
          {/* Available Connects */}
          <div className="flex items-center justify-between mb-6">
            <Skeleton height={16} width={140} />
            <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
              <Skeleton circle width={20} height={20} />
              <Skeleton height={16} width={80} />
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <div className="flex w-full">
                <div className="flex-1 px-4 py-3 text-center">
                  <Skeleton height={16} width={60} />
                </div>
                <div className="flex-1 px-4 py-3 text-center">
                  <Skeleton height={16} width={50} />
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <div className="mt-4">
              <Skeleton height={24} width={200} className="mb-4" />

              {/* Mobile Bundle Cards */}
              <div className="grid-cols-3 space-y-4 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <ConnectsBundleCardSkeleton key={i} isMobile={true} />
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Purchase Summary */}
          <PurchaseSummarySkeleton isMobile={true} />
        </div>
      </section>
    </>
  );
}
