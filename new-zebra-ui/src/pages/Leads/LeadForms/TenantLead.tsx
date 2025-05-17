import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { MuiTelInput } from "mui-tel-input";
import { useState } from "react";

interface Location {
  name: string;
}

interface Asset {
  value: string;
  name: string;
}
interface TenantLead {
  firstName: string;
  lastName: string;
  emailId: string;
  contactNumber: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  notes: string;
  isLeadConverted: boolean;
  leadType: string;
  leadSource: string;
  minBudget: string;
  maxBudget: string;
  propertyType: string[];
  preferredLocations: Location[];
  assetConfigurations: Asset[];
  occupancyDate: string;
  isDateFlexible: boolean;
  isVegetarian: boolean;
  isHavingPets: boolean;
  isLookingForARoom: boolean;
  tenantType: string;
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
  {
    value: "GATED_SECURITY",
    label: "Gated Security",
  },
  {
    value: "GATED_APARTMENT",
    label: "Gated Apartment",
  },
  {
    value: "VILLA",
    label: "Villa",
  },
  {
    value: "PLOT",
    label: "Plot",
  },
  {
    value: "STANDALONE_BUILDING",
    label: "Standalone Building",
  },
];
const assetsConfigurations = [
  {
    value: "1RK",
    label: "1 RK",
  },
  {
    value: "1BHK",
    label: "1 BHK",
  },
  {
    value: "2BHK",
    label: "2 BHK",
  },
  {
    value: "3BHK",
    label: "3 BHK",
  },
  {
    value: "4BHK",
    label: "4 BHK",
  },
  {
    value: "4+BHK",
    label: "4+ BHK",
  },
];

