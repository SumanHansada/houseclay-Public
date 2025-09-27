import "react-loading-skeleton/dist/skeleton.css";

import { ChevronLeft, Crown, Heart, Share } from "lucide-react";
import Skeleton from "react-loading-skeleton";

const PhotoGallerySkeleton = ({ className = "" }: { className?: string }) => (
  <div className={`bg-gray-200 ${className}`}>
    <Skeleton height="100%" width="100%" borderRadius={12} />
  </div>
);

const PropertyDetailItemSkeleton = () => (
  <div className="flex gap-3">
    <div className="w-8 h-8 flex items-center justify-center">
      <Skeleton height={24} width={24} borderRadius={4} />
    </div>
    <div className="flex-1">
      <Skeleton height={14} width="60%" className="mb-1" />
      <Skeleton height={16} width="80%" />
    </div>
  </div>
);

const PropertyCardSkeleton = () => (
  <div className="border rounded-xl shadow-md px-4 py-6">
    <div className="grid grid-cols-2 gap-4 justify-items-center items-center mb-4 divide-x">
      <div className="flex w-full justify-start items-start gap-2">
        <div className="p-0.5">
          <Skeleton height={20} width={20} borderRadius={4} />
        </div>
        <div className="flex-col">
          <Skeleton height={12} width={80} className="mb-1" />
          <Skeleton height={14} width={60} />
        </div>
      </div>
      <div className="flex w-full justify-start items-start gap-2 pl-2">
        <div className="p-0.5">
          <Skeleton height={20} width={20} borderRadius={4} />
        </div>
        <div className="flex-col">
          <Skeleton height={12} width={80} className="mb-1" />
          <Skeleton height={14} width={60} />
        </div>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4 justify-items-center items-center mb-4 divide-x">
      <div className="flex w-full justify-start items-start gap-2">
        <div className="p-0.5">
          <Skeleton height={20} width={20} borderRadius={4} />
        </div>
        <div className="flex-col">
          <Skeleton height={12} width={80} className="mb-1" />
          <Skeleton height={14} width={60} />
        </div>
      </div>
      <div className="flex w-full justify-start items-start gap-2 pl-2">
        <div className="p-0.5">
          <Skeleton height={20} width={20} borderRadius={4} />
        </div>
        <div className="flex-col">
          <Skeleton height={12} width={80} className="mb-1" />
          <Skeleton height={14} width={60} />
        </div>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4 justify-items-center items-center mb-4 divide-x">
      <div className="flex w-full justify-start items-start gap-2">
        <div className="p-0.5">
          <Skeleton height={20} width={20} borderRadius={4} />
        </div>
        <div className="flex-col">
          <Skeleton height={12} width={80} className="mb-1" />
          <Skeleton height={14} width={60} />
        </div>
      </div>
      <div className="flex w-full justify-start items-start gap-2 pl-2">
        <div className="p-0.5">
          <Skeleton height={20} width={20} borderRadius={4} />
        </div>
        <div className="flex-col">
          <Skeleton height={12} width={80} className="mb-1" />
          <Skeleton height={14} width={60} />
        </div>
      </div>
    </div>
    <hr className="my-6" />
    <div className="flex justify-between items-center mb-4">
      <Skeleton height={16} width={60} />
      <Skeleton height={20} width={120} />
    </div>
    <Skeleton height={48} width="100%" borderRadius={12} />
  </div>
);

const ActivityCardSkeleton = () => (
  <div className="bg-white border rounded-xl px-4 py-6 mb-6">
    <Skeleton height={24} width={200} className="mb-4" />
    <div className="grid grid-cols-3 gap-4 divide-x">
      <div className="flex flex-col items-start gap-3">
        <Skeleton height={24} width={24} borderRadius={4} />
        <div className="text-start">
          <Skeleton height={20} width={40} className="mb-1" />
          <Skeleton height={14} width={80} />
        </div>
      </div>
      <div className="flex flex-col items-start gap-3 pl-4">
        <Skeleton height={24} width={24} borderRadius={4} />
        <div className="text-start">
          <Skeleton height={20} width={20} className="mb-1" />
          <Skeleton height={14} width={70} />
        </div>
      </div>
      <div className="flex flex-col items-start gap-3 pl-4">
        <Skeleton height={24} width={24} borderRadius={4} />
        <div className="text-start">
          <Skeleton height={20} width={30} className="mb-1" />
          <Skeleton height={14} width={80} />
        </div>
      </div>
    </div>
  </div>
);

