// Helper function to format date from ISO string to DD-MMM-YYYY
// eg. 25-Jun-2025
export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Helper function to get date only (YYYY-MM-DD) for grouping
export const getDateKey = (isoString: string): string => {
  return new Date(isoString).toISOString().split("T")[0];
};
