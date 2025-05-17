import { Box, Button, Typography } from "@mui/material";
import { GridColDef, GridRowId } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import StyledDataGrid from "../../../components/common/StyledDataGrid";

interface MailToLinkProps {
  value: string;
}

const OwnerLeadsList = () => {
  const [rows, setRows] = useState([]);
  function handleView(id: GridRowId): void {
    alert("View");
  }

  function handleEdit(id: GridRowId): void {
    alert("Edit");
  }

  function handleDelete(id: GridRowId): void {
    deleteUser(id);
  }

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

      const response = await axios.delete(`http://localhost:9091/owner-leads/v1/delete/${id}`, {
        headers,
      });

      alert(response.data);
      fetchData();
    } catch (error: any) {
      if (error.response && error.response.status === 403) {
        alert("Forbidden: Access is denied due to insufficient permissions.");
      } else {
        alert("An error occurred while fetching the data.");
      }
    }
  };

  function MailToLink({ value }: MailToLinkProps) {
    return <a href={`mailto:${value}`}>{value}</a>;
  }

  const columns: GridColDef[] = [
    /**
         *         "ownerID": "cf78c67d-a21c-40f1-841b-a0de81cfdd0f",
        "firstName": "Santosh",
        "lastName": "Biswas",
        "contactNumber": "+91 80132 24567",
        "emailId": "santosh@houseclay.com",
        "leadStatus": "NEW",
        "locality": "",
        "bhkType": "",
        "apartmentName": "",
        "expectedRent": "",
        "googleMapLocationURL": ""
         */
    {
      field: "leadStatus",
      headerName: "LEAD STATUS",
      editable: true,
      cellClassName: (params) => {
        if (params.value === "NEW") {
          return "lead-status-new";
        } else {
          return "lead-status-other";
        }
      },
      type: "singleSelect",
      valueOptions: ["NEW", "INPROGRESS", "VISITSCHEDULED", "ONBOARDED"],
    },
    { field: "firstName", headerName: "FIRSTNAME", editable: false },
    { field: "lastName", headerName: "LASTNAME", editable: false },
    { field: "contactNumber", headerName: "CONTACT", editable: true, width: 150 },
    {
      field: "emailId",
      headerName: "EMAIL",
      editable: true,
      minWidth: 200,
      renderCell: (params) => <MailToLink value={params.value} />,
    },
    { field: "availableFrom", headerName: "AVAILABLE FROM", editable: false, minWidth: 100 },
    {
      field: "clayManage",
      headerName: "CLAY MANAGE",
      type: "boolean",
      editable: false,
      minWidth: 100,
    },
    { field: "locality", headerName: "LOCALITY", editable: false, width: 150 },
    { field: "bhkType", headerName: "BHK TYPE", editable: false },
    { field: "apartmentName", headerName: "APARTMENT NAME", editable: true, minWidth: 150 },
    { field: "expectedRent", headerName: "EXPECTED RENT", editable: true },
    {
      field: "googleMapLocationURL",
      headerName: "GOOGLE MAP URL",
      editable: true,
      width: 200,
      renderCell: (params) => {
        console.log(params.value);
        return (
          <a href={params.value} target="_blank" rel="noopener noreferrer">
            Open in Google Maps
          </a>
        );
      },
    },
    {
      field: "id",
      headerName: "Actions",
      renderCell: (params) => {
        return (
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
        );
      },
      editable: false,
      width: 300,
    },
  ];

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
      const response = await axios.get("http://localhost:9091/owner-leads/v1/fetchAll", {
        headers,
      });
      console.log(response.data);
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
    <>
      <Box sx={{ height: "calc(100vh - 200px)", width: "100%", overflow: "auto" }}>
        <Typography variant="h6" component="h6" sx={{ textAlign: "left", mt: 2, mb: 2 }}>
          Owner Leads
        </Typography>
        <StyledDataGrid
          sx={{ height: "100%" }}
          columns={columns}
          rows={rows}
          getRowId={(row) => row.ownerID}
          pagination={true}
        />
      </Box>
    </>
  );
};

export default OwnerLeadsList;