export default function Loading() {
  return (
    <>
      {/* Mobile Header - matches PropertyDetailsClient mobile header */}
      <section className="py-2 px-4 fixed top-0 left-0 right-0 z-50 h-[55px] border-b border-gray-200 bg-white flex gap-2 justify-between items-center w-full md:hidden">
        <button className="rounded-full md:border-none items-center justify-center">
          <ChevronLeft size={25} />
        </button>
        <div className="flex gap-2 items-center">
          <button className="rounded-full border md:border-none items-center justify-center p-2 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 fill-current">
            <Crown size={18} />
          </button>
          <button className="rounded-full border md:border-none items-center justify-center p-2">
            <Share size={18} />
          </button>
          <button className="rounded-full border md:border-none items-center justify-center p-2">
            <Heart size={18} />
          </button>
        </div>
      </section>

      <section className="overflow-y-auto overflow-x-hidden flex-grow max-h-svh scroll-smooth max-md:pb-16">
        {/* Photo Gallery Section Mobile */}
        <section className="h-60 w-full md:hidden">
          <PhotoGallerySkeleton className="h-60" />
        </section>

        <section className="flex-col w-full xl:gap-16 lg:gap-8 md:gap-0 gap-0 xl:px-28 lg:px-14 md:px-8 px-6 max-md:pt-4 max-md:pb-20">
          {/* Header Section */}
          <section className="py-6 max-md:py-2 mx-auto">
            {/* Breadcrumb and Actions Section */}
            <div className="flex justify-between items-center py-2 max-md:hidden">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Skeleton height={16} width={16} borderRadius={4} />
                <Skeleton height={14} width={120} />
                <Skeleton height={14} width={8} />
                <Skeleton height={14} width={60} />
                <Skeleton height={14} width={8} />
                <Skeleton height={14} width={100} />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 max-md:hidden">
                <Skeleton height={32} width={80} borderRadius={6} />
                <Skeleton height={32} width={80} borderRadius={6} />
              </div>
            </div>

            <div className="md:hidden">
              <div className="flex justify-between items-center mb-2">
                <Skeleton height={24} width={80} borderRadius={12} />
                <Skeleton height={16} width={120} />
              </div>
            </div>
            <div>
              <Skeleton height={32} width="90%" className="mb-2" />
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-base mt-2">
              <Skeleton height={16} width={16} borderRadius={4} />
              <Skeleton height={16} width={200} />
            </div>
          </section>

          {/* Photo Gallery Section Desktop */}
          <section className="mb-8 max-md:hidden">
            <PhotoGallerySkeleton className="h-[60vh] rounded-xl" />
          </section>

          {/* Main Content Section Desktop*/}
          <section className="flex w-full xl:gap-16 lg:gap-8 md:gap-8 gap-0 max-md:pt-4 max-md:hidden">
            {/* Left Section - 3/4 width */}
            <section className="md:w-1/2 lg:w-3/5 2xl:w-3/4 max-md:w-full">
              {/* Property Details Grid */}
              <section className="bg-white p-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <PropertyDetailItemSkeleton />
                    <PropertyDetailItemSkeleton />
                    <PropertyDetailItemSkeleton />
                    <PropertyDetailItemSkeleton />
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <PropertyDetailItemSkeleton />
                    <PropertyDetailItemSkeleton />
                    <PropertyDetailItemSkeleton />
                  </div>
                </div>
              </section>

              {/* Description Section */}
              <section className="py-6">
                <Skeleton height={24} width={120} className="mb-4" />
                <div className="space-y-4">
                  <Skeleton height={16} width="100%" />
                  <Skeleton height={16} width="95%" />
                  <Skeleton height={16} width="90%" />
                  <Skeleton height={16} width="85%" />
                  <Skeleton height={16} width={100} />
                </div>
              </section>
              <hr />
              {/* Amenities Section */}
              <section className="py-6 mb-6">
                <Skeleton height={24} width={200} className="mb-4" />
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Skeleton height={16} width={16} borderRadius={4} />
                      <Skeleton height={14} width={80} />
                    </div>
                  ))}
                </div>
              </section>
              <hr />
              {/* Map Section */}
              <section className="py-6 mb-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
                  <Skeleton height={24} width={150} className="mb-4" />
                  <div className="flex items-center gap-2 mb-4">
                    <Skeleton height={16} width={16} borderRadius={4} />
                    <Skeleton height={16} width={120} />
                  </div>
                </div>
                <div className="flex gap-2 mb-4">
                  <div className="flex-1">
                    <Skeleton height={40} width="100%" borderRadius={8} />
                  </div>
                  <Skeleton height={40} width={120} borderRadius={8} />
                </div>
                <div className="w-full h-96 rounded-lg overflow-hidden">
                  <Skeleton height="100%" width="100%" borderRadius={12} />
                </div>
              </section>
            </section>

            {/* Right Section - 1/4 width */}
            <section className="md:w-1/2 lg:w-2/5 2xl:w-1/3 max-md:w-full">
              <PropertyCardSkeleton />
              <ActivityCardSkeleton />
              <section className="flex flex-col justify-between items-center gap-4">
                <Skeleton height={48} width="100%" borderRadius={12} />
                <Skeleton height={16} width={120} />
              </section>
            </section>
          </section>

          {/* Main Content Section Mobile*/}
          <section className="flex-col w-full xl:gap-16 lg:gap-8 md:gap-0 gap-0 max-md:pt-4 md:hidden">
            {/* Property Details Section */}
            <PropertyCardSkeleton />

            {/* Description Section */}
            <section className="py-6">
              <Skeleton height={24} width={120} className="mb-4" />
              <div className="space-y-4">
                <Skeleton height={16} width="100%" />
                <Skeleton height={16} width="95%" />
                <Skeleton height={16} width="90%" />
                <Skeleton height={16} width={100} />
              </div>
            </section>

            {/* Property Details Grid */}
            <section className="bg-white px-4 py-6 border rounded-xl shadow-md">
              <Skeleton height={24} width={120} className="mb-4" />
              <div className="grid grid-cols-2 gap-2 divide-x mb-2">
                <div className="flex w-full justify-start items-start gap-2">
                  <div className="p-0.5">
                    <Skeleton height={20} width={20} borderRadius={4} />
                  </div>
                  <div className="flex-col">
                    <Skeleton height={12} width={80} className="mb-1" />
                    <Skeleton height={14} width={60} />
                  </div>
                </div>
                <div className="flex w-full justify-start items-start gap-2 pl-2">
                  <div className="p-0.5">
                    <Skeleton height={20} width={20} borderRadius={4} />
                  </div>
                  <div className="flex-col">
                    <Skeleton height={12} width={80} className="mb-1" />
                    <Skeleton height={14} width={60} />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 divide-x mb-2">
                <div className="flex w-full justify-start items-start gap-2">
                  <div className="p-0.5">
                    <Skeleton height={20} width={20} borderRadius={4} />
                  </div>
                  <div className="flex-col">
                    <Skeleton height={12} width={80} className="mb-1" />
                    <Skeleton height={14} width={60} />
                  </div>
                </div>
                <div className="flex w-full justify-start items-start gap-2 pl-2">
                  <div className="p-0.5">
                    <Skeleton height={20} width={20} borderRadius={4} />
                  </div>
                  <div className="flex-col">
                    <Skeleton height={12} width={80} className="mb-1" />
                    <Skeleton height={14} width={60} />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 divide-x mb-2">
                <div className="flex w-full justify-start items-start gap-2">
                  <div className="p-0.5">
                    <Skeleton height={20} width={20} borderRadius={4} />
                  </div>
                  <div className="flex-col">
                    <Skeleton height={12} width={80} className="mb-1" />
                    <Skeleton height={14} width={60} />
                  </div>
                </div>
                <div className="flex w-full justify-start items-start gap-2 pl-2">
                  <div className="p-0.5">
                    <Skeleton height={20} width={20} borderRadius={4} />
                  </div>
                  <div className="flex-col">
                    <Skeleton height={12} width={80} className="mb-1" />
                    <Skeleton height={14} width={60} />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 divide-x mb-2">
                <div className="flex w-full justify-start items-start gap-2">
                  <div className="p-0.5">
                    <Skeleton height={20} width={20} borderRadius={4} />
                  </div>
                  <div className="flex-col">
                    <Skeleton height={12} width={80} className="mb-1" />
                    <Skeleton height={14} width={60} />
                  </div>
                </div>
              </div>
            </section>

            {/* Amenities Section */}
            <section className="py-6">
              <Skeleton height={24} width={200} className="mb-4" />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton height={16} width={16} borderRadius={4} />
                    <Skeleton height={14} width={80} />
                  </div>
                ))}
              </div>
            </section>

            {/* Map Section */}
            <section className="py-6">
              <div className="flex justify-between items-center mb-6">
                <Skeleton height={24} width={150} className="mb-4" />
                <div className="flex items-center gap-2 mb-4">
                  <Skeleton height={16} width={16} borderRadius={4} />
                  <Skeleton height={16} width={120} />
                </div>
              </div>
              <div className="flex gap-2 mb-4">
                <div className="flex-1">
                  <Skeleton height={40} width="100%" borderRadius={8} />
                </div>
                <Skeleton height={40} width={120} borderRadius={8} />
              </div>
              <div className="w-full h-96 rounded-lg overflow-hidden">
                <Skeleton height="100%" width="100%" borderRadius={12} />
              </div>
            </section>

            {/* Activity On This Property */}
            <section className="bg-white border rounded-xl px-4 py-6 mb-6">
              <Skeleton height={24} width={200} className="mb-4" />
              <div className="grid grid-cols-3 gap-4 divide-x">
                <div className="flex flex-col items-start gap-1">
                  <div className="flex items-center gap-2">
                    <Skeleton height={20} width={20} borderRadius={4} />
                    <Skeleton height={20} width={30} />
                  </div>
                  <div className="text-start">
                    <Skeleton height={12} width={80} />
                  </div>
                </div>
                <div className="flex flex-col items-start gap-1 pl-2">
                  <div className="flex items-center gap-2">
                    <Skeleton height={20} width={20} borderRadius={4} />
                    <Skeleton height={20} width={20} />
                  </div>
                  <div className="text-start">
                    <Skeleton height={12} width={70} />
                  </div>
                </div>
                <div className="flex flex-col items-start gap-1 pl-2">
                  <div className="flex items-center gap-2">
                    <Skeleton height={20} width={20} borderRadius={4} />
                    <Skeleton height={20} width={30} />
                  </div>
                  <div className="text-start">
                    <Skeleton height={12} width={80} />
                  </div>
                </div>
              </div>
            </section>

            {/* Exclusive listing & Report this listing */}
            <section className="flex flex-col justify-between items-center gap-4">
              <Skeleton height={48} width="100%" borderRadius={12} />
              <Skeleton height={16} width={120} />
            </section>

            {/* Contact Owner Section */}
            <section className="fixed bottom-0 left-0 md:hidden right-0 flex justify-between py-2 mx-auto xl:px-28 lg:px-14 md:px-8 px-6 border-t border-t-gray-300 bg-white">
              <div className="flex-col justify-between items-center w-full">
                <Skeleton height={12} width={40} className="mb-1" />
                <Skeleton height={18} width={80} />
              </div>
              <Skeleton height={48} width="100%" borderRadius={12} />
            </section>
          </section>
        </section>
      </section>
    </>
  );
}
