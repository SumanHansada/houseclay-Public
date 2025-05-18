import { useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Grid,
  FormGroup,
  Box,
} from "@mui/material";
import { MuiTelInput } from "mui-tel-input";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OwnerLead = () => {
  const navigate = useNavigate();

  const leadSource = [
    {
      value: "FACEBOOK",
      label: "Facebook",
    },
    {
      value: "INSTAGRAM",
      label: "Instagram",
    },
    {
      value: "REFERENCE",
      label: "Reference",
    },
    {
      value: "WEBSITE",
      label: "Website",
    },
    {
      value: "OTHER",
      label: "Other",
    },
  ];
  const preferredTenants = [
    {
      value: "BACHELORS",
      label: "Bachelors",
    },
    {
      value: "BACHELOR_GIRLS",
      label: "Bachelor Girls",
    },
    {
      value: "BACHELOR_BOYS",
      label: "Bachelor Boys",
    },
    {
      value: "FAMILY",
      label: "Family",
    },
    {
      value: "ANY",
      label: "Any",
    },
  ];
  const furnitures = [
    {
      value: "Fully Furnished",
      label: "Fully Furnished",
    },
    {
      value: "Semi Furnished",
      label: "Semi Furnished",
    },
  ];
  const bhkTypes = [
    {
      value: "1Rk",
      label: "1 RK",
    },
    {
      value: "1Bhk",
      label: "1 BHK",
    },
    {
      value: "2Bhk",
      label: "2 BHK",
    },
    {
      value: "3Bhk",
      label: "3 BHK",
    },
    {
      value: "4Bhk",
      label: "4 BHK",
    },
    {
      value: "4+Bhk",
      label: "4+ BHK",
    },
  ];
  const locality = [
    "Bellandur",
    "Kadubeesanahalli",
    "Sarjapur",
    "HSR Layout",
    "Marathahalli",
    "Brookefield",
    "WhiteField",
    "Mahadevpura",
    "Agara Lake",
    "Harlur Road",
    "Carmeralum",
    "Iblur Lake",
  ];

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    contactNumber: "",
    leadSource: "",
    notes: "",
    propertyType: "",
    bhkType: "",
    apartmentName: "",
    locality: "",
    leadType: "OWNER",
    googleMapLocationUrl: "",
    expectedRent: "",
    expectedDeposit: "",
    furnishing: "",
    availableFrom: "",
    isEmailVerified: false,
    isPhoneVerified: false,
    preferredTenants: "",
    isNonVegAllowed: false,
    isPetAllowed: false,
    clayManage: false,
  });
  const handleCheckbox = (checked: boolean, name: string) => {
    let newData = { ...data };
    newData = { ...newData, [name]: checked };
    setData(newData);
  };
  const [contactNumber, setContactNumber] = useState("");
  const handleDateChange = (date: Date | null) => {
    if (date) {
      setData({ ...data, availableFrom: date.toISOString() });
      setIsValid(data.availableFrom !== "");
      console.log(date);
    }
  };
  const handleContactChange = (newContactNumber: string) => {
    setContactNumber(newContactNumber);
    setData({ ...data, contactNumber: newContactNumber });
  };
  const [isValid, setIsValid] = useState(false);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    contactNumber: "",
  });
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newErrors = { ...errors };
    let valid = true;
    if (!data.firstName) {
      valid = false;
      newErrors.firstName = "First Name is required";
    }
    if (!data.lastName) {
      valid = false;
      newErrors.lastName = "Last Name is required";
    }
    if (!data.emailId) {
      valid = false;
      newErrors.emailId = "E-mail is required";
    }
    if (!data.contactNumber) {
      valid = false;
      newErrors.contactNumber = "Contact Number is required";
    }
    setErrors(newErrors);
    if (valid) {
      console.log({ data });
    } else {
      alert("Fill all the details");
    }
  };
  const handleOwnerLead = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    alert("Inside handleOwnerLead");
    const access_token = localStorage.getItem("access_token");
    if (access_token === null) {
      alert("Please login first");
      navigate("/login");
    }
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    };
    console.log(data);
    try {
      const response = await axios.post(
        "http://localhost:9091/owner-leads/v1/register-owner-lead",
        data,
        { headers }
      );
      console.log(response.data);
      alert(response.data);
      navigate("/leads/allleads");
    } catch (error) {
      console.log("Error creating lead", error);
    }
  };
  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setData({ ...data, [name as string]: value });
    setIsValid(
      data.firstName !== "" &&
        data.lastName !== "" &&
        data.emailId !== "" &&
        data.contactNumber !== ""
    );
  };
  return (
    <div>
      <Box component="form" onSubmit={handleOwnerLead} noValidate sx={{ mt: 1 }}>
        <Grid sx={{ m: 1 }}>
          <TextField
            label="First Name"
            name="firstName"
            value={data.firstName}
            onChange={handleChange}
            error={!!errors.firstName}
            required
            id="outlined-start-adornment"
            sx={{ width: 300, m: 1 }}
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={data.lastName}
            onChange={handleChange}
            error={!!errors.lastName}
            required
            id="outlined-start-adornment"
            sx={{ width: 300, m: 1 }}
          />
          <TextField
            label="E-mail"
            name="emailId"
            value={data.emailId}
            onChange={handleChange}
            error={!!errors.emailId}
            required
            id="outlined-start-adornment"
            sx={{ width: 300, m: 1 }}
          />
          <FormControl sx={{ m: 1 }}>
            <MuiTelInput
              label="Contact Number"
              required
              defaultCountry="IN"
              fullWidth
              name="contactNumber"
              onChange={handleContactChange}
              value={data.contactNumber}
              error={!!errors.contactNumber}
              sx={{ width: 300 }}
            />
          </FormControl>
        </Grid>
        <Grid sx={{ m: 1 }}>
          <FormControl sx={{ m: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={data.isEmailVerified}
                  onChange={(event) => handleCheckbox(event.target.checked, "isEmailVerified")}
                />
              }
              label="Email Verified"
              labelPlacement="end"
              name="isEmailVerified"
            />
          </FormControl>
          <FormControl sx={{ m: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={data.isPhoneVerified}
                  onChange={(event) => handleCheckbox(event.target.checked, "isPhoneVerified")}
                />
              }
              label="Phone  Verified"
              labelPlacement="end"
              name="isPhoneVerified"
            />
          </FormControl>
          <FormControl sx={{ m: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={data.clayManage}
                  onChange={(event) => handleCheckbox(event.target.checked, "clayManage")}
                />
              }
              label="Opted for ClayManage"
              labelPlacement="end"
              name="clayManage"
            />
          </FormControl>
        </Grid>
        <Grid container my={4} alignItems="center" sx={{ m: 1 }}>
          <FormControl sx={{ m: 1 }}>
            <InputLabel id="leadsource-label">Lead Source</InputLabel>
            <Select
              sx={{ width: 300 }}
              id="lead-source"
              value={data.leadSource}
              label="LeadSource"
              name="leadSource"
              onChange={handleChange}
            >
              {leadSource.map(({ value, label }, index) => (
                <MenuItem value={value}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Grid sx={{ m: 1 }}>
            <TextField
              label="Lead Type"
              name="leadType"
              value={data.leadType}
              required
              id="outlined-start-adornment"
              sx={{ width: 300 }}
            />
          </Grid>
        </Grid>

        <Grid sx={{ m: 1 }}>
          <FormControl sx={{ m: 1 }}>
            <InputLabel id="propertyType-label">Property Type</InputLabel>
            <Select
              sx={{ width: 300 }}
              id="property-type"
              name="propertyType"
              value={data.propertyType}
              onChange={handleChange}
              label="PropertyType"
            >
              <MenuItem value="GATED_APARTMENT">Gated Apartment</MenuItem>
              <MenuItem value="GATED_SOCIETY">Gated Society</MenuItem>
              <MenuItem value="VILLA">Villa</MenuItem>
              <MenuItem value="STANDALONE_BUILDING">Standalone Building</MenuItem>
              <MenuItem value="PLOT">Plot</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1 }}>
            <InputLabel id="BHKTYPE-label">BHK Type</InputLabel>
            <Select
              sx={{ width: 300 }}
              id="bhktype-type"
              name="bhkType"
              value={data.bhkType}
              onChange={handleChange}
              label="BHKType"
            >
              {bhkTypes.map(({ value, label }, index) => (
                <MenuItem value={value}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Apartment Name"
            name="apartmentName"
            value={data.apartmentName}
            onChange={handleChange}
            id="outlined-start-adornment"
            sx={{ width: 300, m: 1 }}
          />
        </Grid>
        <Grid sx={{ m: 1 }}>
          <FormControl sx={{ m: 1 }}>
            <InputLabel id="locality-label">Locality</InputLabel>
            <Select
              sx={{ width: 300 }}
              id="locality-type"
              name="locality"
              value={data.locality}
              onChange={handleChange}
              label="Locality"
            >
              {/* Mapping over the locality array and rendering a MenuItem for each locality option */}
              {locality.map((value, index) => (
                <MenuItem key={index} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Google Map Location URL"
            name="googleMapLocationUrl"
            value={data.googleMapLocationUrl}
            onChange={handleChange}
            id="outlined-start-adornment"
            sx={{ width: 300, m: 1 }}
          />
        </Grid>
        <Grid sx={{ m: 1 }}>
          <FormControl sx={{ m: 1 }}>
            <InputLabel id="preferredTenants-label">Preferred Tenanats</InputLabel>
            <Select
              sx={{ width: 300 }}
              id="preferredTenants-type"
              name="preferredTenants"
              value={data.preferredTenants}
              onChange={handleChange}
              label="BHKType"
            >
              {preferredTenants.map(({ value, label }, index) => (
                <MenuItem value={value}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid sx={{ m: 1 }}>
          <FormControl component="fieldset" sx={{ m: 1 }}>
            <FormGroup row>
              <FormControlLabel
                sx={{ paddingRight: "150px" }}
                value="end"
                control={
                  <Checkbox
                    checked={data.isNonVegAllowed}
                    onChange={(event) => handleCheckbox(event.target.checked, "isNonVegAllowed")}
                  />
                }
                name="isNonVegAllowed"
                label="Is Non-Veg Allowed"
                labelPlacement="end"
              />
              <FormControlLabel
                sx={{ paddingRight: "150px" }}
                value="end"
                control={
                  <Checkbox
                    checked={data.isPetAllowed}
                    onChange={(event) => handleCheckbox(event.target.checked, "isPetAllowed")}
                  />
                }
                label="Is Pet Allowed"
                name="isPetAllowed"
                labelPlacement="end"
              />
            </FormGroup>
          </FormControl>
        </Grid>
        <Grid sx={{ m: 1 }}>
          <TextField
            label="Expected Rent"
            name="expectedRent"
            value={data.expectedRent}
            onChange={handleChange}
            id="outlined-start-adornment"
            sx={{ width: 300, m: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CurrencyRupeeIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Expected Deposit"
            name="expectedDeposit"
            value={data.expectedDeposit}
            onChange={handleChange}
            id="outlined-start-adornment"
            sx={{ width: 300, m: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CurrencyRupeeIcon />
                </InputAdornment>
              ),
            }}
          />
          <FormControl sx={{ m: 1 }}>
            <InputLabel id="Furnishing-label">Furnishing</InputLabel>
            <Select
              sx={{ width: 300 }}
              id="Furnishing"
              name="furnishing"
              value={data.furnishing}
              onChange={handleChange}
              label="Furnishing"
            >
              {furnitures.map(({ value, label }, index) => (
                <MenuItem value={value}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ m: 1 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Available From "
                name="availableFrom"
                value={data.availableFrom ? new Date(data.availableFrom) : null}
                onChange={handleDateChange}
              />
            </LocalizationProvider>
          </Box>
        </Grid>
        <Grid sx={{ m: 1 }}>
          <TextField
            sx={{ width: 1020, m: 1 }}
            multiline
            label="Notes"
            name="notes"
            value={data.notes}
            onChange={handleChange}
            rows={3}
            variant="outlined"
          />
        </Grid>
        <Grid container justifyContent="start">
          <FormControl sx={{ m: 2 }}>
            <Button sx={{ width: 160, height: 50 }} variant="contained" type="submit">
              Add Owner Lead
            </Button>
          </FormControl>
        </Grid>
      </Box>
    </div>
  );
};
export default OwnerLead;
