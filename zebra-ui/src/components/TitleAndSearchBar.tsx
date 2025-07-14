import { Search, X } from "lucide-react";
import React from "react";

interface TitleAndSearchBarProps {
  title: string;
  searchText: string;
  onSearchTextChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
  isSearching: boolean;
}

export const TitleAndSearchBar: React.FC<TitleAndSearchBarProps> = ({
  title,
  searchText,
  onSearchTextChange,
  onSearch,
  onClear,
  isSearching,
}) => (
  <div className="flex justify-between items-center py-4 px-16 bg-white">
    <span className="text-2xl font-medium">{title}</span>

    <div className="w-1/4 flex items-center gap-2">
      <input
        type="text"
        placeholder="Search by phone…"
        value={searchText}
        onChange={(e) => onSearchTextChange(e.target.value)}
        className="flex-1 p-2 bg-gray-100 border border-gray-300 rounded-xl hover:bg-gray-200 focus:outline-none focus:border-red-500"
      />

      <button
        title="Search"
        // disabled={isSearching || !searchText.trim()}
        disabled={isSearching}
        onClick={onSearch}
        className="p-2 rounded-xl border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
      >
        <Search className="size-5" />
      </button>

      {searchText && (
        <button
          title="Clear"
          onClick={onClear}
          className="p-2 rounded-xl border border-gray-300 hover:bg-gray-100"
        >
          <X className="size-5" />
        </button>
      )}
    </div>
  </div>
);
