import { Box, Tabs, Typography } from "@mui/material";
import { useState } from "react";

import Tab from "@mui/material/Tab";
import PropertyDetails from "./MiniForms/PropertyDetails";
import LocalityDetails from "./MiniForms/LocalityDetails";
import RentalDetails from "./MiniForms/RentalDetails";

import Amenities from "./MiniForms/Amenities";
import Images from "./MiniForms/Images";
import Schedule from "./MiniForms/Schedule";
import OwnerDetails from "./MiniForms/OwnerDetails";

const PostNewRentalProperty = () => {
  //const [apartmentType, setApartmentType] = useState('');
  const [value, setValue] = useState(0);

  const [formData, setFormData] = useState({
    apartmentType: "",
    bhkType: "",
    floor: "",
    totalfloor: "",
    propertyAge: "",
    facing: "",
    builtupArea: "",
  });

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log("Changed", newValue);
    setValue(newValue);
  };

  const handleNextTab = () => {
    setValue((prevTab) => prevTab + 1);
  };
  const handlePrevTab = () => {
    if (value > 0) setValue((prevTab) => prevTab - 1);
  };

  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
          <Tabs value={value} onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Property Details" {...a11yProps(0)} />
            <Tab label="Locality Details" {...a11yProps(1)} />
            <Tab label="Rental Details" {...a11yProps(2)} />
            <Tab label="Owner Details" {...a11yProps(3)} />
            <Tab label="Amenities" {...a11yProps(4)} />
            <Tab label="Images" {...a11yProps(5)} />
            <Tab label="Schedule" {...a11yProps(6)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <PropertyDetails onNextTab={handleNextTab} />
        </TabPanel>

        <TabPanel value={value} index={1}>
          <LocalityDetails onNextTab={handleNextTab} OnPrevTab={handlePrevTab} />
        </TabPanel>

        <TabPanel value={value} index={2}>
          <RentalDetails onNextTab={handleNextTab} OnPrevTab={handlePrevTab} />
        </TabPanel>

        <TabPanel value={value} index={4}>
          <Amenities onNextTab={handleNextTab} OnPrevTab={handlePrevTab} />
        </TabPanel>

        <TabPanel value={value} index={5}>
          <Images onNextTab={handleNextTab} onPrevTab={handlePrevTab} />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </TabPanel>

        <TabPanel value={value} index={6}>
          <Schedule onNextTab={handleNextTab} OnPrevTab={handlePrevTab} />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </TabPanel>

        <TabPanel value={value} index={3}>
          <OwnerDetails onNextTab={handleNextTab} OnPrevTab={handlePrevTab} />
        </TabPanel>
      </Box>
    </>
  );
};

export default PostNewRentalProperty;
