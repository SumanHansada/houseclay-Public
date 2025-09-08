"use client";

import Link from "next/link";
import FacebookSvg from "public/icons/facebook.svg";
import HouseclaySvg from "public/icons/houseclay-main.svg";
import InstagramSvg from "public/icons/instagram.svg";
import LinkedInSvg from "public/icons/linkedin.svg";
import { useSelector } from "react-redux";

import { RootState } from "@/store/store";
import { SUPPORT_CONTACT, SUPPORT_EMAIL } from "@/common/constants";
import { Mail, PhoneCall } from "lucide-react";

const FooterClient: React.FC = () => {
  const HouseClay = HouseclaySvg as React.FC<React.SVGProps<SVGSVGElement>>;
  const LinkedIn = LinkedInSvg as React.FC<React.SVGProps<SVGSVGElement>>;
  const Facebook = FacebookSvg as React.FC<React.SVGProps<SVGSVGElement>>;
  const Instagram = InstagramSvg as React.FC<React.SVGProps<SVGSVGElement>>;
  const hideFooter = useSelector((state: RootState) => state.app.hideFooter);

  if (hideFooter) {
    return null;
  }

  return (
    <>
      <footer className="bg-gray-100 w-full xl:px-24 lg:px-12 px-12 font-nunito max-md:hidden">
        {/* Main footer content */}
        <div className="border-b border-gray-300 py-24">
          <div className="grid grid-cols-1  xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 gap-8">
            {/* Quick Links */}
            <div>
              <h3 className="text-gray-400 font-medium text-lg mb-5">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/for-sale"
                    className="text-black hover:text-red-500"
                  >
                    For Sale
                  </Link>
                </li>
                <li>
                  <Link
                    href="/for-rent"
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
                <li>
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-red-500"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/signup"
                    className="text-gray-700 hover:text-red-500"
                  >
                    Signup
                  </Link>
                </li>
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
                    Testimonials
                  </Link>
                </li>
                <li>
                  <Link href="/faqs" className="text-black hover:text-red-500">
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

            {/* Contact */}
            <div>
              <h3 className="text-gray-400 font-medium text-lg mb-5">
                Contact
              </h3>
              <ul className="space-y-2">
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="flex items-center gap-2 w-fit"
                >
                  <Mail width={15} height={15} className="text-red-500" />
                  <span>{SUPPORT_EMAIL}</span>
                </a>
                <a
                  href={`tel:${SUPPORT_CONTACT}`}
                  className="flex items-center gap-2 w-fit"
                >
                  <PhoneCall width={15} height={15} className="text-red-500" />
                  <span>{SUPPORT_CONTACT}</span>
                </a>
              </ul>
            </div>

            {/* Follow Us */}
            <div>
              <h3 className="text-gray-400 font-medium text-lg mb-5">
                Follow Us
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="https://facebook.com"
                    className="flex items-center text-black hover:text-red-500 gap-1"
                  >
                    <Facebook />
                    <span>Facebook</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://instagram.com"
                    className="flex items-center text-black hover:text-red-500 gap-1"
                  >
                    <Instagram />
                    <span>Instagram</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://linkedin.com"
                    className="flex items-start text-black hover:text-red-500 gap-1"
                  >
                    <LinkedIn />
                    <span>Linkedin</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* CTA Button and Description */}
            <div>
              <div className="mb-8">
                <Link
                  href="/list-property"
                  className="inline-block border border-red-500 text-black px-6 py-2 rounded-md hover:bg-red-500 hover:text-white transition-colors"
                >
                  List Your Property
                </Link>
              </div>
              <div>
                <p className="text-gray-600">
                  HouseClay is an assistance based platform connecting owners
                  and buyers, validating property and promising the best deal.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom footer with logo and copyright */}
        <div className="py-6 flex flex-row justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-1">
              <HouseClay width={24} height={26} />
              <span className="text-red-600 text-xl font-inter font-bold">
                houseclay
              </span>
            </Link>
          </div>
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
      {/* Mobile Footer */}
      <footer
        className={`${hideFooter ? "hidden" : "flex"} flex-col gap-6 md:hidden bg-gray-100 px-6 pt-8 pb-16`}
      >
        <Link href="/" className="flex items-center gap-1">
          <HouseClay width={22} height={24} />
          <span className="text-red-600 text-xl font-inter font-bold">
            houseclay
          </span>
        </Link>
        {/* CTA Button and Description */}
        <div>
          <div className="flex flex-col gap-4">
            <div className="text-gray-400 font-nunito font-thin">
              HouseClay is an assistance based platform connecting owners and
              buyers, validating property and promising the best deal.
            </div>
            <div>
              <Link
                href="/list-property"
                className="inline-block border border-red-500 text-black px-6 py-2 rounded-md hover:bg-red-500 hover:text-white transition-colors"
              >
                List Your Property
              </Link>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
          {/* Quick Links */}
          <div>
            <h3 className="text-gray-400 font-medium text-lg mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/for-sale"
                  className="text-black hover:text-red-500"
                >
                  For Sale
                </Link>
              </li>
              <li>
                <Link
                  href="/for-rent"
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
              <li>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-red-500"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="text-gray-700 hover:text-red-500"
                >
                  Signup
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-gray-400 font-medium text-lg mb-3">
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
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="text-black hover:text-red-500">
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

          {/* Contact Us */}
          <div>
            <h3 className="text-gray-400 font-medium text-lg mb-3">
              Contact Us
            </h3>
            <ul className="space-y-2">
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="flex items-center gap-2 w-fit"
              >
                <Mail width={15} height={15} className="text-red-500" />
                <span>{SUPPORT_EMAIL}</span>
              </a>
              <a
                href={`tel:${SUPPORT_CONTACT}`}
                className="flex items-center gap-2 w-fit"
              >
                <PhoneCall width={15} height={15} className="text-red-500" />
                <span>{SUPPORT_CONTACT}</span>
              </a>
            </ul>
          </div>
        </div>
        {/* Follow Us */}
        <div>
          <ul className="flex justify-between">
            <li>
              <Link
                href="https://facebook.com"
                className="flex items-center text-black hover:text-red-500 gap-1"
              >
                <Facebook />
                <span>Facebook</span>
              </Link>
            </li>
            <li>
              <Link
                href="https://instagram.com"
                className="flex items-center text-black hover:text-red-500 gap-1"
              >
                <Instagram />
                <span>Instagram</span>
              </Link>
            </li>
            <li>
              <Link
                href="https://linkedin.com"
                className="flex items-start text-black hover:text-red-500 gap-1"
              >
                <LinkedIn />
                <span>Linkedin</span>
              </Link>
            </li>
          </ul>
        </div>
        {/* Bottom footer with logo and copyright */}
        <div className="flex border-t border-t-gray-400 py-4 w-full justify-around items-center">
          <div className="text-gray-400 text-sm">
            © 2025 HouseClay. All right reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default FooterClient;
