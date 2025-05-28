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
    <div className="flex justify-end gap-2 py-4">
      <button
        className={`px-3 py-1 border bg-red-500 text-white rounded ${
          isFirst
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-red-600 cursor-pointer"
        }`}
        onClick={prevPage}
      >
        &lt; Prev
      </button>
      <span className="px-2 py-1 font-bold text-red-500 border rounded">
        {currentPage}
      </span>
      <button
        className={`px-3 py-1 border bg-red-500 text-white rounded ${
          isLast
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-red-600 cursor-pointer"
        }`}
        disabled={isLast}
        onClick={nextPage}
      >
        Next &gt;
      </button>
    </div>
  );
};
