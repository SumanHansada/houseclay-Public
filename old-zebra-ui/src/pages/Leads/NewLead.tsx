import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { ReactNode, useState } from "react";
import TenantLead from "./LeadForms/TenantLead";
import OwnerLead from "./LeadForms/OwnerLead";
import SellerLead from "./LeadForms/SellerLead";
import BuyerLead from "./LeadForms/BuyerLead";

const NewLead = () => {
  const [selectedValue, setSelectedValue] = useState("");

  const loadForm = (): ReactNode => {
    // Load the form based on the selected value
    switch (selectedValue) {
      case "tenant":
        return <TenantLead />;
      case "owner":
        return <OwnerLead />;
      case "seller":
        return <SellerLead />;
      case "buyer":
        return <BuyerLead />;
    }
  };

  const handleLeadTypeChange = (event: any) => {
    // Update the selected value
    setSelectedValue(event.target.value);
  };

  return (
    <div>
      <FormControl sx={{ m: 1 }}>
        <InputLabel id="facing">Lead Type</InputLabel>
        <Select
          sx={{ width: 300 }}
          labelId="leadType"
          id="leadType"
          value={selectedValue}
          label="Lead Type"
          name="leadType"
          onChange={handleLeadTypeChange}
        >
          <MenuItem value="tenant">Tenant</MenuItem>
          <MenuItem value="owner">Owner</MenuItem>
          <MenuItem value="seller">Seller</MenuItem>
          <MenuItem value="buyer">Buyer</MenuItem>
        </Select>
      </FormControl>
      <br /> <hr></hr>
      {loadForm()}
    </div>
  );
};

export default NewLead;
