import CustomerSupportSvg from "public/icons/customer-support.svg";

const CustomerSupport = CustomerSupportSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;

const CustomerSupportBanner: React.FC = () => {
  return (
    <div className="container py-12 mx-auto xl:px-28 lg:px-14 md:px-8 px-8">
      <div className="p-8 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm flex items-center w-full justify-between gap-16">
        <div className="relative overflow-hidden rounded-lg">
          <div className="absolute inset-0 shadow-[inset_0_0_80px_40px_rgba(255,255,255,0.8)] z-20"></div>
          <CustomerSupport />
        </div>

        <div className="flex flex-col justify-between w-1/2">
          <h2 className="text-2xl font-bold text-gray-800">
            Need Help Listing Your Property?{" "}
            <span className="text-red-500">Let&apos;s Talk!</span>
          </h2>
          <p className="mt-3 text-gray-600">
            Need fast results and hassle-free listing? Book a call with our
            experts to get your property listed quickly and easily!
          </p>
          <div className="mt-6">
            <button className="px-6 py-3 border border-red-500 rounded-xl hover:bg-red-50 ">
              Book a Free Call Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSupportBanner;
