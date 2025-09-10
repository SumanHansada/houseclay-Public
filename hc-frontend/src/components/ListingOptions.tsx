import { useDispatch, useSelector } from "react-redux";

import { PropertyListingType } from "@/common/enums";
import { setListingType } from "@/store/listPropertySlice";
import { RootState } from "@/store/store";
import { SvgIcon } from "@/utility-components";

import ListingOption from "./ListingOption";

interface ListingOptionsProps {
  isMobile?: boolean;
  onNext?: () => void;
}

const ListingOptions = ({ isMobile = false, onNext }: ListingOptionsProps) => {
  const dispatch = useDispatch();
  const listingType = useSelector(
    (state: RootState) => state.listProperty.listingType,
  );

  return (
    <div className="flex flex-col gap-8 h-full">
      <h1
        className={`${isMobile ? "text-2xl" : "lg:text-2xl text-xl lg:mb-8 mb-4"}`}
      >
        Select How You Want to List Your Property
      </h1>
      <legend className="sr-only">Listing Options</legend>
      <div className="flex flex-col gap-2">
        <ListingOption
          id="option-diy"
          icon={<SvgIcon iconSize="small" name="create-new-listing" />}
          iconColor="blue"
          title="Create a New Listing"
          description="Do it yourself in 5 easy steps"
          className={isMobile ? "py-4" : ""}
          isSelected={listingType === PropertyListingType.DIY}
          onChange={() => dispatch(setListingType(PropertyListingType.DIY))}
        />

        <ListingOption
          id="option-call"
          icon={<SvgIcon iconSize="small" name="call-with-captain" />}
          iconColor="green"
          title="Get on a Call with an Captain"
          description="Let us do it for you over a quick phone call"
          className={isMobile ? "py-4" : ""}
          isSelected={listingType === PropertyListingType.CALL}
          onChange={() => dispatch(setListingType(PropertyListingType.CALL))}
        />
      </div>

      <button
        type="button"
        className={`w-full bg-red-500 hover:bg-red-600 text-white lg:py-4 py-3 rounded-lg ${isMobile ? "lg:mt-4 font-medium transition duration-200 mt-auto" : "lg:mt-4 mt-2 font-medium transition duration-200"}`}
        onClick={onNext}
      >
        {listingType === PropertyListingType.CALL
          ? "Get a call back!"
          : isMobile
            ? "Start Posting Your Free Listing"
            : "Get Started"}
      </button>
    </div>
  );
};

export default ListingOptions;
