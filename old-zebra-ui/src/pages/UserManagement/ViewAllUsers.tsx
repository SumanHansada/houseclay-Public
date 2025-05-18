import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridRowId } from "@mui/x-data-grid";
import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router";

type Props = {};

const ViewAllUsers = () => {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  function handleView(id: GridRowId): void {
    navigate("/users/view/" + id);
  }

  function handleEdit(id: GridRowId): void {
    navigate("/users/edit/" + id);
  }

  function handleDelete(id: GridRowId): void {
    deleteUser(id);
    fetchData();
  }
  const columns: GridColDef[] = [
    { field: "username", headerName: "USERNAME", width: 200, editable: true },
    { field: "firstName", headerName: "FIRSTNAME", width: 150, editable: true },
    { field: "lastName", headerName: "LASTNAME", width: 150, editable: true },
    { field: "contactNumber", headerName: "CONTACT", width: 150, editable: true },
    { field: "notes", headerName: "NOTES", width: 200, editable: true },
    { field: "active", headerName: "ACTIVE", type: "boolean", width: 70 },
    {
      field: "roles",
      headerName: "ROLES",
      width: 300,
      valueGetter: (params: []) => {
        const roles = params;
        if (roles && roles.length > 0) {
          return roles.map((role: any) => role.name).join(", ");
        }
        return "No roles defined";
      },
      editable: false,
    },
    {
      field: "id",
      headerName: "Actions",
      width: 250,
      renderCell: (params) => (
        <>
          <Button onClick={() => handleView(params.id)}>
            <VisibilityIcon />
          </Button>
          <Button onClick={() => handleEdit(params.id)}>
            <EditIcon />
          </Button>
          <Button onClick={() => handleDelete(params.id)}>
            <DeleteIcon />
          </Button>
        </>
      ),
    },
  ];

  const deleteUser = async (id: any) => {
    const access_token = localStorage.getItem("access_token");

    if (access_token === null) {
      alert("Token is missing");
      return;
    }
    // Create headers object with access_token

    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      };

      const response = await axios.delete(`http://localhost:9091/users/v1/delete/${id}`, {
        headers,
      });

      alert(response.data);
    } catch (error: any) {
      if (error.response && error.response.status === 403) {
        alert("Forbidden: Access is denied due to insufficient permissions.");
      } else {
        alert("An error occurred while fetching the data.");
      }
    }
  };

  const fetchData = async () => {
    try {
      const access_token = localStorage.getItem("access_token");
      //const access_token="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbmtpdC5iaXN3YXM5QGdtYWlsLmNvbSIsInJvbGVzIjpbIlJPTEVfTUFOQUdFUiIsIlJPTEVfU1VQRVJfQURNSU4iXSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo5MDkxL3plYnJhL2xvZ2luIiwiZXhwIjoxNzExNjc3MjY1fQ.JINqH5KUnhEpmkWPGvLtT8akWJuXHRkPdFREdnIJZp4";
      if (access_token === null) {
        alert("Token is missing");
        return;
      }
      // Create headers object with access_token
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      };
      const response = await axios.get("http://localhost:9091/users/v1/all", { headers });

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
  }, [handleDelete]);
  return (
    <Box sx={{ height: 700, width: "100%" }}>
      <Typography variant="h6" component="h6" sx={{ textAlign: "left", mt: 2, mb: 2 }}>
        Manage Users
      </Typography>
      <DataGrid columns={columns} rows={rows} pagination={true} />
    </Box>
  );
};

export default ViewAllUsers;
