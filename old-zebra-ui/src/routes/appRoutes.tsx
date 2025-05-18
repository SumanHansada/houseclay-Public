import Viewer from "../pages/Properties/Viewer";
import { Outlet } from "react-router-dom";
import ZebraDashBoard from "../pages/ZebraDashboard/ZebraDashBoard";
import type { RouteType } from "./config";
import AppsOutlinedIcon from "@mui/icons-material/AppsOutlined";
import UpManage from "../pages/ClayManage/UpManage";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import NewLead from "../pages/Leads/NewLead";
import ViewAllLeads from "../pages/Leads/ViewAllLeads";
import RegisterNewPayment from "../pages/Payments/RegisterNewPayment";
import Transactions from "../pages/Payments/Transactions";
import Receipts from "../pages/Payments/Receipts";
import AddHomeIcon from "@mui/icons-material/AddHome";
import PostNewRentalProperty from "../pages/Properties/PostNewRentalProperty";
import PostNewSaleProperty from "../pages/Properties/PostNewSaleProperty";
import ManageAccountsTwoToneIcon from "@mui/icons-material/ManageAccountsTwoTone";
import NewUser from "../pages/UserManagement/NewUser";
import ViewAllUsers from "../pages/UserManagement/ViewAllUsers";
import WhiteListUser from "../pages/UserManagement/WhiteListUser";
import AssignRole from "../pages/UserManagement/AssignRole";
import ViewAllRoles from "../pages/UserManagement/ViewAllRoles";
import AddRole from "../pages/UserManagement/AddRole";
import AddExpense from "../pages/Expense/AddExpense";
import ViewUser from "../pages/UserManagement/ViewUser";
import EditUser from "../pages/UserManagement/EditUser";
import PropertyScan from "../pages/ClayManage/PropertyScan";

const appRoutes: RouteType[] = [
  {
    index: true,
    element: <ZebraDashBoard />,
    state: "home",
  },
  {
    path: "/properties",
    element: <Outlet />,
    state: "properties",
    sidebarProps: {
      displayText: "Properties",
      icon: <AddHomeIcon />,
    },
    child: [
      {
        path: "/properties/post-new-rental-property",
        element: <PostNewRentalProperty />,
        state: "properties.postnewrentalproperty",
        sidebarProps: {
          displayText: "Add Rental Property",
        },
      },
      {
        path: "/properties/post-new-sale-property",
        element: <PostNewSaleProperty />,
        state: "properties.postnewsaleproperty",
        sidebarProps: {
          displayText: "Add Sale Property",
        },
      },
      {
        path: "/properties/list-of-properties",
        element: <Viewer />,
        state: "properties.listofproperties",
        sidebarProps: {
          displayText: "View All Properties",
        },
      },
    ],
  },
  {
    path: "/claymanage",
    element: <Outlet />,
    state: "claymanage",
    sidebarProps: {
      displayText: "ClayManage",
      icon: <AppsOutlinedIcon />,
    },
    child: [
      {
        path: "/claymanage/upmanage",
        element: <UpManage />,
        state: "claymanage.upmanage",
        sidebarProps: {
          displayText: "UpManage",
        },
      },
      {
        path: "/claymanage/propertyscan",
        element: <PropertyScan />,
        state: "claymanage.propertyscan",
        sidebarProps: {
          displayText: "PropertyScan",
        },
      },
    ],
  },
  {
    path: "/leads",
    element: <Outlet />,
    state: "leads",
    sidebarProps: {
      displayText: "Lead Management",
      icon: <AppsOutlinedIcon />,
    },
    child: [
      {
        path: "/leads/newlead",
        element: <NewLead />,
        state: "leads.newlead",
        sidebarProps: {
          displayText: "New Lead",
        },
      },
      {
        path: "/leads/allleads",
        element: <ViewAllLeads />,
        state: "leads.newlead",
        sidebarProps: {
          displayText: "View All Leads",
        },
      },
    ],
  },
  {
    path: "/users",
    element: <Outlet />,
    state: "users",
    sidebarProps: {
      displayText: "User Management",
      icon: <ManageAccountsTwoToneIcon />,
    },
    child: [
      {
        path: "/users/newuser",
        element: <NewUser />,
        state: "users.newuser",
        sidebarProps: {
          displayText: "New User",
        },
      },
      {
        path: "/users/viewallusers",
        element: <ViewAllUsers />,
        state: "users.viewallusers",
        sidebarProps: {
          displayText: "View All Users",
        },
      },
      {
        path: "/users/whitelistusers",
        element: <WhiteListUser />,
        state: "users.whitelistusers",
        sidebarProps: {
          displayText: "WhiteList Users",
        },
      },
      {
        path: "/users/addrole",
        element: <AddRole />,
        state: "users.addrole",
        sidebarProps: {
          displayText: "Add Role",
        },
      },
      {
        path: "/users/viewallroles",
        element: <ViewAllRoles />,
        state: "users.viewallroles",
        sidebarProps: {
          displayText: "View All Roles",
        },
      },
      {
        path: "/users/assignrole",
        element: <AssignRole />,
        state: "users.assignrole",
        sidebarProps: {
          displayText: "Assign Role",
        },
      },
      {
        path: "/users/view/:id",
        element: <ViewUser />,
        state: "users.viewuser",
      },
      {
        path: "/users/edit/:id",
        element: <EditUser />,
        state: "users.edituser",
      },
    ],
  },
  {
    path: "/payments",
    element: <Outlet />,
    state: "payments",
    sidebarProps: {
      displayText: "Payments",
      icon: <AccountBalanceWalletIcon />,
    },
    child: [
      {
        path: "/payments/register-new-payment",
        element: <RegisterNewPayment />,
        state: "payments.registernewpayment",
        sidebarProps: {
          displayText: "Register New Payment",
        },
      },
      {
        path: "/payments/transactions",
        element: <Transactions />,
        state: "payments.transactions",
        sidebarProps: {
          displayText: "Transactions",
        },
      },
      {
        path: "/payments/receipts",
        element: <Receipts />,
        state: "payments.receipts",
        sidebarProps: {
          displayText: "Receipts",
        },
      },
    ],
  },
  {
    path: "/config",
    element: <Outlet />,
    state: "config",
    sidebarProps: {
      displayText: "Config",
      icon: <AccountBalanceWalletIcon />,
    },
    child: [
      {
        path: "/config/amenities",
        element: <Receipts />,
        state: "config.amenities",
        sidebarProps: {
          displayText: "Amenities",
        },
      },
    ],
  },
  {
    path: "/expense",
    element: <Outlet />,
    state: "expense",
    sidebarProps: {
      displayText: "Expense Tracker",
      icon: <AccountBalanceWalletIcon />,
    },
    child: [
      {
        path: "/expense/add-expense",
        element: <AddExpense />,
        state: "expense.addexpense",
        sidebarProps: {
          displayText: "Add Expense",
        },
      },
    ],
  },
];

export default appRoutes;
