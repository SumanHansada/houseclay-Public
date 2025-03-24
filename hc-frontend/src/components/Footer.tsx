import Link from "next/link";
import FacebookSvg from "public/icons/facebook.svg";
import HouseclaySvg from "public/icons/houseclay.svg";
import InstagramSvg from "public/icons/instagram.svg";
import LinkedInSvg from "public/icons/linkedin.svg";

const Footer = () => {
  const HouseClay = HouseclaySvg as React.FC<React.SVGProps<SVGSVGElement>>;
  const LinkedIn = LinkedInSvg as React.FC<React.SVGProps<SVGSVGElement>>;
  const Facebook = FacebookSvg as React.FC<React.SVGProps<SVGSVGElement>>;
  const Instagram = InstagramSvg as React.FC<React.SVGProps<SVGSVGElement>>;

  return (
    <>
      <div className="bg-gray-100 w-full xl:px-24 lg:px-12 px-12 font-nunito max-md:hidden">
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
                    href="/contact"
                    className="text-black hover:text-red-500"
                  >
                    Contact
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
                  <Link href="/about" className="text-black hover:text-red-500">
                    About
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
                  <Link href="/terms" className="text-black hover:text-red-500">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Us */}
            <div>
              <h3 className="text-gray-400 font-medium text-lg mb-5">
                Contact Us
              </h3>
              <ul className="space-y-2">
                <li className="text-black">support@houseclay.com</li>
                <li className="text-black">+91 7892014327</li>
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
        <footer className="py-6 flex flex-row justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-1">
              <HouseClay />
              <span className="text-red-600 text-lg font-nunito font-bold">
                HouseClay
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
                  href="/terms"
                  className="text-gray-400 hover:text-red-500"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </footer>
      </div>
      {/* Mobile Footer */}
      <div className="flex flex-col gap-6 md:hidden bg-gray-100 px-8 pt-8 pb-2">
        <Link href="/" className="flex items-center gap-1">
          <HouseClay />
          <span className="text-red-600 text-lg font-nunito font-bold">
            HouseClay
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
                <Link href="/contact" className="text-black hover:text-red-500">
                  Contact
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
                <Link href="/about" className="text-black hover:text-red-500">
                  About
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
                <Link href="/terms" className="text-black hover:text-red-500">
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
              <li className="text-black">support@houseclay.com</li>
              <li className="text-black">+91 7892014327</li>
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
        <footer className="flex border-t border-t-gray-400 py-4 w-full justify-around items-center">
          <div className="text-gray-400 text-sm">
            © 2025 HouseClay. All right reserved.
          </div>
        </footer>
      </div>
    </>
  );
};

export default Footer;
