import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";

type Props = {};

const AddRole = (props: Props) => {
  const [role, setRole] = useState({
    name: "",
    type: "",
  });

  const navigate = useNavigate();

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setRole({ ...role, [name]: value });
  };

  const handleCreateRole = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const access_token = localStorage.getItem("access_token");

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    };

    try {
      const response = await axios.post("http://localhost:9091/roles/v1/register-role", role, {
        headers,
      });
      console.log(response.data);
      alert("Role created successfully!");
      navigate("/users/viewallroles");
    } catch (error) {
      console.log("Error in creating role", error);
    }
  };

  return (
    <Box component="form" onSubmit={handleCreateRole} noValidate sx={{ mt: 1 }}>
      <FormControl sx={{ m: 1 }}>
        <TextField
          label="Role Name"
          name="name"
          value={role.name}
          sx={{ width: 300 }}
          onChange={handleChange}
          placeholder="Enter Role Name"
        />
      </FormControl>

      <FormControl sx={{ m: 1 }}>
        <InputLabel id="demo-select-small">Role Type</InputLabel>
        <Select
          sx={{ width: 400 }}
          labelId="demo-select-small"
          id="demo-select-small"
          name="type"
          value={role.type}
          label="Role Type"
          onChange={handleChange}
        >
          <MenuItem value="Primary">Primary</MenuItem>
          <MenuItem value="Secondary"> Secondary</MenuItem>
        </Select>
      </FormControl>

      <Grid container spacing={12} justifyContent={"normal"}>
        <Grid item>
          <Button type="submit" sx={{ width: 300, height: 50 }} variant="contained">
            Create Role
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddRole;
