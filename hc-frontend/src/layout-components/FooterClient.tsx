"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";

import {
  BENGALURU_LOCATION,
  HOUSECLAY_FACEBOOK,
  HOUSECLAY_INSTAGRAM,
  HOUSECLAY_LINKEDIN,
} from "@/common/constants";
import { useDialog } from "@/providers/DialogContextProvider";
import { RootState } from "@/store/store";
import { SvgIcon } from "@/utility-components";

const FooterClient: React.FC = () => {
  const hideFooter = useSelector((state: RootState) => state.app.hideFooter);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { openDialog, closeAllDialogs } = useDialog();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  if (hideFooter) {
    return null;
  }

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
                        href={HOUSECLAY_INSTAGRAM}
                        target="_blank"
                        className="flex items-center text-black hover:text-red-500 gap-1"
                      >
                        <SvgIcon iconSize="small" name="instagram" size={32} />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={HOUSECLAY_FACEBOOK}
                        target="_blank"
                        className="flex items-center text-black hover:text-red-500 gap-1"
                      >
                        <SvgIcon iconSize="small" name="facebook" size={32} />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={HOUSECLAY_LINKEDIN}
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
                <h3 className="text-gray-400 font-medium text-lg mb-5">
                  Quick Links
                </h3>
                <ul className="space-y-2">
                  <li>
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
                  </li>
                  <li>
                    <Link
                      href={`/property-search?lat=${BENGALURU_LOCATION.lat}&lon=${BENGALURU_LOCATION.lng}&propertyCategory=rent`}
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
                      For Rent
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
                    <>
                      <li>
                        <button
                          className="text-gray-700 hover:text-red-500"
                          onClick={onLogin}
                        >
                          Login
                        </button>
                      </li>
                      <li>
                        <button
                          className="text-gray-700 hover:text-red-500"
                          onClick={onLogin}
                        >
                          Signup
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 className="text-gray-400 font-medium text-lg mb-5">
                  Resources
                </h3>
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
                  <li>
                    <Link
                      href="/terms-and-conditions"
                      className="text-black hover:text-red-500"
                    >
                      Terms & Conditions
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom footer with logo and copyright */}
        <div className="py-4 flex flex-row justify-between items-center">
          <div className="text-gray-400 text-sm">
            © 2025 HouseClay. All right reserved.
          </div>
          <div className="flex">
            <ul className="flex space-x-6">
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-red-500"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="text-gray-400 hover:text-red-500"
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
