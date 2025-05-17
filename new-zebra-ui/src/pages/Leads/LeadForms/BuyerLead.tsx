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
  Box,
  ListItemText,
  OutlinedInput,
} from "@mui/material";
import { MuiTelInput } from "mui-tel-input";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

const BuyerLead = () => {
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
  const furnitures = [
    {
      value: "1",
      label: "Fully furnished",
    },
    {
      value: "2",
      label: "Semi-furnished",
    },
  ];
  const bhkTypes = [
    {
      value: "1rk",
      label: "1 RK",
    },
    {
      value: "1bhk",
      label: "1 BHK",
    },
    {
      value: "2bhk",
      label: "2 BHK",
    },
    {
      value: "3bhk",
      label: "3 BHK",
    },
    {
      value: "4bhk",
      label: "4 BHK",
    },
    {
      value: "4plusbhk",
      label: "4+ BHK",
    },
  ];

  const preferredLocationsArray = [
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
  const propertyTypeArray = [
    "Gated Apartment",
    "Gated Society",
    "Villa",
    "Standalone Building",
    "Plot",
  ];

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    contactNumber: "",
    leadSource: "",
    notes: "",
    propertyType: [],
    leadType: "BUYER",
    minBudget: "",
    maxBudget: "",
    occupancyDate: "",
    isEmailVerified: false,
    isPhoneVerified: false,

    preferredLocations: [],
    isDateFlexible: false,
  });
  const handleDateChange = (date: Date | null) => {
    if (date) {
      setData({ ...data, occupancyDate: date.toISOString() });
      setIsValid(data.occupancyDate !== "");
      console.log(date);
    }
  };
  const [preferredLocations, setPreferredLocations] = useState([]);
  const [propertyType, setPropertyType] = useState([]);
  const handlePreferredLocationChange = (event: any) => {
    setPreferredLocations(event.target.value);
    data.preferredLocations = event.target.value;
  };
  const handlePropertyTypeChange = (event: any) => {
    setPropertyType(event.target.value);
    data.propertyType = event.target.value;
  };
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
          <Grid sx={{ m: 1 }}>
            <FormControl sx={{ m: 1 }}>
              <InputLabel id="propertyType-label">Property Type</InputLabel>
              <Select
                sx={{ width: 300 }}
                fullWidth
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={propertyType}
                onChange={handlePropertyTypeChange}
                input={<OutlinedInput label="Property Type" notched />}
                renderValue={(selected) => selected.join(", ")}
              >
                {propertyTypeArray.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={propertyType.findIndex((item: any) => item === name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid sx={{ m: 1 }}>
          <TextField
            label="Min Budget"
            name="minBudget"
            value={data.minBudget}
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
            label="Max Budget"
            name="maxBudget"
            value={data.maxBudget}
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
          <Box sx={{ m: 1 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Occupancy Date "
                name="occupancyDate"
                value={data.occupancyDate ? new Date(data.occupancyDate) : null}
                onChange={handleDateChange}
              />
            </LocalizationProvider>
            <FormControl sx={{ m: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={data.isDateFlexible}
                    onChange={(event) => handleCheckbox(event.target.checked, "isDateFlexible")}
                  />
                }
                label="Is Date Flexible"
                labelPlacement="end"
                name="isEmailVerified"
              />
            </FormControl>
          </Box>
          <FormControl sx={{ m: 1 }}>
            <InputLabel id="demo-multiple-checkbox-label" shrink>
              Preferred Locations
            </InputLabel>
            <Select
              sx={{ minWidth: 600 }}
              fullWidth
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={preferredLocations}
              onChange={handlePreferredLocationChange}
              input={<OutlinedInput label="Preferred Locations" notched />}
              renderValue={(selected) => selected.join(", ")}
            >
              {preferredLocationsArray.map((name) => (
                <MenuItem key={name} value={name}>
                  <Checkbox
                    checked={preferredLocations.findIndex((item: any) => item === name) > -1}
                  />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
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
          <FormControl sx={{ m: 1 }}>
            <Button sx={{ width: 160, height: 50 }} variant="contained" type="submit">
              Add Buyer Lead
            </Button>
          </FormControl>
        </Grid>
      </form>
    </div>
  );
};

export default BuyerLead;
