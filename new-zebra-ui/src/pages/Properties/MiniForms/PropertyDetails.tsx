import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  TextField,
} from "@mui/material";
import { useState, type ChangeEvent } from "react";

type Props = {
  onNextTab: () => void;
};

const PropertyDetails = (props: Props) => {
  const apartmentTypes = [
    {
      value: "apartment",
      label: "Apartment",
    },
    {
      value: "independentvilla",
      label: "Independent Villa",
    },
    {
      value: "gatedcommunityvilla",
      label: "Gated Community Villa",
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

  const propertyAges = [
    {
      value: "lessoneyear",
      label: "Less than a year",
    },
    {
      value: "onetothreeyears",
      label: "1 to 3 years",
    },
    {
      value: "threetofiveyears",
      label: "3 to 5 years",
    },
    {
      value: "fivetotenyears",
      label: "5 to 10 years",
    },
    {
      value: "morethantenyears",
      label: "More than 10 years",
    },
  ];

  const facings = [
    {
      value: "North",
      label: "North",
    },
    {
      value: "South",
      label: "South",
    },
    {
      value: "East",
      label: "East",
    },
    {
      value: "West",
      label: "West",
    },
    {
      value: "North-East",
      label: "North-East",
    },
    {
      value: "South-East",
      label: "South-East",
    },
    {
      value: "North-West",
      label: "North-West",
    },
    {
      value: "South-West",
      label: "South-West",
    },
    {
      value: "Don't Know",
      label: "Don't Know",
    },
  ];
  const floors = Array(0);

  for (let i = 0; i <= 100; i++) {
    floors.push({ value: i, label: i });
  }
  const [apartmentType, setApartmentType] = useState("");
  const [bhkType, setBhkType] = useState("");
  const [floor, setFloor] = useState("");
  const [totalfloor, setTotalFloor] = useState("");
  const [propertyAge, setPropertyAge] = useState("");
  const [facing, setFacing] = useState("");
  const [builtupArea, setbuiltupArea] = useState("");
  const [isValid, setisValid] = useState(false);
  const [formData, setFormData] = useState({
    apartmentType: "",
    bhkType: "",
    floor: "",
    totalfloor: "",
    propertyAge: "",
    facing: "",
    builtupArea: "",
  });
  const [errors, setErrors] = useState({
    apartmentType: "",
    bhkType: "",
    floor: "",
    totalfloor: "",
    propertyAge: "",
    facing: "",
  });
  const handleChange = (
    event: SelectChangeEvent<string> | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name as string]: value });
    setisValid(
      formData.apartmentType !== "" &&
        formData.bhkType !== "" &&
        formData.floor !== "" &&
        formData.totalfloor !== "" &&
        formData.propertyAge !== "" &&
        formData.facing !== ""
    );
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newErrors = { ...errors };
    let isValidForm = true;
    if (!formData.apartmentType) {
      newErrors.apartmentType = "Apartment type is required";
      isValidForm = false;
    }
    if (!formData.bhkType) {
      newErrors.bhkType = "BHK type is required";
      isValidForm = false;
    }
    if (!formData.floor) {
      newErrors.floor = "No.of floors required";
      isValidForm = false;
    }
    if (!formData.totalfloor) {
      newErrors.totalfloor = "No.of total floors required";
      isValidForm = false;
    }
    if (!formData.propertyAge) {
      newErrors.propertyAge = "propertyAge is required required";
      isValidForm = false;
    }
    if (!formData.facing) {
      newErrors.facing = "facing is required";
      isValidForm = false;
    }

    setErrors(newErrors);
    if (isValidForm) {
      console.log("Form Data ", formData);
      props.onNextTab();
    } else {
      alert("Fill all the details");
    }
  };

  const apartmentTypeHandleChange = (event: SelectChangeEvent) => {
    setApartmentType(event.target.value);
  };
  const bhkTypeHandleChange = (event: SelectChangeEvent) => {
    setBhkType(event.target.value);
  };

  const setFloorHandleChange = (event: SelectChangeEvent) => {
    setFloor(event.target.value);
  };

  const setTotalFloorHandleChange = (event: SelectChangeEvent) => {
    setTotalFloor(event.target.value);
  };

  const setPropertyAgeChange = (event: SelectChangeEvent) => {
    setPropertyAge(event.target.value);
  };

  const setFacingChange = (event: SelectChangeEvent) => {
    setFacing(event.target.value);
    console.log(event.target.value);
  };
  const builtupAreaHandle = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^\d*$/.test(value) || value === "") setbuiltupArea(value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <FormControl sx={{ m: 1 }}>
          <InputLabel id="apartment-type-label">Apartment Type</InputLabel>
          <Select
            sx={{ width: 300 }}
            labelId="apartment-type-label"
            id="apartment-type"
            value={formData.apartmentType}
            label="ApartmentType"
            name="apartmentType"
            onChange={handleChange}
            error={!!errors.apartmentType}
          >
            {apartmentTypes.map(({ value, label }, index) => (
              <MenuItem value={value}>{label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <br />
      <br />
      <br />
      {/* <Box sx={{justifyContent: 'flex-end'}}>    */}
      <div>
        <FormControl sx={{ m: 1 }}>
          <InputLabel id="bhk-Type">BHK Type</InputLabel>
          <Select
            sx={{ width: 300 }}
            labelId="bhk-Type"
            id="bhk-Type"
            value={formData.bhkType}
            label="BHKType"
            name="bhkType"
            onChange={handleChange}
            error={!!errors.bhkType}
          >
            {bhkTypes.map(({ value, label }, index) => (
              <MenuItem value={value}>{label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ m: 1 }}>
          <InputLabel id="bhk-Type">Floor</InputLabel>
          <Select
            sx={{ width: 300 }}
            labelId="floor"
            id="floor"
            value={formData.floor}
            label="floor"
            name="floor"
            onChange={handleChange}
            error={!!errors.floor}
          >
            {floors.map(({ value, label }, index) => (
              <MenuItem value={value}>{label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ m: 1 }}>
          <InputLabel id="total-floors">Total Floors</InputLabel>
          <Select
            sx={{ width: 300 }}
            labelId="total-floors"
            id="total-floors"
            value={formData.totalfloor}
            label="totalfloor"
            name="totalfloor"
            onChange={handleChange}
            error={!!errors.totalfloor}
          >
            {floors.map(({ value, label }, index) => (
              <MenuItem value={value}>{label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <br />
      <br />
      <br />
      <div>
        <FormControl sx={{ m: 1 }}>
          <InputLabel id="property-age">Property Age</InputLabel>
          <Select
            sx={{ width: 300 }}
            labelId="property-age"
            id="property-age"
            value={formData.propertyAge}
            label="propertyAge"
            name="propertyAge"
            onChange={handleChange}
            error={!!errors.propertyAge}
          >
            {propertyAges.map(({ value, label }, index) => (
              <MenuItem value={value}>{label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ m: 1 }}>
          <InputLabel id="facing">Facing</InputLabel>
          <Select
            sx={{ width: 300 }}
            labelId="facing"
            id="facing"
            value={formData.facing}
            label="facing"
            name="facing"
            onChange={handleChange}
            error={!!errors.facing}
          >
            {facings.map(({ value, label }, index) => (
              <MenuItem value={value}>{label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <br />
      <br />
      <br />

      <div>
        <FormControl sx={{ m: 1 }}>
          <TextField
            label="Built Up Area"
            id="built-up-area"
            sx={{ width: 300 }}
            value={formData.builtupArea}
            name="builtupArea"
            onChange={handleChange}
            InputProps={{
              endAdornment: <InputAdornment position="end">Sq.Ft.</InputAdornment>,
            }}
          />
        </FormControl>

        <FormControl sx={{ m: 1 }}>
          <Button sx={{ width: 160, height: 50 }} variant="contained" type="submit">
            Next
          </Button>
        </FormControl>
      </div>
    </form>
  );
};

export default PropertyDetails;
