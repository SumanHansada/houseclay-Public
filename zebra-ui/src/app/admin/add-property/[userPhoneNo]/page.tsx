"use client";

import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import PropertyTypeOptions from "@/components/PropertyTypeOptions";
import { RootState } from "@/store/store";

const AddPropertyPage = () => {
  const { userPhoneNo } = useParams() as { userPhoneNo: string };
  const { propertyType } = useSelector(
    (state: RootState) => state.listProperty,
  );
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  const handlePostListingClick = () => {
    const url = `/admin/add-property/${userPhoneNo}/${propertyType.toLowerCase()}`;
    router.push(url);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] items-center justify-center">
      <div className="border border-red-500 rounded-xl p-8 text-2xl w-3/5">
        <PropertyTypeOptions
          isMobile={false}
          onNext={handlePostListingClick}
          onBack={handleBack}
        />
      </div>
    </div>
  );
};

export default AddPropertyPage;
