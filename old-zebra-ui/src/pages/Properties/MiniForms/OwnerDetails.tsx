import { type ChangeEvent } from "react";
import { FormControl, TextField, Button, Grid } from "@mui/material";
import { MuiTelInput } from "mui-tel-input";
import { useState } from "react";

type Props = {
  onNextTab: () => void;
  OnPrevTab: () => void;
};

function OwnerDetails(props: Props) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    Email: "",
    Notes: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    Email: "",
    Notes: "",
  });
  const [isValid, setIsValid] = useState(false);
  const [contactNumber, setContactNumber] = React.useState("");
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name as string]: value });
    setIsValid(
      formData.firstName !== "" &&
        formData.lastName !== "" &&
        formData.contactNumber !== "" &&
        formData.Email !== "" &&
        formData.Notes !== ""
    );
  };
  const handleContactChange = (newContactNumber: string) => {
    setContactNumber(newContactNumber);
    setFormData({ ...formData, contactNumber: newContactNumber });
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newErrors = { ...errors };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValidForm = true;
    if (!formData.firstName) {
      newErrors.firstName = "First Nameis required";
      isValidForm = false;
    }
    if (!formData.lastName) {
      newErrors.lastName = "BHK type is required";
      isValidForm = false;
    }
    if (!formData.contactNumber) {
      newErrors.contactNumber = "No.of floors required";
      isValidForm = false;
    }
    if (!formData.Email || !emailRegex.test(formData.Email)) {
      newErrors.Email = "No.of total floors required";
      isValidForm = false;
    }
    if (!formData.Notes) {
      newErrors.Notes = "propertyAge is required required";
      isValidForm = false;
    }

    setErrors(newErrors);
    if (isValidForm) {
      console.log("Formd data is ", formData);
      props.onNextTab();
    } else {
      alert("Fill all the details");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <FormControl sx={{ m: 1 }}>
            <TextField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={!!errors.firstName}
              id="outlined-start-adornment"
              sx={{ width: 300 }}
            />
          </FormControl>

          <FormControl sx={{ m: 1 }}>
            <TextField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={!!errors.lastName}
              id="outlined-start-adornment"
              sx={{ width: 300 }}
            />
          </FormControl>
        </div>
        <br />
        <div>
          <FormControl sx={{ m: 1 }}>
            <MuiTelInput
              label="Phone"
              defaultCountry="IN"
              fullWidth
              value={formData.contactNumber}
              name="contactNumber"
              onChange={handleContactChange}
              error={!!errors.contactNumber}
              sx={{ width: 300 }}
            />
          </FormControl>
        </div>
        <br />

        <div>
          <FormControl sx={{ m: 1 }}>
            <TextField
              label="Email Id"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              error={!!errors.Email}
              id="outlined-start-adornment"
              sx={{ width: 300 }}
            />
          </FormControl>
        </div>
        <br />

        <div>
          <TextField
            sx={{ width: 1020, m: 1 }}
            multiline
            label="Notes"
            name="Notes"
            value={formData.Notes}
            onChange={handleChange}
            error={!!errors.Notes}
            rows={3}
            variant="outlined"
          />
        </div>
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
      </form>

      <br />
      <br />
      <br />
      <br />
    </div>
  );
}

export default OwnerDetails;
