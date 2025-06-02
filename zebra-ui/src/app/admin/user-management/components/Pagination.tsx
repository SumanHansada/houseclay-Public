// src/components/Pagination.tsx
"use client";

import React from "react";

interface PaginationProps {
  currentPage: number; // 1-based
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  isFirst,
  isLast,
  goToPage,
  prevPage,
  nextPage,
}) => {
  // How many page buttons to show at once (you can adjust to 3, 5, etc.)
  // totalPages = 30;
  const WINDOW_SIZE = 3;
  const halfWindow = Math.floor(WINDOW_SIZE / 2);

  let startPage = Math.max(1, currentPage - halfWindow);
  let endPage = Math.min(totalPages, currentPage + halfWindow);

  // If we don't have enough pages at the start or end, adjust the window:
  if (endPage - startPage + 1 < WINDOW_SIZE) {
    if (startPage === 1) {
      // Expand forward
      endPage = Math.min(totalPages, startPage + WINDOW_SIZE - 1);
    } else if (endPage === totalPages) {
      // Expand backward
      startPage = Math.max(1, endPage - WINDOW_SIZE + 1);
    }
  }

  const pageNumbers = [];
  for (let num = startPage; num <= endPage; num++) {
    pageNumbers.push(num);
  }

  return (
    <div className="flex items-center justify-between space-x-2 py-2 px-28 bg-white w-full">
      {/* First Page */}
      <div className="flex gap-2">
        {" "}
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
        {/* Leading ellipsis if needed */}
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

        {/* Page number window */}
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

        {/* Trailing ellipsis if needed */}
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

// import React from "react";

// interface PaginationProps {
//   currentPage: number;
//   isLast: boolean;
//   totalPages: number;
//   isFirst: boolean;
//   goToPage: (page: number) => void;
//   nextPage: () => void;
//   prevPage: () => void;
// }

// export const Pagination = ({
//   currentPage,
//   totalPages,
//   isLast,
//   isFirst,
//   goToPage,
//   prevPage,
//   nextPage,
// }: PaginationProps) => {
//   const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
//   return (
//     <div className="flex items-center justify-end space-x-2 py-2 px-28 bg-white w-full">
//       <button
//         type="button"
//         disabled={isFirst}
//         onClick={prevPage}
//         className={`px-4 py-2 border rounded-xl font-medium transition duration-200 ${
//           isFirst
//             ? "bg-gray-300 text-gray-400 cursor-not-allowed"
//             : "bg-red-500 text-white hover:bg-red-600"
//         }`}
//       >
//         &lt; Prev
//       </button>

//       {pageNumbers.map((num) => (
//         <button
//           key={num}
//           onClick={() => goToPage(num)}
//           className={`px-3 py-2 border rounded-lg font-medium ${
//             num === currentPage
//               ? "bg-red-500 text-white border-red-500"
//               : "bg-white text-gray-700 hover:bg-gray-100"
//           }`}
//         >
//           {num}
//         </button>
//       ))}

//       <button
//         type="button"
//         disabled={isLast}
//         onClick={nextPage}
//         className={`px-4 py-2 border rounded-xl font-medium transition duration-200 ${
//           isLast
//             ? "bg-gray-300 text-gray-400 cursor-not-allowed"
//             : "bg-red-500 text-white hover:bg-red-600"
//         }`}
//       >
//         Next &gt;
//       </button>
//     </div>
//     // <div className="flex justify-end gap-2 py-2 px-28 bg-white w-full">
//     //   <button
//     //     type="button"
//     //     className={`px-4 py-3 border rounded-xl font-medium transition duration-200 ${
//     //       isFirst
//     //         ? "bg-gray-300 text-gray-400 cursor-not-allowed"
//     //         : "bg-red-500 text-white hover:bg-red-600 cursor-pointer"
//     //     }`}
//     //     onClick={prevPage}
//     //   >
//     //     &lt; Prev
//     //   </button>
//     //   <span className="px-2 py-3 text-lg font-bold text-red-500 border border-red-500 rounded-lg">
//     //     {currentPage}
//     //   </span>
//     //   <button
//     //     type="button"
//     //     className={`px-4 py-3 border rounded-xl ${
//     //       isLast
//     //         ? "bg-gray-300 text-gray-400 cursor-not-allowed"
//     //         : "bg-red-500 text-white hover:bg-red-600 cursor-pointer"
//     //     }`}
//     //     disabled={isLast}
//     //     onClick={nextPage}
//     //   >
//     //     Next &gt;
//     //   </button>
//     // </div>
//   );
// };
