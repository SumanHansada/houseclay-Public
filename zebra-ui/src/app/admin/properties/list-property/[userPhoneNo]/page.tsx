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
    router.push(`/admin/users/${userPhoneNo}/profile`);
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
    const url = `/admin/properties/list-property/${userPhoneNo}/${propertyCategory.toLowerCase()}/property-details`;
    console.log("Navigating to URL:", url);
    router.push(url);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto items-center justify-center">
      <div className="border border-red-500 rounded-xl p-6 text-lg w-4/5 lg:w-2/3 xl:w-1/2">
        <PropertyTypeOptions
          onNext={handlePostListingClick}
          onBack={handleBack}
          backLabel="Back to Profile"
        />
      </div>
    </div>
  );
};

export default ListPropertyPage;
