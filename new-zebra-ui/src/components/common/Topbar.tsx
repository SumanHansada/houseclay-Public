import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import { red } from "@mui/material/colors";
import { AppBar, Avatar, Box, IconButton, Menu, Toolbar, Tooltip, Typography } from "@mui/material";
import colorConfigs from "../../configs/colorConfigs";
import assets from "../../assets/assets";
import { useNavigate } from "react-router";
import axios from "axios";
import CircleIcon from "@mui/icons-material/Circle";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const pages = ["Products", "Pricing", "Blog"];

interface TopbarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Topbar = ({ sidebarOpen, toggleSidebar }: TopbarProps) => {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const [loggedInUser, setloggedInUser] = React.useState("");

  const loggedInUserDetails = async () => {
    try {
      const access_token = localStorage.getItem("access_token");
      if (access_token === null) {
        alert("Token is missing");
        navigate("/login");
      }

      //create headers
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      };
      const response = await axios.get("http://localhost:9091/users/v1/getloggedinuser", {
        headers,
      });
      setloggedInUser(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    loggedInUserDetails();
  }, []);
  const handleCloseUserMenu = (event: any) => {
    const name = event.target.textContent.trim();

    console.log(name);

    switch (name) {
      case "Profile":
        alert("Profile clicked!");
        break;
      case "Account":
        alert("Account clicked!");
        break;
      case "Dashboard":
        alert("Dashboard clicked!");
        break;
      case "Logout":
        console.log("Logout clicked!");
        localStorage.removeItem("access_token");
        navigate("/login");
        break;
      default:
        break;
    }
    setAnchorElUser(null);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: "100%",
        ml: 0,
        boxShadow: "unset",
        backgroundColor: colorConfigs.topbar.bg,
        color: colorConfigs.topbar.color,
      }}
    >
      <Toolbar>
        <IconButton color="inherit" edge="start" onClick={toggleSidebar} sx={{ mr: 2 }}>
          {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
        <Typography
          variant="h6"
          sx={{
            mr: 2,
            display: { xs: "none", md: "flex" },
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: ".3rem",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          ZEBRA |
        </Typography>

        <Box
          component="img"
          sx={{
            height: 34,
          }}
          alt="HouseClay-Zebra"
          src={assets.images.dashboard_center_logo}
        ></Box>

        <Box sx={{ flexGrow: 1 }}></Box>

        <CircleIcon fontSize="small" sx={{ color: "green" }} />
        <Box component={Typography} sx={{ px: 1 }}>
          {loggedInUser}
        </Box>
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar sx={{ bgcolor: red[500] }}>{loggedInUser.charAt(0).toUpperCase()}</Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <MenuItem onClick={handleCloseUserMenu}>
              <Typography textAlign="center">Profile</Typography>
            </MenuItem>

            <MenuItem onClick={handleCloseUserMenu}>
              <Typography textAlign="center">Account</Typography>
            </MenuItem>

            <MenuItem onClick={handleCloseUserMenu}>
              <Typography textAlign="center">Dashboard</Typography>
            </MenuItem>

            <MenuItem onClick={handleCloseUserMenu}>
              <Typography textAlign="center">Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
