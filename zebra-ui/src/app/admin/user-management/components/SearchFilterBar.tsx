import React from "react";

export type TBlockFilter = "all" | "active" | "blocked";

type SearchFilterBarProps = {
  searchValue: string;
  onSearchChange: (v: string) => void;
  blockFilter: TBlockFilter;
  onBlockFilterChange: (v: "active" | "blocked") => void;
};

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchValue,
  onSearchChange,
  blockFilter,
  onBlockFilterChange,
}) => (
  <div className="flex justify-between py-4 px-28">
    <div>
      <label htmlFor="blockFilter" className="mr-2 font-medium">
        Show:
      </label>
      <select
        id="blockFilter"
        value={blockFilter}
        onChange={(e) => onBlockFilterChange(e.target.value as any)}
        className="p-2 border border-gray-300 rounded cursor-pointer focus:outline-none focus:border-red-500 focus:ring-0"
      >
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="blocked">Blocked</option>
      </select>
    </div>
    <input
      type="text"
      placeholder="Search by phone..."
      value={searchValue}
      onChange={(e) => onSearchChange(e.target.value)}
      className="w-1/4 p-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:border-red-500 focus:ring-0"
    />
  </div>
);
