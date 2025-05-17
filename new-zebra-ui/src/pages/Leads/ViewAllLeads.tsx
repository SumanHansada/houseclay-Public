import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { type ReactNode, useState } from "react";
import TenantLeadsList from "./ViewerForms/TenantLeadsList";
import OwnerLeadsList from "./ViewerForms/OwnerLeadsList";
import SellerLeadsList from "./ViewerForms/SellerLeadsList";
import BuyerLeadsList from "./ViewerForms/BuyerLeadsList";

type Props = {};

const ViewAllLeads = (props: Props) => {
  const [selectedValue, setSelectedValue] = useState("");

  const loadForm = (): ReactNode => {
    // Load the form based on the selected value
    switch (selectedValue) {
      case "tenant":
        return <TenantLeadsList />;
      case "owner":
        return <OwnerLeadsList />;
      case "seller":
        return <SellerLeadsList />;
      case "buyer":
        return <BuyerLeadsList />;
    }
  };

  const handleLeadTypeChange = (event: any) => {
    // Update the selected value
    setSelectedValue(event.target.value);
  };

  return (
    <div>
      <InputLabel sx={{ m: 1 }} id="label">
        View Leads
      </InputLabel>
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
      <br /> <hr />
      {loadForm()}
    </div>
  );
};

export default ViewAllLeads;
