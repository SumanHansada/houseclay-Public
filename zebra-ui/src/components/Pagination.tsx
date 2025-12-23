import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  className?: string;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  className,
}: PaginationProps) => {
  // --- Windowing Logic ---
  const getPageNumbers = () => {
    const delta = 1; // How many pages to show on each side of current
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }
    return rangeWithDots;
  };

  const pages = getPageNumbers();
  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages || totalPages === 0;

  // Don't click if disabled
  const handlePageClick = (page: number) => {
    if (!isLoading && page !== currentPage) {
      onPageChange(page);
    }
  };

  // Base button styles
  const btnClass = (active: boolean, disabled: boolean) =>
    `px-3 py-2 border rounded-lg font-medium transition-colors duration-200 flex items-center justify-center min-w-[2.5rem] 
    ${
      disabled || isLoading
        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
        : active
          ? "bg-red-500 text-white border-red-500"
          : "bg-white text-gray-700 hover:bg-red-50 hover:border-red-300"
    }`;

  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-between w-full ${className}`}>
      {/* Navigation Group */}
      <div className="flex gap-2">
        <button
          onClick={() => handlePageClick(1)}
          disabled={isFirst || isLoading}
          className={btnClass(false, isFirst)}
        >
          &laquo; First
        </button>
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={isFirst || isLoading}
          className={btnClass(false, isFirst)}
        >
          &lt; Prev
        </button>
      </div>

      {/* Page Numbers */}
      <div className="flex gap-1">
        {pages.map((page, idx) => {
          if (page === "...") {
            return (
              <span key={`dots-${idx}`} className="px-2 py-2 text-gray-400">
                ...
              </span>
            );
          }
          return (
            <button
              key={page}
              onClick={() => handlePageClick(Number(page))}
              disabled={isLoading}
              className={btnClass(page === currentPage, false)}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Navigation Group */}
      <div className="flex gap-2">
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={isLast || isLoading}
          className={btnClass(false, isLast)}
        >
          Next &gt;
        </button>
        <button
          onClick={() => handlePageClick(totalPages)}
          disabled={isLast || isLoading}
          className={btnClass(false, isLast)}
        >
          Last &raquo;
        </button>
      </div>
    </div>
  );
};
