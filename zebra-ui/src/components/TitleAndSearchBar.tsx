import React from "react";

interface TitleAndSearchBarProps {
  searchValue: string;
  onSearchChange: (v: string) => void;
  title: string;
}

export const TitleAndSearchBar: React.FC<TitleAndSearchBarProps> = ({
  searchValue,
  onSearchChange,
  title,
}) => (
  <div className="flex justify-between items-center py-4 px-16 bg-white">
    <span className="text-2xl font-medium">{title}</span>
    <input
      type="text"
      placeholder="Search by phone..."
      value={searchValue}
      onChange={(e) => onSearchChange(e.target.value)}
      className="w-1/4 p-2 bg-gray-100 border border-gray-300 rounded-xl hover:bg-gray-200 focus:outline-none focus:border-red-500 focus:ring-0"
    />
  </div>
);
