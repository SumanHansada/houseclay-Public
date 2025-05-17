import {
  Box,
  FormControl,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  Button,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  ListItemText,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";

interface BaseTimeStamp {
  created_on: string;
  created_by: string;
  changed_by: string;
  changed_on: string;
}

interface Role {
  name: string;
}

interface NewUserData {
  username: string;
  firstName: string;
  lastName: string;
  contactNumber: string;
  active: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  notes: string;
  baseTimeStamp: BaseTimeStamp;
  roles: Role[];
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const EditUser = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const [roles, setRoles] = useState([{ name: "" }]);

  const [userroles, setUserRoles] = useState([]);

  const [user, setUser] = useState<NewUserData>({
    username: "",
    firstName: "",
    lastName: "",
    contactNumber: "",
    active: false,
    emailVerified: false,
    phoneVerified: false,
    notes: "",
    baseTimeStamp: {
      created_on: "",
      created_by: "",
      changed_on: "",
      changed_by: "",
    },
    roles: [],
  });

  console.log(userroles);
  console.log(roles);

  const handleRoleChange = (event: any) => {
    setUserRoles(event.target.value);
    user.roles = event.target.value;
  };

  const fetchAllRoles = async () => {
    const access_token = localStorage.getItem("access_token");

    if (access_token === null) {
      alert("Token is missing ");
      return;
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    };

    const response = await axios.get("http://localhost:9091/roles/v1/all", { headers });
    setRoles(response.data);
  };

  const handleChange = (event: any) => {
    const { name, value, type, checked } = event.target;
    if (type === "checkbox") {
      setUser({ ...user, [name]: checked });
    } else {
      setUser({ ...user, [name]: value });
    }
  };
  const fetchUser = async () => {
    const access_token = localStorage.getItem("access_token");

    if (access_token === null) {
      alert("Token is missing ");
      return;
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    };

    const response = await axios.get(`http://localhost:9091/users/v1/${id}`, { headers });
    console.log(response.data);
    setUser(response.data);
    setUserRoles(response.data.roles.map((i: any) => i.name));
    //console.log(user);
  };

  useEffect(() => {
    fetchUser();
    fetchAllRoles();
  }, []);

  const handleUpdateUser = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const access_token = localStorage.getItem("access_token");
    if (access_token === null) {
      alert("Please login first");
      navigate("/login");
    }
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    };

    console.log(user);
    // if no change in roles , convert it to list of role name
    const roleNamesOnly = userroles.map((role: any) => role.name);
    setUser({ ...user, roles: roleNamesOnly });

    try {
      const response = await axios.put(`http://localhost:9091/users/v1/update/${id}`, user, {
        headers,
      });
      console.log(response.data);
      alert("User updated successfully!");
      navigate("/users/viewallusers");
    } catch (error) {
      alert("Error");
      console.log("Error in creating user", error);
    }
  };

  return (
    <div>
      <div>Edit user</div>
      <br />
      <Box component="form" onSubmit={handleUpdateUser} noValidate sx={{ mt: 1 }}>
        <FormControl sx={{ m: 1 }}>
          <TextField
            label="Username"
            name="username"
            value={user.username}
            sx={{ width: 300 }}
            onChange={handleChange}
          />
        </FormControl>
        <br />
        <br />
        <FormControl sx={{ m: 1 }}>
          <TextField
            label="Firstname"
            name="firstName"
            value={user.firstName}
            sx={{ width: 300 }}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl sx={{ m: 1 }}>
          <TextField
            label="Lastname"
            name="lastName"
            value={user.lastName}
            sx={{ width: 300 }}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl sx={{ m: 1 }}>
          <TextField
            label="Contact "
            name="contactNumber"
            value={user.contactNumber}
            sx={{ width: 300 }}
            onChange={handleChange}
          />
        </FormControl>
        <br />
        <br />
        <FormControl sx={{ m: 1 }}>
          <TextField
            sx={{ width: 300 }}
            label="Created Date"
            name="created_on"
            value={user.baseTimeStamp.created_on}
            disabled
          />
        </FormControl>
        <FormControl sx={{ m: 1 }}>
          <TextField
            sx={{ width: 300 }}
            label="Created By"
            name="created_by"
            value={user.baseTimeStamp.created_by}
            disabled
          />
        </FormControl>
        <FormControl sx={{ m: 1 }}>
          <TextField
            sx={{ width: 300 }}
            label="Changed Date"
            name="changed_on"
            value={user.baseTimeStamp.changed_on}
            disabled
          />
        </FormControl>
        <FormControl sx={{ m: 1 }}>
          <TextField
            sx={{ width: 300 }}
            label="Changed By"
            name="changed_by"
            value={user.baseTimeStamp.changed_by}
            disabled
          />
        </FormControl>
        <br />
        <br />
        <FormControl sx={{ m: 1 }}>
          <FormControlLabel
            checked={user.active}
            control={<Checkbox />}
            label="Active"
            labelPlacement="end"
            name="active"
            onChange={handleChange}
          />
        </FormControl>
        <FormControl sx={{ m: 1 }}>
          <FormControlLabel
            checked={user.phoneVerified}
            control={<Checkbox />}
            label="Phone Verified"
            labelPlacement="end"
            name="phoneVerified"
            onChange={handleChange}
          />
        </FormControl>
        <FormControl sx={{ m: 1 }}>
          <FormControlLabel
            checked={user.emailVerified}
            control={<Checkbox />}
            label="Email Verified"
            labelPlacement="end"
            name="emailVerified"
            onChange={handleChange}
          />
        </FormControl>
        <br />
        <br />
        <FormControl sx={{ m: 1 }}>
          <TextField
            sx={{ width: 1020, m: 1 }}
            multiline
            label="Notes"
            rows={3}
            name="notes"
            value={user.notes}
            onChange={handleChange}
            placeholder="Additional Notes "
            variant="outlined"
          />
        </FormControl>
        <br /> <br />
        <div>Change the roles every edit - Bug</div>
        <FormControl sx={{ m: 1 }}>
          <InputLabel id="demo-multiple-checkbox-label">Roles</InputLabel>
          <Select
            sx={{ minWidth: 300 }}
            fullWidth
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={userroles}
            onChange={handleRoleChange}
            input={<OutlinedInput label="Roles" />}
            renderValue={(selected) => selected.join(", ")}
            MenuProps={MenuProps}
          >
            {roles.map((role) => (
              <MenuItem key={role.name} value={role.name}>
                <Checkbox checked={userroles.findIndex((item: any) => item === role.name) >= 0} />
                <ListItemText primary={role.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <br />
        <br />
        <Grid container spacing={12} justifyContent={"normal"}>
          <Grid item>
            <Button
              type="submit"
              sx={{ width: 300, height: 50 }}
              variant="contained"
              startIcon={<EditIcon />}
            >
              Update User
            </Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default EditUser;
