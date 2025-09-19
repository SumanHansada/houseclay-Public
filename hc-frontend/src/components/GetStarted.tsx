import { Lightbulb } from "lucide-react";

import { MobileFooter } from "@/layout-components";
import { SvgIcon } from "@/utility-components";
interface GetStartedProps {
  onGetStarted: () => void;
}

const GetStarted = ({ onGetStarted }: GetStartedProps) => {
  return (
    <div className="flex flex-col gap-4 xl:gap-8 h-full">
      <h1 className="text-2xl">It&apos;s easy to list property on Houseclay</h1>
      <div className="flex flex-col gap-6 w-full mx-auto">
        <div className="flex items-start gap-4">
          <SvgIcon iconSize="large" name="property-basics" size={80} />
          <div className="flex flex-1 flex-col gap-2">
            <div className="font-normal text-lg">1. Property Basics</div>
            <div className="text-gray-500 text-sm">
              Choose property type & enter location.
            </div>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <SvgIcon iconSize="large" name="showcase-your-space" size={80} />
          <div className="flex flex-1 flex-col gap-2">
            <div className="font-normal text-lg">2. Showcase Your Space</div>
            <div className="text-gray-500 text-sm">
              Upload photos, add key details & set price.
            </div>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <SvgIcon iconSize="large" name="go-live" size={80} />
          <div className="flex flex-1 flex-col gap-2">
            <div className="font-normal text-lg">3. Go Live & Get Leads!</div>
            <div className="text-gray-500 text-sm">
              Post instantly & connect with buyers/tenants.
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mx-auto mt-auto">
        <div className="flex items-center bg-green-100 rounded-lg p-4 gap-4 mb-4">
          <span className="bg-teal-500 text-white rounded-md py-2 px-3 text-xs font-medium flex gap-1 items-center">
            <Lightbulb size={15} /> Tip
          </span>
          <span className="text-gray-700 text-sm">
            On an average it takes less than 2 minutes to list the property
          </span>
        </div>
        <MobileFooter>
          <button
            className="text-center w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium transition duration-200"
            onClick={onGetStarted}
          >
            Get Started
          </button>
        </MobileFooter>
      </div>
    </div>
  );
};

export default GetStarted;
