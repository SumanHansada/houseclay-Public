import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
  InputAdornment,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  Button,
} from "@mui/material";
import { useState, type ChangeEvent } from "react";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Box } from "@mui/material";

// import Checkbox from '@mui/material/Checkbox';
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";

type Props = {
  onNextTab: () => void;
  OnPrevTab: () => void;
};

const RentalDetails = (props: Props) => {
  const propertyAvailableTypes = [
    {
      value: "rent",
      label: "Rent",
    },
    {
      value: "lease",
      label: "Lease",
    },
  ];

  const maintenance = [
    {
      value: "1",
      label: "Maintenance Included",
    },
    {
      value: "2",
      label: "Maintenance Extra",
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
    {
      value: "3",
      label: "Unfurnished",
    },
  ];

  const park = [
    {
      value: "1",
      label: "Bike",
    },
    {
      value: "2",
      label: "Car",
    },
    {
      value: "3",
      label: "Both",
    },
    {
      value: "4",
      label: "None",
    },
  ];

  const [monthlyMaintenence, setmonthlyMaintenence] = useState("");
  const [value, setValue] = useState(null);
  const [furniture, setFurniture] = useState("");
  const [parking, setParking] = useState("");
  const [formData, setFormData] = useState({
    propertyAvailable: "",
    ExpectedRent: "",
    ExpectedDeposit: "",
    monthlyMaintenence: "",
    AvailableFrom: "",
    furniture: "",
    parking: "",
    Description: "",
    preferredTenanats: "",
    expectedMaintenance: "",
  });
  const [errors, setErrors] = useState({
    propertyAvailable: "",
    ExpectedRent: "",
    ExpectedDeposit: "",
    monthlyMaintenence: "",
    AvailableFrom: "",
    furniture: "",
    parking: "",
    Description: "",
  });
  const [isValid, setIsValid] = useState(false);
  const handleChange = (
    event: SelectChangeEvent<string> | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name as string]: value });
    setIsValid(
      formData.propertyAvailable !== "" &&
        formData.ExpectedRent !== "" &&
        formData.ExpectedDeposit !== "" &&
        formData.monthlyMaintenence !== "" &&
        formData.furniture !== "" &&
        formData.parking !== "" &&
        formData.Description !== ""
    );
  };
  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData({ ...formData, AvailableFrom: date.toISOString() });
      setIsValid(formData.AvailableFrom !== "");
      console.log(date);
    }
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newErrors = { ...errors };

    let isValidForm = true;
    if (!formData.propertyAvailable) {
      newErrors.propertyAvailable = "City is required";
      isValidForm = false;
    }
    if (!formData.ExpectedRent) {
      newErrors.ExpectedRent = "Locality is required";
      isValidForm = false;
    }
    if (!formData.ExpectedDeposit) {
      newErrors.ExpectedDeposit = "Landmark is required";
      isValidForm = false;
    }
    if (!formData.monthlyMaintenence) {
      newErrors.monthlyMaintenence = "Landmark is required";
      isValidForm = false;
    }
    if (!formData.AvailableFrom) {
      newErrors.AvailableFrom = "Landmark is required";
      isValidForm = false;
    }
    if (!formData.furniture) {
      newErrors.furniture = "Landmark is required";
      isValidForm = false;
    }
    if (!formData.parking) {
      newErrors.parking = "Landmark is required";
      isValidForm = false;
    }
    if (!formData.Description) {
      newErrors.Description = "Description is required";
      isValidForm = false;
    }
    console.log("Formd data is ", formData);

    setErrors(newErrors);
    if (isValidForm) {
      props.onNextTab();
    } else {
      alert("Fill all the details");
    }
  };
  const [Maintenance, setMaintenance] = useState("");
  const [isexpectedMaintenanceHidden, setisexpectedMaintenanceHidden] = useState(false);

  const handleExpectedmaintenance = (event: SelectChangeEvent) => {
    const option = event.target.value as string;
    setMaintenance(option);
    setFormData({ ...formData, monthlyMaintenence: option });
    if (option === "2") setisexpectedMaintenanceHidden(true);
    else setisexpectedMaintenanceHidden(false);
  };

  const furnitureChangeHandler = (event: SelectChangeEvent) => {
    setFurniture(event.target.value);
  };

  const parkingChangeHandler = (event: SelectChangeEvent) => {
    setParking(event.target.value);
  };

  const [propertyAvailableType, setpropertyAvailableType] = useState("");
  const propertyAvailableTypeHandleChange = (event: SelectChangeEvent) => {
    setpropertyAvailableType(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <FormControl sx={{ m: 1 }}>
          <InputLabel id="demo-select-small">Property For</InputLabel>
          <Select
            sx={{ width: 500 }}
            labelId="demo-select-small"
            id="demo-select-small"
            value={formData.propertyAvailable}
            label="ApartmentType"
            name="propertyAvailable"
            onChange={handleChange}
            error={!!errors.propertyAvailable}
          >
            {propertyAvailableTypes.map(({ value, label }, index) => (
              <MenuItem value={value}>{label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <br />
      <br />

      <div>
        <FormControl sx={{ m: 1 }}>
          <TextField
            label="Expected Rent"
            id="outlined-start-adornment"
            sx={{ width: 500 }}
            name="ExpectedRent"
            value={formData.ExpectedRent}
            onChange={handleChange}
            error={!!errors.ExpectedRent}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CurrencyRupeeIcon />
                </InputAdornment>
              ),
              endAdornment: <InputAdornment position="end">/Month</InputAdornment>,
            }}
          />
        </FormControl>

        <FormControl sx={{ m: 1 }}>
          <TextField
            label="Expected Deposit"
            name="ExpectedDeposit"
            value={formData.ExpectedDeposit}
            onChange={handleChange}
            id="outlined-start-adornment"
            sx={{ width: 500 }}
            error={!!errors.ExpectedDeposit}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CurrencyRupeeIcon />
                </InputAdornment>
              ),
            }}
          />
        </FormControl>

        <br />
        <br />
        <FormControl sx={{ m: 1 }}>
          <FormControlLabel control={<Checkbox defaultChecked={false} />} label="Rent Negotiable" />

          <div>
            <FormControl sx={{ m: 1 }}>
              <InputLabel id="demo-select-small">Monthly Maintenance</InputLabel>
              <Select
                sx={{ width: 400 }}
                labelId="demo-select-small"
                id="demo-select-small"
                name="monthlyMaintenence"
                value={formData.monthlyMaintenence}
                label="ApartmentType"
                error={!!errors.monthlyMaintenence}
                onChange={handleExpectedmaintenance}
              >
                {maintenance.map(({ value, label }, index) => (
                  <MenuItem value={value}>{label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {isexpectedMaintenanceHidden && (
              <FormControl sx={{ m: 1 }}>
                <TextField
                  label="Expected Maintenance"
                  id="outlined-start-adornment"
                  sx={{ width: 500 }}
                  value={formData.expectedMaintenance}
                  onChange={handleChange}
                  name="expectedMaintenance"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CurrencyRupeeIcon />
                      </InputAdornment>
                    ),
                    endAdornment: <InputAdornment position="end">/Month</InputAdornment>,
                  }}
                />
              </FormControl>
            )}
          </div>
        </FormControl>
      </div>

      <Box sx={{ m: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Available From "
            name="AvailableFrom"
            value={formData.AvailableFrom ? new Date(formData.AvailableFrom) : null}
            onChange={handleDateChange}
          />
        </LocalizationProvider>
      </Box>
      <br />

      <FormControl component="fieldset" sx={{ m: 1 }}>
        <FormLabel component="legend" required>
          Preferred Tenants
        </FormLabel>
        <FormGroup aria-label="position" row>
          <FormControlLabel
            sx={{ paddingRight: "150px" }}
            value="top"
            control={<Checkbox />}
            label="Anyone"
            labelPlacement="end"
          />
          <FormControlLabel
            sx={{ paddingRight: "150px" }}
            value="start"
            control={<Checkbox />}
            label="Family"
            labelPlacement="end"
          />
          <FormControlLabel
            sx={{ paddingRight: "150px" }}
            value="bottom"
            control={<Checkbox />}
            label="Bachelor Female"
            labelPlacement="end"
          />
          <FormControlLabel
            sx={{ paddingRight: "150px" }}
            value="end"
            control={<Checkbox />}
            label="Bachelor Male"
            labelPlacement="end"
          />
          <FormControlLabel
            sx={{ paddingRight: "150px" }}
            value="end"
            control={<Checkbox />}
            label="Comapny"
            labelPlacement="end"
          />
        </FormGroup>
      </FormControl>

      <br />

      <div>
        <div>
          <FormControl sx={{ m: 1 }}>
            <InputLabel id="demo-select-small">Furnishing</InputLabel>
            <Select
              sx={{ width: 500 }}
              labelId="demo-select-small"
              id="demo-select-small"
              name="furniture"
              value={formData.furniture}
              onChange={handleChange}
              error={!!errors.furniture}
              label="Furniture"
            >
              {furnitures.map(({ value, label }, index) => (
                <MenuItem value={value}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ m: 1 }}>
            <InputLabel id="demo-select-small">Parking</InputLabel>
            <Select
              sx={{ width: 500 }}
              labelId="demo-select-small"
              id="demo-select-small"
              name="parking"
              value={formData.parking}
              label="ApartmentType"
              onChange={handleChange}
              error={!!errors.parking}
            >
              {park.map(({ value, label }, index) => (
                <MenuItem value={value}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <br />
        <div>
          <TextField
            sx={{ width: 1020, m: 1 }}
            multiline
            label="Decription"
            name="Description"
            value={formData.Description}
            onChange={handleChange}
            rows={3}
            error={!!errors.Description}
            variant="outlined"
          />
        </div>

        <br />
        <Grid container justifyContent="space-between">
          <FormControl sx={{ m: 1 }}>
            <Button sx={{ width: 160, height: 50 }} variant="contained" onClick={props.OnPrevTab}>
              Previous
            </Button>
          </FormControl>
          <FormControl sx={{ m: 1 }}>
            <Button sx={{ width: 160, height: 50 }} variant="contained" type="submit">
              Next
            </Button>
          </FormControl>
        </Grid>
      </div>
    </form>
  );
};

export default RentalDetails;
