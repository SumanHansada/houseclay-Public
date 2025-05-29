import React from "react";

interface PaginationProps {
  currentPage: number;
  isLast: boolean;
  isFirst: boolean;
  nextPage: () => void;
  prevPage: () => void;
}

export const Pagination = ({
  currentPage,
  isLast,
  isFirst,
  prevPage,
  nextPage,
}: PaginationProps) => {
  return (
    <div className="flex justify-end gap-2 py-2">
      <button
        className={`px-4 py-3 border rounded-xl font-medium transition duration-200 ${
          isFirst
            ? "bg-gray-300 text-gray-400 cursor-not-allowed"
            : "bg-red-500 text-white hover:bg-red-600 cursor-pointer"
        }`}
        onClick={prevPage}
      >
        &lt; Prev
      </button>
      <span className="px-4 py-3 text-lg font-bold text-red-500 border border-red-500 rounded-xl">
        {currentPage}
      </span>
      <button
        className={`px-4 py-3 border rounded-xl ${
          isLast
            ? "bg-gray-300 text-gray-400 cursor-not-allowed"
            : "bg-red-500 text-white hover:bg-red-600 cursor-pointer"
        }`}
        disabled={isLast}
        onClick={nextPage}
      >
        Next &gt;
      </button>
    </div>
  );
};
