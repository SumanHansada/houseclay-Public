"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Tabs, { Tab, TabContent, TabHeader } from "@/components/common/Tabs";
import { PropertyStatusEnum } from "@/interfaces/Property";
import { UserPropertyInfo } from "@/interfaces/User";
import { useGetUserByPhoneNoQuery } from "@/store/apiSlice";
import { RootState } from "@/store/store";
import { clearUser, setUser } from "@/store/userSlice";

import { ContactedProperties } from "../components/ContactedProperties";
import { ListedProperties } from "../components/ListedProperties";
import { ShortlistedProperties } from "../components/ShortlistedProperties";
import { UserProfile } from "../components/UserProfile";
import { ViewedProperties } from "../components/ViewedProperties";
import { UserPropertyInfo } from "@/interfaces/User";
import { PropertyStatusEnum } from "@/interfaces/Property";
// import { UserDetailsNavbar } from "../components/UserDetailsNavbar";

export default function UserDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);
  const { userPhoneNo } = useParams() as { userPhoneNo: string };
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data, isLoading, isError } = useGetUserByPhoneNoQuery(
    { phoneNo: userPhoneNo },
    { skip: !isClient || !userPhoneNo },
  );

  const { currentUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (data?.user) {
      dispatch(setUser(data.user));
    }
  }, [data, dispatch]);

  const pathSegments = pathname.split("/");
  const currentTabFromUrl = pathSegments[pathSegments.length - 1];
  const validTabs = [
    "profile",
    "listed-properties",
    "shortlisted-properties",
    "connect-history",
    "payment-history",
    "contacted-properties",
    "viewed-properties",
    "reported-properties",
  ];
  const activeTab = validTabs.includes(currentTabFromUrl)
    ? currentTabFromUrl
    : "profile";

  const handleTabChange = (value: string) => {
    router.push(`/admin/user-details/${userPhoneNo}/${value}`);
  };

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <span className="text-gray-500">Loading...</span>
      </div>
    );
  }

  if (isLoading || !currentUser) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <span className="text-gray-500">Loading user details…</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <span className="text-red-500">Failed to fetch user details.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <Tabs
        onTabChange={handleTabChange}
        defaultActive={activeTab}
        className="flex flex-col"
      >
        <TabHeader>
          <Tab label="Profile" value="profile" />
          <Tab label="Listed Properties" value="listed-properties" />
          <Tab label="Shortlisted" value="shortlisted-properties" />
          <Tab label="Connect History" value="connect-history" />
          <Tab label="Payment History" value="payment-history" />
          <Tab label="Contacted" value="contacted-properties" />
          <Tab label="Viewed" value="viewed-properties" />
          <Tab label="Reported" value="reported-properties" />
        </TabHeader>
      </Tabs>
      <div className="flex-1">{children}</div>
    </div>
  );
}
