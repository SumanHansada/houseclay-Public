"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { generateUUID } from "@/common/utils";
import PropertyTypeOptions from "@/components/PropertyTypeOptions";
import { clearFormData, setPropertyID } from "@/store/listPropertySlice";
import { RootState } from "@/store/store";

const ListPropertyPage = () => {
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
    if (!propertyCategory) {
      console.error("Property type is not selected");
      return;
    }
    const uuid = generateUUID();
    dispatch(setPropertyID(uuid));
    const url = `/admin/list-property/${userPhoneNo}/${propertyCategory.toLowerCase()}/${uuid}/property-details`;
    console.log("Navigating to URL:", url);
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

export default ListPropertyPage;
