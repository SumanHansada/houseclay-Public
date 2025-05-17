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
} from "@mui/material";
import { MuiTelInput } from "mui-tel-input";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

const SellerLead = () => {
  const leadSource = [
    {
      value: "Facebook",
      label: "Facebook",
    },
    {
      value: "Instagram",
      label: "Instagram",
    },
    {
      value: "Reference",
      label: "Reference",
    },
    {
      value: "Website",
      label: "Website",
    },
    {
      value: "Other",
      label: "Other",
    },
  ];
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    contactNumber: "",
    leadSource: "",
    notes: "",
    propertyType: "",
    apartmentName: "",
    locality: "",
    leadType: "SELLER",
    googleMapLocationUrl: "",
    expectedPrice: "",
    isEmailVerified: false,
    isPhoneVerified: false,
    currentlyOccupiedBy: "",
    isRentalPossible: false,
  });
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

  const handleCheckbox = (checked: boolean, name: string) => {
    let newData = { ...data };
    newData = { ...newData, [name]: checked };
    setData(newData);
  };

  const [contactNumber, setContactNumber] = useState("");
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
      <form onSubmit={handleSubmit}>
        <Grid container my={4} alignItems="center" sx={{ m: 1 }}>
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
              <MenuItem value="gated_apartment">Gated Apartment</MenuItem>
              <MenuItem value="gated_scoiety">Gated Society</MenuItem>
              <MenuItem value="villa">Villa</MenuItem>
              <MenuItem value="standalone_building">Standalone Building</MenuItem>
              <MenuItem value="plot">Plot</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid sx={{ m: 1 }}>
          <TextField
            label="Apartment Name"
            name="apartmentName"
            value={data.apartmentName}
            onChange={handleChange}
            id="outlined-start-adornment"
            sx={{ width: 300, m: 1 }}
          />
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
          <TextField
            label="Expected Price"
            name="expectedPrice"
            value={data.expectedPrice}
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
            label="Currently Occupied By"
            name="currentlyOccupiedBy"
            value={data.currentlyOccupiedBy}
            onChange={handleChange}
            id="outlined-start-adornment"
            sx={{ width: 300, m: 1 }}
          />
          <FormControl sx={{ m: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={data.isRentalPossible}
                  onChange={(event) => handleCheckbox(event.target.checked, "isRentalPossible")}
                />
              }
              label="Rental Possible"
              labelPlacement="end"
              name="isEmailVerified"
            />
          </FormControl>
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
              Add Seller Lead
            </Button>
          </FormControl>
        </Grid>
      </form>
    </div>
  );
};

export default SellerLead;