const TenantLead = () => {
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

  const [tenantLeadForm, setTenantLeadForm] = React.useState<TenantLead>({
    firstName: "",
    lastName: "",
    emailId: "",
    contactNumber: "",
    isEmailVerified: false,
    isPhoneVerified: false,
    notes: "",
    isLeadConverted: false,
    leadType: "TENANT",
    leadSource: "",
    minBudget: "0",
    maxBudget: "",
    propertyType: [],
    preferredLocations: [],
    assetConfigurations: [],
    occupancyDate: "",
    isDateFlexible: false,
    isVegetarian: false,
    isHavingPets: false,
    isLookingForARoom: false,
    tenantType: "",
  });

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setTenantLeadForm({ ...tenantLeadForm, [name]: value });
  };

  const [contactNumber, setContactNumber] = React.useState("");

  const handleContactChange = (newContactNumber: string) => {
    setContactNumber(newContactNumber);
    setTenantLeadForm({ ...tenantLeadForm, contactNumber: newContactNumber });
  };

  const [preferredLocations, setPreferredLocations] = useState([]);
  const [propertyType, setpropertyType] = useState<string[]>([]);
  const [assetConfigurations, setassetConfiguration] = useState<string[]>([]);
  const handleMultiLocationChange = (event: any) => {
    setPreferredLocations(event.target.value);
    tenantLeadForm.preferredLocations = event.target.value;
  };
  const handlepropertyType = (event: any) => {
    setpropertyType(event.target.value);
    tenantLeadForm.propertyType = event.target.value;
  };
  const handleassetConfig = (event: any) => {
    setassetConfiguration(event.target.value);
    tenantLeadForm.assetConfigurations = event.target.value;
  };
  const handleCheckbox = (checked: boolean, name: string) => {
    let newData = { ...tenantLeadForm };
    newData = { ...newData, [name]: checked };
    setTenantLeadForm(newData);
  };
  const handleDateChange = (date: Date | null) => {
    if (date) {
      setTenantLeadForm({ ...tenantLeadForm, occupancyDate: date.toISOString() });
    }
  };

  const handleTenantLeadSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const access_token = localStorage.getItem("access_token");
    if (access_token === null) {
      alert("Please login first");
    }

    console.log(tenantLeadForm);
  };
  return (
    <>
      <div> Tenant Lead </div>
      {/* 
            firstName
            lastName
            emailId
            contactNumber
            isEmailVerified
            isPhoneVerified
            notes
            leadSource
            minBudget
            maxBudget
            propertyType - Gated Society, StandAlone
            preferredLocations
            assetConfig - 1bhk, 2 bhk, 3 bhk
            occupancyDate - 
            isDateFlexible
            tenantType - Family, Bachelors
            isVegetarian
            isHavingPets
            isLookingforaRoom
         */}
      <Box component="form" onSubmit={handleTenantLeadSubmit} sx={{ m: 1 }}>
        <FormControl sx={{ m: 1 }}>
          <TextField
            label="FirstName"
            name="firstName"
            value={tenantLeadForm.firstName}
            sx={{ width: 300 }}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl sx={{ m: 1 }}>
          <TextField
            label="LastName"
            name="lastName"
            value={tenantLeadForm.lastName}
            sx={{ width: 300 }}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl sx={{ m: 1 }}>
          <TextField
            label="Email"
            name="emailId"
            value={tenantLeadForm.emailId}
            sx={{ width: 300 }}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl sx={{ m: 1 }}>
          <MuiTelInput
            label="Phone"
            defaultCountry="IN"
            fullWidth
            value={tenantLeadForm.contactNumber}
            name="contactNumber"
            onChange={handleContactChange}
            sx={{ width: 300 }}
          />
        </FormControl>

        <br />
        <br />

        <FormControl sx={{ m: 1 }}>
          <FormControlLabel
            checked={tenantLeadForm.isEmailVerified}
            control={
              <Checkbox
                checked={tenantLeadForm.isEmailVerified}
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
            checked={tenantLeadForm.isPhoneVerified}
            control={
              <Checkbox
                checked={tenantLeadForm.isPhoneVerified}
                onChange={(event) => handleCheckbox(event.target.checked, "isPhoneVerified")}
              />
            }
            label="Phone Number Verified"
            labelPlacement="end"
            name="isPhoneVerified"
          />
        </FormControl>
        <FormControl sx={{ m: 1 }}>
          <FormControlLabel
            checked={tenantLeadForm.isDateFlexible}
            control={
              <Checkbox
                checked={tenantLeadForm.isDateFlexible}
                onChange={(event) => handleCheckbox(event.target.checked, "isDateFlexible")}
              />
            }
            label="Date Flexible"
            labelPlacement="end"
            name="isDateFlexible"
          />
        </FormControl>
        <FormControl sx={{ m: 1 }}>
          <FormControlLabel
            checked={tenantLeadForm.isLookingForARoom}
            control={
              <Checkbox
                checked={tenantLeadForm.isLookingForARoom}
                onChange={(event) => handleCheckbox(event.target.checked, "isLookingForARoom")}
              />
            }
            label="Looking For room"
            labelPlacement="end"
            name="isLookingForARoom"
          />
        </FormControl>
        <FormControl sx={{ m: 1 }}>
          <FormControlLabel
            checked={tenantLeadForm.isHavingPets}
            control={
              <Checkbox
                checked={tenantLeadForm.isHavingPets}
                onChange={(event) => handleCheckbox(event.target.checked, "isHavingPets")}
              />
            }
            label="Having Pets"
            labelPlacement="end"
            name="isHavingPets"
          />
        </FormControl>

        <br />
        <br />

        <FormControl sx={{ m: 1 }}>
          <TextField
            label="Lead Type"
            name="leadType"
            value={tenantLeadForm.leadType}
            sx={{ width: 300 }}
            inputProps={{ readOnly: true }}
          />
        </FormControl>

        <FormControl sx={{ m: 1 }}>
          <InputLabel id="facing">Lead Source</InputLabel>
          <Select
            sx={{ width: 300 }}
            labelId="leadSource"
            id="leadSourcel"
            value={tenantLeadForm.leadSource}
            label="Lead Source"
            name="leadSource"
            onChange={handleChange}
          >
            <MenuItem value="Facebook">Facebook</MenuItem>
            <MenuItem value="Instagram">Instagram</MenuItem>
            <MenuItem value="Website">Website</MenuItem>
            <MenuItem value="Reference">Reference</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ m: 1 }}>
          <TextField
            label="Min Budget"
            name="minBudget"
            value={tenantLeadForm.minBudget}
            sx={{ width: 300 }}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl sx={{ m: 1 }}>
          <TextField
            label="Max Budget"
            name="maxBudget"
            value={tenantLeadForm.maxBudget}
            sx={{ width: 300 }}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl sx={{ m: 1 }}>
          <InputLabel id="preferredTenants-label"> Tenanats</InputLabel>
          <Select
            sx={{ width: 300 }}
            id="preferredTenants-type"
            name="tenantType"
            value={tenantLeadForm.tenantType}
            onChange={handleChange}
            label="tenantType"
          >
            {preferredTenants.map(({ value, label }, index) => (
              <MenuItem value={value}>{label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1 }}>
          <InputLabel id="facing">BHK Type</InputLabel>
          <Select
            sx={{ width: 300 }}
            fullWidth
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={assetConfigurations}
            onChange={handleassetConfig}
            input={<OutlinedInput label="Asset Configurations" notched />}
            renderValue={(selected) => selected.join(", ")}
          >
            {assetsConfigurations.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Checkbox checked={assetConfigurations.includes(option.value)} />{" "}
                {/* Adjust checked value */}
                <ListItemText primary={option.label} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ m: 1 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Occupancy Date "
              name="occupancyDate"
              value={tenantLeadForm.occupancyDate ? new Date(tenantLeadForm.occupancyDate) : null}
              onChange={handleDateChange}
            />
          </LocalizationProvider>
        </Box>
        <br />
        <FormControl sx={{ m: 1 }}>
          <InputLabel id="facing">Property Type</InputLabel>
          <Select
            sx={{ width: 300 }}
            fullWidth
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={propertyType}
            onChange={handlepropertyType}
            input={<OutlinedInput label="Property Type" notched />}
            renderValue={(selected) => selected.join(", ")}
          >
            {propertyTypeArray.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Checkbox checked={propertyType.includes(option.value)} />{" "}
                {/* Adjust checked value */}
                <ListItemText primary={option.label} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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
            onChange={handleMultiLocationChange}
            input={<OutlinedInput label="Preferred Locations" notched />}
            renderValue={(selected) => selected.join(", ")}
            MenuProps={MenuProps}
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
        <br />
        <Grid sx={{ m: 1 }}>
          <TextField
            sx={{ width: 1020 }}
            multiline
            label="Notes"
            name="notes"
            value={tenantLeadForm.notes}
            onChange={handleChange}
            rows={3}
            variant="outlined"
          />
        </Grid>
        <br />

        <Grid container spacing={12} justifyContent={"normal"}>
          <Grid item>
            <Button type="submit" sx={{ width: 300, height: 50 }} variant="contained">
              Add Tenant Lead
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default TenantLead;
