import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <div className="bg-gray-100 w-full px-24">
      {/* Main footer content */}
      <div className="border-b border-gray-300 py-24">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
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
                  {" "}
                  <Image
                    src="/icons/facebook.svg"
                    alt="Facebook"
                    height={25}
                    width={25}
                  />
                  <span>Facebook</span>
                </Link>
              </li>
              <li>
                <Link
                  href="https://instagram.com"
                  className="flex items-center text-black hover:text-red-500 gap-1"
                >
                  <Image
                    src="/icons/instagram.svg"
                    alt="Instagram"
                    height={25}
                    width={25}
                  />
                  <span>Instagram</span>
                </Link>
              </li>
              <li>
                <Link
                  href="https://linkedin.com"
                  className="flex items-end text-black hover:text-red-500 gap-1"
                >
                  <Image
                    src="/icons/linkedin.svg"
                    alt="Linkedin"
                    height={25}
                    width={25}
                  />
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
                HouseClay is an assistance based platform connecting owners and
                buyers, validating property and promising the best deal.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom footer with logo and copyright */}
      <footer className="py-6 flex flex-row justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/icons/houseclay.svg"
              alt="HouseClay"
              height={"200"}
              width={"200"}
            />
          </Link>
        </div>
        <div className="text-gray-400 text-sm">
          © 2024 HouseClay. All right reserved.
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
              <Link href="/terms" className="text-gray-400 hover:text-red-500">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
