import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";

type Props = {};

const ViewAllRoles = (props: Props) => {
  const [rows, setRows] = useState([]);

  const fetchData = async () => {
    const access_token = localStorage.getItem("access_token");
    if (access_token === null) {
      alert("Token is missing");
      return;
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    };

    const response = await axios.get("http://localhost:9091/roles/v1/all", { headers });
    setRows(response.data);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 300 },
    { field: "name", headerName: "ROLE NAME", width: 200 },
    { field: "type", headerName: "ROLE TYPE", width: 200 },
  ];

  return (
    <Box sx={{ height: 700, width: "100%" }}>
      <Typography variant="h6" component="h6" sx={{ textAlign: "left", mt: 2, mb: 2 }}>
        Manage Roles
      </Typography>
      <DataGrid columns={columns} rows={rows} />
    </Box>
  );
};

export default ViewAllRoles;
