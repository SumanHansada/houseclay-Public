"use client";

import { motion } from "framer-motion";
import SearchSvg from "public/icons/search.svg";
import { useEffect, useRef, useState } from "react";

import Dropdown from "./Dropdown";

const Search = SearchSvg as React.FC<React.SVGProps<SVGSVGElement>>;

const CITY_OPTIONS = [
  { id: 1, label: "Featured" },
  { id: 2, label: "Posted (Latest First)" },
  { id: 3, label: "Posted (Older First)" },
  { id: 4, label: "Availability (Early First)" },
  { id: 5, label: "Availability (Late First)" },
  { id: 6, label: "Price (Lower First)" },
  { id: 7, label: "Price (Higher First)" },
];

const HomeSearchBar: React.FC = () => {
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleInputFocus = () => {
    if (inputRef.current) {
      setIsTyping(true);
    }
  };

  const handleInputBlur = () => {
    if (inputRef.current) {
      setIsTyping(false);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      if (inputRef.current) {
        setIsTyping(false);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex pl-8 pr-2 rounded-full bg-white shadow-lg overflow-hidden justify-between items-center h-16"
    >
      {/* City */}
      <div className="w-1/4 px-3 py-2 border-r border-gray-200">
        <div className="text-sm font-medium text-gray-900 mb-1">City</div>
        <div className="text-gray-500 text-sm flex items-center">
          <Dropdown
            options={CITY_OPTIONS}
            defaultSelected={CITY_OPTIONS[0]}
            onChange={(option) => console.log(option)}
          />
        </div>
      </div>

      {/* Location */}
      <div className="w-3/4 px-3 py-2 border-gray-200">
        {!isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.1,
              ease: "easeOut",
            }}
            className="text-sm font-medium text-gray-900 mb-1"
          >
            Location
          </motion.div>
        )}
        <motion.input
          ref={inputRef}
          type="text"
          placeholder="Type localities..."
          className={`text-gray-500 w-full outline-none`}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          animate={{
            fontSize: isTyping ? "1.125rem" : "0.875rem",
            lineHeight: isTyping ? "1.75rem" : "1.25rem",
          }}
          transition={{
            duration: 0.1,
            ease: "linear",
            delay: isTyping ? 0.1 : 0,
          }}
        />
      </div>

      {/* Search Button */}
      <button className="text-white flex items-center justify-center rounded-full">
        <Search height={50} width={50} />
      </button>
    </div>
  );
};

export default HomeSearchBar;
