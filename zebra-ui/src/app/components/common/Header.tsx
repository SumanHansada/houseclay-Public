import Image from "next/image";
import Link from "next/link";
import HouseClaySvg from "public/icons/houseclay.svg";

const HouseClay = HouseClaySvg as React.FC<React.SVGProps<SVGSVGElement>>;

const Header = () => {
  return (
    <header className="flex fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 z-50 justify-between w-full items-center py-2 shadow-sm px-8 h-16">
      {/* Logo and App Name */}
      <div className="flex items-center gap-2">
      <Link href="/" className="flex items-center gap-1">
        <HouseClay />
        <span className="text-red-600 text-lg font-nunito font-bold">ZEBRA | HouseClay</span>
      </Link>
      </div>
      {/* User Avatar and Dropdown */}
      <div className="flex items-center gap-4">
        <span className="font-medium text-gray-700">Esther Howard</span>
        <Image
          src="https://randomuser.me/api/portraits/lego/5.jpg"
          alt="User Avatar"
          width={36}
          height={36}
          className="rounded-full border border-gray-200"
        />
        {/* Dropdown can be implemented here if needed */}
      </div>
    </header>
  );
};

export default Header;
