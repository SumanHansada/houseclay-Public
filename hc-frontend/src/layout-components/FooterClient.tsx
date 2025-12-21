"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";

import { EXPLORE_LOCATION, SOCIAL_MEDIA_LINKS } from "@/common/constants";
import { useDialog } from "@/providers/DialogContextProvider";
import { RootState } from "@/store/store";
import { SvgIcon } from "@/utility-components";

const FooterClient: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { openDialog, closeAllDialogs } = useDialog();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Dynamically get lat/lon from current params or fallback to Bengaluru
  const currentLat = searchParams.get("lat") || EXPLORE_LOCATION.lat.toString();
  const currentLon = searchParams.get("lon") || EXPLORE_LOCATION.lng.toString();

  const onLogin = () => {
    closeAllDialogs();
    openDialog("login-dialog");
  };

  return (
    <>
      <footer className="bg-gray-100 w-full xl:px-24 lg:px-12 px-12 font-nunito max-md:hidden">
        {/* Main footer content */}
        <div className="border-b border-gray-300 pt-24 pb-16">
          <div className="flex justify-between">
            {/* CTA Button and Description */}
            <div className="space-y-3 w-1/2 lg:w-2/5 2xl:w-1/4">
              <div className="pb-4 space-y-4">
                <div className="flex items-center">
                  <Link href="/" className="flex items-center gap-1">
                    <SvgIcon
                      iconSize="small"
                      name="houseclay"
                      size={28}
                      className="scale-90 lg:scale-100"
                    />
                    <span className="text-red-500 text-2xl lg:text-[28px] font-inter font-bold">
                      houseclay
                    </span>
                  </Link>
                </div>
                <div>
                  <p className="text-gray-600">
                    Houseclay is an assistance based platform connecting owners
                    and buyers, validating property and promising the best deal.
                  </p>
                </div>
                <div className="flex justify-between">
                  <ul className="flex gap-4 items-end">
                    <li>
                      <Link
                        aria-label="instagram"
                        href={SOCIAL_MEDIA_LINKS.instagram}
                        target="_blank"
                        className="flex items-center text-black hover:text-red-500 gap-1"
                      >
                        <SvgIcon iconSize="small" name="instagram" size={32} />
                      </Link>
                    </li>
                    <li>
                      <Link
                        aria-label="facebook"
                        href={SOCIAL_MEDIA_LINKS.facebook}
                        target="_blank"
                        className="flex items-center text-black hover:text-red-500 gap-1"
                      >
                        <SvgIcon iconSize="small" name="facebook" size={32} />
                      </Link>
                    </li>
                    <li>
                      <Link
                        aria-label="linkedin"
                        href={SOCIAL_MEDIA_LINKS.linkedin}
                        target="_blank"
                        className="flex items-start text-black hover:text-red-500 gap-1"
                      >
                        <SvgIcon iconSize="small" name="linkedin" size={32} />
                      </Link>
                    </li>
                  </ul>
                  <Link
                    href="/list-property"
                    className="inline-block border border-red-500 text-black px-6 py-2 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
                  >
                    List Your Property
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex md:gap-8 lg:gap-12">
              {/* Quick Links */}
              <div>
                <h1 className="text-gray-600 font-medium text-lg mb-5">
                  Quick Links
                </h1>
                <ul className="space-y-2">
                  {/* <li>
                    <Link
                      href={`/property-search?lat=${BENGALURU_LOCATION.lat}&lon=${BENGALURU_LOCATION.lng}&propertyCategory=resale`}
                      data-category="resale"
                      data-active={
                        searchParams.get("propertyCategory") === "resale"
                          ? "true"
                          : "false"
                      }
                      className="text-black hover:text-red-500"
                    >
                      For Resale
                    </Link>
                  </li> */}
                  <li>
                    <Link
                      href={`/property-search?lat=${currentLat}&lon=${currentLon}&propertyCategory=rent`}
                      data-category="rent"
                      data-active={
                        searchParams.get("propertyCategory") === "rent" ||
                        (pathname === "/property-search" &&
                          !searchParams.get("propertyCategory"))
                          ? "true"
                          : "false"
                      }
                      className="text-black hover:text-red-500"
                    >
                      Rent
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/property-search?lat=${currentLat}&lon=${currentLon}&propertyCategory=flatmate`}
                      data-category="flatmate"
                      data-active={
                        searchParams.get("propertyCategory") === "flatmate" ||
                        (pathname === "/property-search" &&
                          !searchParams.get("propertyCategory"))
                          ? "true"
                          : "false"
                      }
                      className="text-black hover:text-red-500"
                    >
                      Rooms
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact-us"
                      className="text-black hover:text-red-500"
                    >
                      Contact Us
                    </Link>
                  </li>
                  {isAuthenticated ? null : (
                    <li>
                      <button
                        className="text-gray-700 hover:text-red-500"
                        onClick={onLogin}
                      >
                        Login
                      </button>
                    </li>
                  )}
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h1 className="text-gray-600 font-medium text-lg mb-5">
                  Resources
                </h1>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/about-us"
                      className="text-black hover:text-red-500"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/testimonials"
                      className="text-black hover:text-red-500"
                    >
                      Hall of Fame
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/faqs"
                      className="text-black hover:text-red-500"
                    >
                      FAQs
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom footer with logo and copyright */}
        <div className="py-4 flex flex-row justify-between items-center">
          <div className="text-gray-600 text-sm">
            © 2025 Elevensquare Technologies Pvt Ltd. All right reserved.
          </div>
          <div className="flex">
            <ul className="flex space-x-6">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-gray-600 hover:text-red-500"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="text-gray-600 hover:text-red-500"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
};

export default FooterClient;
