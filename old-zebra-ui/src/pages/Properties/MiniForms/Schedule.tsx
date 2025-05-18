import { useState, type ChangeEvent } from "react";
import {
  Button,
  Grid,
  MenuItem,
  type SelectChangeEvent,
  FormControl,
  InputLabel,
  Select,
  FormLabel,
  InputAdornment,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

type Props = {
  onNextTab: () => void;
  OnPrevTab: () => void;
};

const Schedule = (props: Props) => {
  const [isOutlined, setIsOutlined] = useState(true);
  const [buttonBackground, setButtonBackground] = useState("transparent");

  const [is1Outlined, setIs1Outlined] = useState(true);
  const [button1Background, setButton1Background] = useState("transparent");

  const [is2Outlined, setIs2Outlined] = useState(true);
  const [button2Background, setButton2Background] = useState("transparent");

  const [is3Outlined, setIs3Outlined] = useState(true);
  const [button3Background, setButton3Background] = useState("transparent");

  const [is4Outlined, setIs4Outlined] = useState(true);
  const [button4Background, setButton4Background] = useState("transparent");

  const [is5Outlined, setIs5Outlined] = useState(true);
  const [button5Background, setButton5Background] = useState("transparent");

  const [is6Outlined, setIs6Outlined] = useState(true);
  const [button6Background, setButton6Background] = useState("transparent");
  const [formData, setFormData] = useState({
    Availability: "",
    StartTime: "",
    EndTime: "",
  });
  const [errors, setErrors] = useState({
    Availability: "",
    StartTime: "",
    EndTime: "",
  });
  const [isValid, setIsValid] = useState(false);
  const handleChange = (
    event: SelectChangeEvent<string> | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name as string]: value });
    setIsValid(
      formData.Availability !== "" && formData.StartTime !== "" && formData.EndTime !== ""
    );
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newErrors = { ...errors };
    let isValidForm = true;
    if (!formData.Availability) {
      newErrors.Availability = "Availability is required";
      isValidForm = false;
    }
    if (!formData.StartTime) {
      newErrors.StartTime = "StartTime is required";
      isValidForm = false;
    }
    if (!formData.EndTime) {
      newErrors.EndTime = "EndTime is required";
      isValidForm = false;
    }
    setErrors(newErrors);
    if (isValidForm) {
      console.log("Form Data", formData);
      console.log("Data is filled succesfully");
    } else {
      alert("Fill all details");
    }
  };

  // clock

  const options = [
    "12:00 AM",
    "12:30 AM",
    "01:00 AM",
    "01:30 AM",
    "02:00 AM",
    "02:30 AM",
    "03:00 AM",
    "03:30 AM",
    "04:00 AM",
    "04:30 AM",
    "05:00 AM",
    "05:30 AM",
    "06:00 AM",
    "06:30 AM",
    "07:00 AM",
    "07:30 AM",
    "08:00 AM",
    "08:30 AM",
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
    "05:30 PM",
    "06:00 PM",
    "06:30 PM",
    "07:00 PM",
    "07:30 PM",
    "08:00 PM",
    "08:30 PM",
    "09:00 PM",
    "09:30 PM",
    "10:00 PM",
    "10:30 PM",
    "11:00 PM",
    "11:30 PM",
  ];
  const AvailabiltyOption = [
    {
      value: "everyday",
      label: "Everyday",
    },
    {
      value: "weekDay",
      label: "Weekday",
    },
    {
      value: "Weekend",
      label: "Weekend",
    },
  ];
  const [startTimeAnchorEl, setStartTimeAnchorEl] = useState<null | HTMLElement>(null);
  const [endTimeAnchorEl, setEndTimeAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedStartTime, setSelectedStartTime] = useState<string>("");
  const [selectedEndTime, setSelectedEndTime] = useState<string>("");

  const handleStartTimeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setStartTimeAnchorEl(event.currentTarget);
  };

  const handleEndTimeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setEndTimeAnchorEl(event.currentTarget);
  };

  const handleClose = (type: "start" | "end") => {
    if (type === "start") {
      setStartTimeAnchorEl(null);
    } else {
      setEndTimeAnchorEl(null);
    }
  };

  const handleOptionSelect = (option: string, type: "start" | "end") => {
    if (type === "start") {
      setSelectedStartTime(option);
      handleClose("start");
    } else {
      setSelectedEndTime(option);
      handleClose("end");
    }
  };

  const handleButtonClick = () => {
    setIsOutlined(!isOutlined);
    setButtonBackground(isOutlined ? "green" : "transparent");
  };

  const handleButton1Click = () => {
    setIs1Outlined(!is1Outlined);
    setButton1Background(is1Outlined ? "green" : "transparent");
  };

  const handleButton2Click = () => {
    setIs2Outlined(!is2Outlined);
    setButton2Background(is2Outlined ? "green" : "transparent");
  };

  const handleButton3Click = () => {
    setIs3Outlined(!is3Outlined);
    setButton3Background(is3Outlined ? "green" : "transparent");
  };

  // availability

  const handleButton4Click = () => {
    setIs4Outlined(true);
    setIs5Outlined(false);
    setIs6Outlined(false);
    setButton4Background("green");
    setButton5Background("transparent");
    setButton6Background("transparent");
  };

  const handleButton5Click = () => {
    setIs4Outlined(false);
    setIs5Outlined(true);
    setIs6Outlined(false);
    setButton4Background("transparent");
    setButton5Background("green");
    setButton6Background("transparent");
  };

  const handleButton6Click = () => {
    setIs4Outlined(false);
    setIs5Outlined(false);
    setIs6Outlined(true);
    setButton4Background("transparent");
    setButton5Background("transparent");
    setButton6Background("green");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <br />

        <FormControl sx={{ m: 1 }}>
          <InputLabel id="demo-select-small">Availability</InputLabel>
          <Select
            sx={{ width: 500 }}
            labelId="demo-select-small"
            id="demo-select-small"
            label="ApartmentType"
            name="Availability"
            onChange={handleChange}
            error={!!errors.Availability}
            value={formData.Availability}
          >
            {AvailabiltyOption.map(({ value, label }, index) => (
              <MenuItem value={value}>{label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <br />
        <br />

        <Grid>
          <FormLabel component="legend" sx={{ m: 1 }}>
            Select Time
          </FormLabel>
          <Grid>
            <FormControl sx={{ m: 1 }}>
              <InputLabel id="demo-select-small">Select Start Time</InputLabel>
              <Select
                sx={{ width: 500 }}
                labelId="demo-select-small"
                id="demo-select-small"
                label="ApartmentType"
                name="StartTime"
                value={formData.StartTime}
                error={!!errors.StartTime}
                onChange={handleChange}
                inputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTimeIcon />
                    </InputAdornment>
                  ),
                }}
              >
                {options.map((value, index) => (
                  <MenuItem key={index} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1 }}>
              <InputLabel id="demo-select-small">Select End Time</InputLabel>
              <Select
                sx={{ width: 500 }}
                labelId="demo-select-small"
                id="demo-select-small"
                label="EndTime"
                name="EndTime"
                value={formData.EndTime}
                onChange={handleChange}
                error={!!errors.EndTime}
              >
                {options.map((value, index) => (
                  <MenuItem key={index} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container justifyContent="space-between">
          <FormControl sx={{ m: 1 }}>
            <Button sx={{ width: 160, height: 50 }} variant="contained" onClick={props.OnPrevTab}>
              Previous
            </Button>
          </FormControl>
          <FormControl sx={{ m: 1 }}>
            <Button sx={{ width: 160, height: 50 }} variant="contained" type="submit">
              Save
            </Button>
          </FormControl>
        </Grid>
      </div>
    </form>
  );
};

export default Schedule;
