import { useCallback, useMemo, useState } from "react";

interface LocalPaginationReturn<Row> {
  currentPage: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
  paginatedRows: Row[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
}

/**
 * Client‑side paginator for an in‑memory array.
 *
 * @param rows         The full data set.
 * @param rowsPerPage  Items per page (default 10).
 * @param initialPage  1‑based starting page (default 1).
 */
export function useLocalPagination<Row>(
  rows: Row[],
  rowsPerPage: number = 10,
  initialPage: number = 1,
): LocalPaginationReturn<Row> {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = Math.max(1, Math.ceil(rows.length / rowsPerPage));
  const isFirst = currentPage === 1;
  const isLast = currentPage >= totalPages;

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return rows.slice(start, start + rowsPerPage);
  }, [rows, currentPage, rowsPerPage]);

  const goToPage = useCallback(
    (pageNo: number) => {
      if (pageNo >= 1 && pageNo <= totalPages) setCurrentPage(pageNo);
    },
    [totalPages],
  );

  const nextPage = () => !isLast && setCurrentPage((prevPage) => prevPage + 1);
  const prevPage = () => !isFirst && setCurrentPage((prevPage) => prevPage - 1);

  return {
    currentPage,
    totalPages,
    isFirst,
    isLast,
    paginatedRows,
    goToPage,
    nextPage,
    prevPage,
  };
}
