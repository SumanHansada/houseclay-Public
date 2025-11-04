"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import PropertyTypeOptions from "@/components/PropertyTypeOptions";
import { clearFormData } from "@/store/listPropertySlice";
import { RootState } from "@/store/store";

const AddPropertyPage = () => {
  const { userPhoneNo } = useParams() as { userPhoneNo: string };
  const dispatch = useDispatch();
  const { propertyCategory } = useSelector(
    (state: RootState) => state.listProperty,
  );
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    dispatch(clearFormData());
  }, [dispatch]);

  const handlePostListingClick = () => {
    const url = `/admin/add-property/${userPhoneNo}/${propertyCategory.toLowerCase()}`;
    router.push(url);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] items-center justify-center">
      <div className="border border-red-500 rounded-xl p-6 text-lg w-1/2">
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
