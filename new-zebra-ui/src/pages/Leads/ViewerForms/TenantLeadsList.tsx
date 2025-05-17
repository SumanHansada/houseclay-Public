import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import axios from "axios";

const TenantLeadsList = () => {
  const [rows, setRows] = useState([]);
  const columns: GridColDef[] = [
    { field: "firstName", headerName: "FIRSTNAME", width: 150, editable: true },
    { field: "lastName", headerName: "LASTNAME", width: 150, editable: true },
    { field: "emailId", headerName: "EMAIL ID", width: 150, editable: true },
    { field: "contactNumber", headerName: "CONTACT", width: 150, editable: true },
    { field: "notes", headerName: "NOTES", width: 200, editable: true },
  ];

  const fetchData = async () => {
    try {
      const access_token = localStorage.getItem("access_token");

      if (access_token === null) {
        alert("Token is missing");
        return;
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      };
      const response = await axios.get("http://localhost:9091/tenant-leads/get-leads", { headers });

      setRows(response.data);
    } catch (err: any) {
      if (err.response && err.response.status === 403) {
        alert("Forbidden: Access is denied due to insufficient permissions.");
      } else {
        alert("An error occurred while fetching the data.");
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <Box sx={{ height: 700, width: "100%" }}>
      <Typography variant="h6" component="h6" sx={{ textAlign: "left", mt: 2, mb: 2 }}>
        Tenant Lead
      </Typography>
      <DataGrid columns={columns} rows={rows} pagination={true} />
    </Box>
  );
};

export default TenantLeadsList;
