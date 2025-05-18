import styled from "@emotion/styled";
import { DataGrid } from "@mui/x-data-grid";

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  ".lead-status-new": {
    background: "#c6efce" /* green background */,
    color: "#2e865f" /* green text */,
    backgroundColor: "#c6efce" /* for TypeScript validation */,
  },
  ".lead-status-other": {
    background: "#ffcdd2" /* red background */,
    color: "#b71c1c" /* red text */,
    backgroundColor: "#ffcdd2" /* for TypeScript validation */,
  },
}));

export default StyledDataGrid;
