import { Grid } from "@mui/material";
import FormLabel from "@mui/material/FormLabel";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  InputAdornment,
  TextField,
  FormControlLabel,
  Checkbox,
  Stack,
  Button,
} from "@mui/material";
import ElevatorIcon from "@mui/icons-material/Elevator";
import BathtubIcon from "@mui/icons-material/Bathtub";
import BalconyIcon from "@mui/icons-material/Balcony";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import YardIcon from "@mui/icons-material/Yard";
import BedroomParentIcon from "@mui/icons-material/BedroomParent";
import GasMeterIcon from "@mui/icons-material/GasMeter";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import ManIcon from "@mui/icons-material/Man";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import WifiIcon from "@mui/icons-material/Wifi";
import HouseIcon from "@mui/icons-material/House";
import PoolIcon from "@mui/icons-material/Pool";
import FireExtinguisherIcon from "@mui/icons-material/FireExtinguisher";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PestControlRodentIcon from "@mui/icons-material/PestControlRodent";
import PowerIcon from "@mui/icons-material/Power";
import { useState, ChangeEvent } from "react";
// import colorConfigs from "../../configs/colorConfigs";
type Props = {
  onNextTab: () => void;
  OnPrevTab: () => void;
};

const Amenities = (props: Props) => {
  const waterSupply = [
    {
      value: "corporation",
      label: "Corporation",
    },
    {
      value: "borewell",
      label: "Borewell",
    },
    {
      value: "both",
      label: "Both",
    },
  ];
  const SelectYesOrNo = [
    {
      value: "yes",
      label: "Yes",
    },
    {
      value: "no",
      label: "No",
    },
  ];

  const properties = [
    {
      value: "1",
      label: "Need help",
    },
    {
      value: "2",
      label: "I will show",
    },
    {
      value: "3",
      label: "Neighbours",
    },
    {
      value: "4",
      label: "Friends/Relatives",
    },
    {
      value: "5",
      label: "Security",
    },
    {
      value: "6",
      label: "Tenants",
    },
    {
      value: "7",
      label: "Others",
    },
  ];
  const [propertyShow, setpropertyShow] = useState("");
  const [iscontactHidden, setiscontactHidden] = useState(false);

  const [formData, setFormData] = useState({
    Bathroom: "",
    Balcony: "",
    WaterSupply: "",
    Gym: "",
    NonVegAllowed: "",
    GatedSecurity: "",
    showProperty: "",
    Description: "",
    contactNumber: "",
  });
  const [errors, setErrors] = useState({
    Bathroom: "",
    Balcony: "",
    WaterSupply: "",
    Gym: "",
    NonVegAllowed: "",
    GatedSecurity: "",
    showProperty: "",
    Description: "",
  });
  const handleshowProperty = (event: SelectChangeEvent) => {
    const option = event.target.value as string;
    setpropertyShow(option);
    setFormData({ ...formData, showProperty: option });
    if (option === "2") setiscontactHidden(false);
    else setiscontactHidden(true);
  };
  const [isValid, setIsValid] = useState(false);
  const handleChange = (
    event: SelectChangeEvent<string> | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name as string]: value });
    setIsValid(
      formData.Bathroom !== "" &&
        formData.Balcony !== "" &&
        formData.WaterSupply !== "" &&
        formData.Gym !== "" &&
        formData.NonVegAllowed !== "" &&
        formData.GatedSecurity !== "" &&
        formData.showProperty !== "" &&
        formData.Description !== ""
    );
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    let isValdiForm = true;

    event.preventDefault();
    const newErrors = { ...errors };
    if (!formData.Bathroom) {
      newErrors.Bathroom = "No of bathrooms are required";
      isValdiForm = false;
    }
    if (!formData.Balcony) {
      newErrors.Balcony = "No of Balcony are required";
      isValdiForm = false;
    }
    if (!formData.WaterSupply) {
      newErrors.WaterSupply = "WaterSupply is required";
      isValdiForm = false;
    }
    if (!formData.Gym) {
      newErrors.Gym = "Gym is required";
      isValdiForm = false;
    }
    if (!formData.NonVegAllowed) {
      newErrors.NonVegAllowed = "NonVegAllowed required";
      isValdiForm = false;
    }
    if (!formData.GatedSecurity) {
      newErrors.GatedSecurity = "GatedSecurity required";
      isValdiForm = false;
    }
    if (!formData.showProperty) {
      newErrors.showProperty = "showProperty required";
      isValdiForm = false;
    }
    if (!formData.Description) {
      newErrors.Description = "Description required";
      isValdiForm = false;
    }

    setErrors(newErrors);
    if (isValdiForm) props.onNextTab();
    else {
      alert("Fill all the details");
    }
  };
  const [allAmenitiesChecked, setAllAmenitiesChecked] = useState(false);
  const [amenities, setAmenities] = useState({
    lift: false,
    intercom: false,
    childrenPlayArea: false,
    servantRoom: false,
    gasPipeline: false,
    rainwaterHarvesting: false,
    housekeeping: false,
    visitorParking: false,
    internetServices: false,
    clubHouse: false,
    swimmingPool: false,
    fireSafety: false,
    shoppingCentre: false,
    park: false,
    sewageTreatmentPlant: false,
    powerBackup: false,
  });

  const handleAllAmenitiesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setAllAmenitiesChecked(isChecked);
    const updatedAmenities = { ...amenities };
    for (const key in updatedAmenities) {
      if (Object.prototype.hasOwnProperty.call(updatedAmenities, key)) {
        updatedAmenities[key as keyof typeof amenities] = isChecked;
      }
    }
    setAmenities(updatedAmenities);
  };

  const handleSingleAmenityChange = (key: keyof typeof amenities, checked: boolean) => {
    setAmenities({ ...amenities, [key]: checked });
  };
  const [water, setWater] = useState("");

  const [property, setProperty] = useState("");
  const propertyHandleChange = (event: SelectChangeEvent) => {
    setProperty(event.target.value);
  };

  const waterChangeHandler = (event: SelectChangeEvent) => {
    setWater(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <FormLabel sx={{ m: 1, fontSize: "20px" }} component="legend">
          Provide additional details about your property to get maximum visibilty
        </FormLabel>

        <Grid container my={4} alignItems="center" sx={{ m: 1 }}>
          <Grid item xs={3.5} sx={{ m: 1, paddingRight: "150px" }}>
            <TextField
              label="Bathrooms"
              value={formData.Bathroom}
              name="Bathroom"
              onChange={handleChange}
              error={!!errors.Bathroom}
              id="outlined-start-adornment"
              sx={{ width: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BathtubIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={3.5} sx={{ m: 1, paddingRight: "150px" }}>
            <TextField
              label="Balcony"
              id="outlined-start-adornment"
              sx={{ width: 300 }}
              value={formData.Balcony}
              error={!!errors.Balcony}
              name="Balcony"
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BalconyIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <div>
            <FormControl sx={{ m: 1 }}>
              <InputLabel id="demo-select-small">Water Supply</InputLabel>
              <Select
                sx={{ width: 300 }}
                labelId="demo-select-small"
                id="demo-select-small"
                value={formData.WaterSupply}
                error={!!errors.WaterSupply}
                label="ApartmentType"
                name="WaterSupply"
                onChange={handleChange}
              >
                {waterSupply.map(({ value, label }, index) => (
                  <MenuItem value={value}>{label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </Grid>

        <br />

        <Grid container my={4} alignItems="center">
          <Grid item xs={3.5} sx={{ m: 1, paddingRight: "150px" }}>
            <FormControl sx={{ m: 1 }}>
              <InputLabel id="demo-select-small">Gym</InputLabel>
              <Select
                sx={{ width: 300 }}
                labelId="demo-select-small"
                id="demo-select-small"
                error={!!errors.Bathroom}
                value={formData.Bathroom}
                label="ApartmentType"
                name="Gym"
                onChange={handleChange}
              >
                {SelectYesOrNo.map(({ value, label }, index) => (
                  <MenuItem value={value}>{label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={3.5} sx={{ m: 1, paddingRight: "150px" }}>
            <FormControl sx={{ m: 1 }}>
              <InputLabel id="demo-select-small">Non-veg Allowed</InputLabel>
              <Select
                sx={{ width: 300 }}
                labelId="demo-select-small"
                id="demo-select-small"
                value={formData.NonVegAllowed}
                error={!!errors.NonVegAllowed}
                label="ApartmentType"
                name="NonVegAllowed"
                onChange={handleChange}
              >
                {SelectYesOrNo.map(({ value, label }, index) => (
                  <MenuItem value={value}>{label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={3.5} sx={{ m: 1, paddingRight: "150px" }}>
            <FormControl sx={{ m: 1 }}>
              <InputLabel id="demo-select-small">Gated Security</InputLabel>
              <Select
                sx={{ width: 300 }}
                labelId="demo-select-small"
                id="demo-select-small"
                value={formData.GatedSecurity}
                error={!!errors.GatedSecurity}
                label="ApartmentType"
                name="GatedSecurity"
                onChange={handleChange}
              >
                {SelectYesOrNo.map(({ value, label }, index) => (
                  <MenuItem value={value}>{label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container my={6} alignItems="center">
          <Grid item xs={3.5} sx={{ m: 1 }}>
            <FormControl sx={{ m: 1 }}>
              <InputLabel id="demo-select-small">Who will show the property</InputLabel>
              <Select
                sx={{ width: 500 }}
                labelId="demo-select-small"
                id="demo-select-small"
                value={formData.showProperty}
                error={!!errors.showProperty}
                label="Furniture"
                name="showProperty"
                onChange={handleshowProperty}
              >
                {properties.map(({ value, label }, index) => (
                  <MenuItem value={value}>{label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={5} sx={{ m: 1, paddingLeft: "200px" }}>
            <FormControl sx={{ m: 1 }}>
              {iscontactHidden && (
                <TextField
                  label="Contact Number"
                  id="outlined-start-adornment"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  sx={{ width: 300 }}
                />
              )}
            </FormControl>
          </Grid>
        </Grid>

        <FormLabel sx={{ m: 1, fontSize: "20px" }} component="legend">
          Select the available amenities
        </FormLabel>

        <Grid container my={4}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={allAmenitiesChecked}
                  onChange={handleAllAmenitiesChange}
                  name="allAmenities"
                />
              }
              label="Select All Amenities"
            />
          </Grid>
          <Grid container my={4}></Grid>
          {Object.entries(amenities).map(([key, value]) => (
            <Grid key={key} item xs={6}>
              <Stack direction="row" spacing={0} alignItems="center">
                {key === "lift" && <ElevatorIcon />}
                {key === "intercom" && <LocalPhoneIcon />}
                {key === "childrenPlayArea" && <YardIcon />}
                {key === "servantRoom" && <BedroomParentIcon />}
                {key === "gasPipeline" && <GasMeterIcon />}
                {key === "rainwaterHarvesting" && <AgricultureIcon />}
                {key === "housekeeping" && <ManIcon />}
                {key === "visitorParking" && <DirectionsCarFilledIcon />}
                {key === "internetServices" && <WifiIcon />}
                {key === "clubHouse" && <HouseIcon />}
                {key === "swimmingPool" && <PoolIcon />}
                {key === "fireSafety" && <FireExtinguisherIcon />}
                {key === "shoppingCentre" && <ShoppingCartIcon />}
                {key === "park" && <YardIcon />}
                {key === "sewageTreatmentPlant" && <PestControlRodentIcon />}
                {key === "powerBackup" && <PowerIcon />}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={value}
                      onChange={(e) =>
                        handleSingleAmenityChange(key as keyof typeof amenities, e.target.checked)
                      }
                    />
                  }
                  label={key}
                  labelPlacement="end"
                />
              </Stack>
            </Grid>
          ))}
        </Grid>
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

export default Amenities;
