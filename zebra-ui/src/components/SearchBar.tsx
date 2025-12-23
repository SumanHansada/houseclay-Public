import { Search, X } from "lucide-react";
import React from "react";

import Spinner from "./Spinner";

interface SearchBarProps {
  searchText: string;
  onSearchTextChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
  isSearching: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchText,
  onSearchTextChange,
  onSearch,
  onClear,
  isSearching,
}) => {
  // Allow pressing "Enter" to search
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="w-full max-w-sm flex items-center gap-2">
      <div className="relative flex-1 group">
        <input
          type="text"
          aria-label="Phone number search"
          placeholder="Search by phone number..."
          value={searchText}
          onChange={(e) => onSearchTextChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSearching}
          className="w-full p-2.5 pl-4 pr-10 bg-gray-50 border border-gray-300 rounded-xl transition-all hover:bg-white hover:border-gray-400 focus:bg-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 disabled:opacity-60 disabled:cursor-not-allowed"
        />
        {/* Quick Clear Button inside input */}
        {searchText && !isSearching && (
          <button
            onClick={onClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <X className="size-5" />
          </button>
        )}
      </div>

      <button
        title="Search"
        aria-label="Search"
        disabled={isSearching || !searchText.trim()}
        onClick={onSearch}
        className="p-2.5 rounded-xl border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:text-red-500 hover:border-red-200 active:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSearching ? <Spinner size="sm" /> : <Search className="size-5" />}
      </button>
    </div>
  );
};
