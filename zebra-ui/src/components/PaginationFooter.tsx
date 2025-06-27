"use client";

import React from "react";

interface PaginationFooterProps {
  currentPage: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  footerPadding?: string;
}

export const PaginationFooter: React.FC<PaginationFooterProps> = ({
  currentPage,
  totalPages,
  isFirst,
  isLast,
  goToPage,
  prevPage,
  nextPage,
  // default padding
  footerPadding = "py-2 px-16",
}) => {
  // totalPages = 30;
  const WINDOW_SIZE = 3;
  const halfWindow = Math.floor(WINDOW_SIZE / 2);

  let startPage = Math.max(1, currentPage - halfWindow);
  let endPage = Math.min(totalPages, currentPage + halfWindow);

  if (endPage - startPage + 1 < WINDOW_SIZE) {
    if (startPage === 1) {
      endPage = Math.min(totalPages, startPage + WINDOW_SIZE - 1);
    } else if (endPage === totalPages) {
      startPage = Math.max(1, endPage - WINDOW_SIZE + 1);
    }
  }

  const pageNumbers = [];
  for (let num = startPage; num <= endPage; num++) {
    pageNumbers.push(num);
  }

  return (
    <div
      className={`flex items-center justify-between space-x-2 bg-white w-full ${footerPadding}`}
    >
      <div className="flex gap-2">
        <button
          type="button"
          disabled={isFirst}
          onClick={() => goToPage(1)}
          className={`px-3 py-2 border rounded-xl font-medium transition duration-200 ${
            isFirst
              ? "bg-gray-300 text-gray-400 cursor-not-allowed"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          &laquo; First
        </button>
        {/* Prev */}
        <button
          type="button"
          disabled={isFirst}
          onClick={prevPage}
          className={`px-4 py-2 border rounded-xl font-medium transition duration-200 ${
            isFirst
              ? "bg-gray-300 text-gray-400 cursor-not-allowed"
              : "bg-red-500 text-white hover:bg-red-600"
          }`}
        >
          &lt; Prev
        </button>
      </div>

      <div className="flex gap-1">
        {startPage > 1 && (
          <>
            <button
              onClick={() => goToPage(1)}
              className="px-3 py-2 border rounded-lg font-medium bg-white text-gray-700 hover:bg-gray-100"
            >
              1
            </button>
            {startPage > 2 && <span className="px-2">…</span>}
          </>
        )}

        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => goToPage(num)}
            className={`px-3 py-2 border rounded-lg font-medium ${
              num === currentPage
                ? "bg-red-500 text-white border-red-500"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {num}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">…</span>}
            <button
              onClick={() => goToPage(totalPages)}
              className="px-3 py-2 border rounded-lg font-medium bg-white text-gray-700 hover:bg-gray-100"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <div className="flex gap-2">
        {/* Next */}
        <button
          type="button"
          disabled={isLast}
          onClick={nextPage}
          className={`px-4 py-2 border rounded-xl font-medium transition duration-200 ${
            isLast
              ? "bg-gray-300 text-gray-400 cursor-not-allowed"
              : "bg-red-500 text-white hover:bg-red-600"
          }`}
        >
          Next &gt;
        </button>

        {/* Last Page */}
        <button
          type="button"
          disabled={isLast}
          onClick={() => goToPage(totalPages)}
          className={`px-3 py-2 border rounded-xl font-medium transition duration-200 ${
            isLast
              ? "bg-gray-300 text-gray-400 cursor-not-allowed"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Last &raquo;
        </button>
      </div>
    </div>
  );
};
