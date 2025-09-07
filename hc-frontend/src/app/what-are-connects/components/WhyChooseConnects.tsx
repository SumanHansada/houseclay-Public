import Image from "next/image";
import { useRouter } from "next/navigation";
import { default as CurlyArrowIconSvg } from "public/icons/static-pages/curly-arrow.svg";
import { default as InstantAccessIconSvg } from "public/icons/static-pages/instant-access.svg";
import { default as NoForcedPlanIconSvg } from "public/icons/static-pages/no-forced-plans.svg";
import { default as RealOwnerIconSvg } from "public/icons/static-pages/real-owners.svg";

const RealOwnerIcon = RealOwnerIconSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const InstantAccessIcon = InstantAccessIconSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const NoForcedPlanIcon = NoForcedPlanIconSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const CurlyArrowIcon = CurlyArrowIconSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;

const WhyChoose = () => {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between lg:gap-10 xl:px-28 lg:px-14 md:px-14 px-6 md:py-20 py-5 pb-16">
      <div className="w-full md:w-3/5 lg:px-12 md:px-4">
        <h1 className="mb-2 md:mb-4 xl:text-5xl lg:text-4xl sm:text-3xl text-2xl md:font-bold font-medium">
          Why Choose Connects?
        </h1>
        <p className="mb-4 md:mb-8 lg:3/4 md:w-4/5 p-1 md:text-gray-800 text-gray-600 md:font-light sm:text-xl text-lg">
          Enjoy a hassle-free, pay-as-you-go model with no subscriptions—just
          access what you need, when you need it.
        </p>
        <div className="flex max-md:mb-6 items-center">
          <div className="md:hidden w-1/2">
            <Image
              src="/images/why-choose-connects.svg"
              alt="Property Graphic"
              width={200}
              height={200}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-4 lg:space-y-10 sm:space-y-6 lg:px-8 md:px-4 text-lg sm:text-2xl lg:text-3xl mb-2 max-md:w-1/2">
            <div className="flex md:gap-4 gap-1 items-center">
              <RealOwnerIcon width={50} className="text-red-500" />
              <span>Real Owners</span>
            </div>
            <div className="flex md:gap-4 gap-1 items-center">
              <InstantAccessIcon width={50} className="text-red-500" />
              <span>Instant Access</span>
            </div>
            <div className="flex md:gap-4 gap-1 items-center">
              <NoForcedPlanIcon width={50} className="text-red-500" />
              <span>No Forced Plans</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 items-center px-2">
          <button
            className="bg-red-500 text-white text-lg xl:px-6  lg:px-5 lg:py-3 px-3 py-2 rounded-xl size-fit max-md:hidden"
            onClick={() => router.push("/buy-connects")}
          >
            Buy Connects Now
          </button>
          <div className="size-32 max-md:hidden">
            <CurlyArrowIcon width={140} className="text-red-500" />
          </div>
        </div>
      </div>
      <div className="w-2/5 max-md:hidden">
        <Image
          src="/images/why-choose-connects.svg"
          alt="Property Graphic"
          width={500}
          height={500}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default WhyChoose;
