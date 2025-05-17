import { FormControl } from "@mui/material";

import { TextField, FormControlLabel, Checkbox } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ViewUser = () => {
  const { id } = useParams();

  const [user, setUser] = useState({
    username: "",
    active: false,
    emailVerified: false,
    phoneVerified: false,
    firstName: "",
    lastName: "",
    notes: "",
    baseTimeStamp: {
      created_on: "",
      created_by: "",
      changed_on: "",
      changed_by: "",
    },
    roles: [{ name: "" }],
  });

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
    //console.log(user);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <div>View: {id}</div>
      <div>
        <br />

        <Box component="form" sx={{ mt: 1 }}>
          <FormControl sx={{ m: 1 }}>
            <TextField
              label="Username"
              name="username"
              value={user.username}
              sx={{ width: 300 }}
              inputProps={{ readOnly: true }}
            />
          </FormControl>
          <br />
          <br />

          <FormControl sx={{ m: 1 }}>
            <TextField
              sx={{ width: 300 }}
              label="Firstname"
              name="firstname"
              value={user.firstName}
            />
          </FormControl>

          <FormControl sx={{ m: 1 }}>
            <TextField sx={{ width: 300 }} label="Lastname" name="lastname" value={user.lastName} />
          </FormControl>

          <FormControl sx={{ m: 1 }}>
            <TextField
              sx={{ width: 300 }}
              label="Created Date"
              name="created_on"
              value={user.baseTimeStamp.created_on}
            />
          </FormControl>

          <FormControl sx={{ m: 1 }}>
            <TextField
              sx={{ width: 300 }}
              label="Created By"
              name="created_by"
              value={user.baseTimeStamp.created_by}
            />
          </FormControl>

          <br />
          <br />

          <FormControl sx={{ m: 1 }}>
            <TextField
              sx={{ width: 300 }}
              label="Changed Date"
              name="changed_on"
              value={user.baseTimeStamp.changed_on}
            />
          </FormControl>

          <FormControl sx={{ m: 1 }}>
            <TextField
              sx={{ width: 300 }}
              label="Changed By"
              name="changed_by"
              value={user.baseTimeStamp.changed_by}
            />
          </FormControl>

          <br />
          <br />

          <FormControl sx={{ m: 1 }}>
            <FormControlLabel
              checked={user.emailVerified}
              control={<Checkbox />}
              label="Email Verified"
              labelPlacement="end"
              name="emailVerified"
            />
          </FormControl>

          <FormControl sx={{ m: 1 }}>
            <FormControlLabel
              checked={user.phoneVerified}
              control={<Checkbox />}
              label="Phone Verified"
              labelPlacement="end"
              name="phoneVerified"
            />
          </FormControl>

          <FormControl sx={{ m: 1 }}>
            <FormControlLabel
              checked={user.active}
              control={<Checkbox />}
              label="Active"
              labelPlacement="end"
              name="active"
            />
          </FormControl>

          <br />
          <br />

          <FormControl sx={{ m: 1 }}>
            <TextField
              sx={{ width: 600 }}
              label="Roles"
              name="roles"
              value={user.roles.map((role) => role.name).join(" , ")}
            />
          </FormControl>

          <FormControl sx={{ m: 1 }}>
            <TextField
              sx={{ width: 1020, m: 1 }}
              multiline
              label="Notes"
              rows={3}
              name="notes"
              value={user.notes}
              placeholder="Additional Notes "
              variant="outlined"
            />
          </FormControl>
        </Box>
      </div>
    </>
  );
};

export default ViewUser;
