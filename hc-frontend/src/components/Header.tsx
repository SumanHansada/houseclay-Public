"use client"

import { useDeviceContext } from "@/providers/DeviceContextProvider";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export const Header: React.FC = () => {

  const [menuOpen, setMenuOpen] = useState(false);

  return (
     <header className="flex justify-between items-center px-24 pt-3 pb-2 shadow-sm bg-white">

      {/* Mobile Navigation */}
    <div className="md:hidden">
      <button className="text-gray-800 focus:outline-none" onClick={() => setMenuOpen(!menuOpen)}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
        </svg>
      </button>
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2">
       <Link href="/rent" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
         Rent
       </Link>
       <Link href="/buy" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
         Buy
       </Link>
       <Link href="/buy-connects" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
         Buy Connects
       </Link>
       <Link href="/about-us" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
         About Us
       </Link>
        </div>
      )}
    </div>

     {/* Left Section - Logo */}
     <div className="flex items-center py-2">
       <Link href="/">
         <span className="flex items-center text-red-600 text-xl font-bold">
           <Image
             src="/icons/houseclay.svg" // Replace with actual logo path
             alt="HouseClay"
              height={120}
              width={120}
           />
         </span>
       </Link>
     </div>

    {/* Center - Navigation */}
    <nav className="hidden md:flex space-x-8 text-gray-800">
      <Link href="/rent" className="hover:text-red-500">
        Rent
      </Link>
      <Link href="/buy" className="relative text-red-500">
        Buy
        <span className="absolute left-0 -bottom-1/2 w-full h-[2px] bg-red-500"></span>
      </Link>
      <Link href="/buy-connects" className="hover:text-red-500">
        Buy Connects
      </Link>
      <Link href="/about-us" className="hover:text-red-500">
        About Us
      </Link>
    </nav>

    

     {/* Right Section - Actions */}
     <div className="flex items-center space-x-4">
       {/* List Property Button */}
       <Link href="/list-property">
         <button className="relative border border-red-500 text-red-500 px-4 py-2 rounded-md hover:bg-red-50">
           List Your Property
           <span className="absolute bottom-0 right-0 -mb-2 -mr-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-md">
             FREE
           </span>
         </button>
       </Link>

       {/* Coin Counter */}
       <div className="flex items-center space-x-1 px-4 py-2 border rounded-md">
          <Image src={"/icons/coin.svg"} alt="Coin" height={25} width={25} />
         <span>0</span>
       </div>

       {/* Login Button */}
       <Link href="/login">
         <button className="border px-4 py-2 rounded-md hover:bg-gray-100">
           Login
         </button>
       </Link>
     </div>
   </header>
  );
};

