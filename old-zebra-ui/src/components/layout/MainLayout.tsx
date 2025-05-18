import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import colorConfigs from "../../configs/colorConfigs";
import Sidebar from "../common/Sidebar";
import Topbar from "../common/Topbar";
import { useState } from "react";

const MainLayout = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      <Topbar sidebarOpen={open} toggleSidebar={toggleDrawer} />
      <Sidebar open={open} onClose={toggleDrawer} />
      <Box
        component="main"
        sx={{
          minHeight: "100vh",
          backgroundColor: colorConfigs.mainBg,
          pt: 8, // offset for Topbar
          width: "100%",
        }}
      >
        <Outlet />
      </Box>
    </>
  );
};

export default MainLayout;
