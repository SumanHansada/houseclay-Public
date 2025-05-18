import { VisibilityOff, Visibility } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { MuiTelInput } from "mui-tel-input";
import axios from "axios";
import { useNavigate } from "react-router";
type Props = {};

interface NewUserData {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  contactNumber: string;
  active: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  notes: string;
}
const NewUser = (props: Props) => {
  const [formData, setFormData] = React.useState<NewUserData>({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    contactNumber: "",
    active: false,
    emailVerified: false,
    phoneVerified: false,
    notes: "",
  });

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleChange = (event: any) => {
    if (
      event.target.name === "emailVerified" ||
      event.target.name === "phoneVerified" ||
      event.target.name === "active"
    ) {
      console.log(event.target);
      setFormData({
        ...formData,
        [event.target.name]: event.target.checked,
      });
    } else {
      const { name, value } = event.target;
      setFormData({ ...formData, [name]: value });
    }
  };

  const navigate = useNavigate();
  const [contactNumber, setContactNumber] = React.useState("");

  const handleContactChange = (newContactNumber: string) => {
    setContactNumber(newContactNumber);
    setFormData({ ...formData, contactNumber: newContactNumber });
  };

  const handleCreateuser = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // Get access_token from localStorage
    const access_token = localStorage.getItem("access_token");

    // Create headers object with access_token
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    };
    try {
      const response = await axios.post("http://localhost:9091/users/v1/register-user", formData, {
        headers,
      });
      console.log(response.data);
      alert("User created successfully!");
      navigate("/users/viewallusers");
    } catch (error) {
      console.log("Error in creating user", error);
    }
  };
  return (
    <div>
      <div>Register New User</div>
      <br />
      <Box component="form" onSubmit={handleCreateuser} noValidate sx={{ mt: 1 }}>
        <FormControl sx={{ m: 1 }}>
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            sx={{ width: 300 }}
            onChange={handleChange}
            placeholder="Enter email"
          />
        </FormControl>
        <FormControl sx={{ m: 1 }}>
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
            sx={{ width: 300 }}
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </FormControl>
        <br />
        <br />
        <FormControl sx={{ m: 1 }}>
          <TextField
            label="Firstname"
            sx={{ width: 300 }}
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl sx={{ m: 1 }}>
          <TextField
            label="Lastname"
            sx={{ width: 300 }}
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl sx={{ m: 1 }}>
          <MuiTelInput
            label="Phone"
            defaultCountry="IN"
            fullWidth
            value={contactNumber}
            name="contactNumber"
            onChange={handleContactChange}
            sx={{ width: 300 }}
          />
        </FormControl>
        <br />
        <br />
        <FormControl sx={{ m: 1 }}>
          <FormControlLabel
            checked={formData.emailVerified}
            control={<Checkbox />}
            label="Email Verified"
            labelPlacement="end"
            name="emailVerified"
            onChange={handleChange}
          />
        </FormControl>
        <br /> <br />
        <FormControl sx={{ m: 1 }}>
          <FormControlLabel
            checked={formData.phoneVerified}
            control={<Checkbox />}
            label="Phone Number Verified"
            labelPlacement="end"
            name="phoneVerified"
            onChange={handleChange}
          />
        </FormControl>
        <br /> <br />
        <FormControl sx={{ m: 1 }}>
          <FormControlLabel
            checked={formData.active}
            control={<Checkbox />}
            label="User Active"
            labelPlacement="end"
            name="active"
            onChange={handleChange}
          />
        </FormControl>
        <br /> <br />
        <TextField
          sx={{ width: 1020, m: 1 }}
          multiline
          label="Notes"
          rows={3}
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Additional Notes "
          variant="outlined"
        />
        <br /> <br />
        <Grid container spacing={12} justifyContent={"normal"}>
          <Grid item>
            <Button
              type="submit"
              sx={{ width: 300, height: 50 }}
              variant="contained"
              startIcon={<PersonAddIcon />}
            >
              Create User
            </Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default NewUser;
