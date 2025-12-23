import { useCallback, useEffect, useMemo, useState } from "react";

interface LocalPaginationReturn<Row> {
  currentPage: number;
  totalPages: number;
  paginatedRows: Row[];
  goToPage: (page: number) => void;
}

export function useLocalPagination<Row>(
  rows: Row[],
  rowsPerPage: number = 10,
  initialPage: number = 1,
): LocalPaginationReturn<Row> {
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Calculate total pages safely
  const totalPages = Math.max(1, Math.ceil(rows.length / rowsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [rows.length, totalPages, currentPage]);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return rows.slice(start, start + rowsPerPage);
  }, [rows, currentPage, rowsPerPage]);

  const goToPage = useCallback(
    (pageNo: number) => {
      if (pageNo >= 1 && pageNo <= totalPages) {
        setCurrentPage(pageNo);
      }
    },
    [totalPages],
  );

  return {
    currentPage,
    totalPages,
    paginatedRows,
    goToPage,
  };
}
