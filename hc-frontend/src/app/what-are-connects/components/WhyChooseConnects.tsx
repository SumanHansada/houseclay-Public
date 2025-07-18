import Image from "next/image";
import { default as RealOwnersSvg } from "public/icons/static-pages/real-owners.svg";
import { default as InstantAccessSvg } from "public/icons/static-pages/instant-access.svg";
import { default as NoForcedPlansSvg } from "public/icons/static-pages/no-forced-plans.svg";

const RealOwners = RealOwnersSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const InstantAccess = InstantAccessSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const NoForcedPlans = NoForcedPlansSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;

const WhyChoose = () => {
  return (
    <div className="flex items-center justify-between gap-10 xl:px-28 lg:px-14 md:px-14 px-8 py-20">
      <div className="w-3/5 px-12">
        <h1 className="text-5xl font-bold mb-4">Why Choose Connects?</h1>
        <p className="text-gray-800 text-xl font-light text-left mb-8 w-3/4 p-1">
          Enjoy a hassle-free, pay-as-you-go model with no subscriptions—just
          access what you need, when you need it.
        </p>
        <div className="space-y-10 px-8 text-3xl mb-2">
          <div className="flex gap-4 items-center">
            <RealOwners />
            <span>Real Owners</span>
          </div>
          <div className="flex gap-4 items-center">
            <InstantAccess />
            <span>Instant Access</span>
          </div>
          <div className="flex gap-4 items-center">
            <NoForcedPlans />
            <span>No Forced Plans</span>
          </div>
        </div>
        <div className="flex gap-2 items-center px-2">
          <button className="bg-red-500 text-white text-xl xl:px-6  lg:px-5 lg:py-3 md:px-3 px-3 py-2 rounded-xl size-fit">
            Buy Connects Now
          </button>
          <div className="size-32">
            <Image
              src="/icons/static-pages/red-curly-arrow.svg"
              alt="Arrow Pointer"
              width={500}
              height={500}
            />
          </div>
        </div>
      </div>
      <div className="w-2/5">
        <Image
          src="/images/why-choose-connects.svg"
          alt="Property Graphic"
          width={500}
          height={500}
          className="w-full h-full object-cover max-xl:hidden"
        />
      </div>
    </div>
  );
};

export default WhyChoose;
