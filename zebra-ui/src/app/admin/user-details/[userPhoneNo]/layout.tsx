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
// import { UserDetailsNavbar } from "../components/UserDetailsNavbar";

// export default function UserDetailsIdLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
export default function UserDetailsIdLayout() {
  const { userPhoneNo } = useParams() as { userPhoneNo: string };
  // const router = useRouter();
  const dispatch = useDispatch();

  const { data, isLoading, isError } = useGetUserByPhoneNoQuery({
    phoneNo: userPhoneNo,
  });
  const { currentUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (data?.user) {
      dispatch(setUser(data.user));
    } else if (isError) {
      dispatch(clearUser());
    }
    return () => {
      dispatch(clearUser());
    };
  }, [data?.user, isError, dispatch]);

  if (isLoading || isError || !currentUser) {
    const msg = isLoading
      ? "Loading user details…"
      : isError
        ? "Failed to fetch user details."
        : "No user data available.";
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <span className={isError ? "text-red-500" : "text-gray-500"}>
          {msg}
        </span>
      </div>
    );
  }

  const dummyProperties: UserPropertyInfo[] = [
    {
      propertyID: "1",
      title: "3BHK Flat for sale",
      type: "sale",
      config: "3BHK",
      location: "Krishvi Gavakshi, ORR, Bengaluru",
      price: "1,00,00,000",
      status: PropertyStatusEnum.VERIFIED,
    },
    {
      propertyID: "2",
      title: "2BHK Flat looking for a roommate",
      type: "flatmate",
      config: "2BHK",
      location: "Krishvi Gavakshi, ORR, Bengaluru",
      price: "30,000",
      status: PropertyStatusEnum.PENDING,
    },
    {
      propertyID: "3",
      title: "1BHK Flat looking for a roommate",
      type: "rent",
      config: "1BHK",
      location: "Krishvi Gavakshi, ORR, Bengaluru",
      price: "30,000",
      status: PropertyStatusEnum.REPORTED,
    },
    {
      propertyID: "4",
      title: "2BHK Flat looking for a roommate",
      type: "flatmate",
      config: "2BHK",
      location: "Krishvi Gavakshi, ORR, Bengaluru",
      price: "30,000",
      status: PropertyStatusEnum.PENDING,
    },
    {
      propertyID: "5",
      title: "2BHK Flat looking for a roommate",
      type: "flatmate",
      config: "2BHK",
      location: "Krishvi Gavakshi, ORR, Bengaluru",
      price: "30,000",
      status: PropertyStatusEnum.PENDING,
    },
    {
      propertyID: "6",
      title: "2BHK Flat looking for a roommate",
      type: "flatmate",
      config: "2BHK",
      location: "Krishvi Gavakshi, ORR, Bengaluru",
      price: "30,000",
      status: PropertyStatusEnum.PENDING,
    },
    {
      propertyID: "7",
      title: "2BHK Flat looking for a roommate",
      type: "flatmate",
      config: "2BHK",
      location: "Krishvi Gavakshi, ORR, Bengaluru",
      price: "30,000",
      status: PropertyStatusEnum.PENDING,
    },
    {
      propertyID: "8",
      title: "2BHK Flat looking for a roommate",
      type: "flatmate",
      config: "2BHK",
      location: "Krishvi Gavakshi, ORR, Bengaluru",
      price: "30,000",
      status: PropertyStatusEnum.PENDING,
    },
    {
      propertyID: "9",
      title: "2BHK Flat looking for a roommate",
      type: "flatmate",
      config: "2BHK",
      location: "Krishvi Gavakshi, ORR, Bengaluru",
      price: "30,000",
      status: PropertyStatusEnum.PENDING,
    },
    {
      propertyID: "10",
      title: "2BHK Flat looking for a roommate",
      type: "flatmate",
      config: "2BHK",
      location: "Krishvi Gavakshi, ORR, Bengaluru",
      price: "30,000",
      status: PropertyStatusEnum.PENDING,
    },
    {
      propertyID: "11",
      title: "2BHK Flat looking for a roommate",
      type: "flatmate",
      config: "2BHK",
      location: "Krishvi Gavakshi, ORR, Bengaluru",
      price: "30,000",
      status: PropertyStatusEnum.PENDING,
    },
    {
      propertyID: "12",
      title: "2BHK Flat looking for a roommate",
      type: "flatmate",
      config: "2BHK",
      location: "Krishvi Gavakshi, ORR, Bengaluru",
      price: "30,000",
      status: PropertyStatusEnum.PENDING,
    },
    {
      propertyID: "13",
      title: "2BHK Flat looking for a roommate",
      type: "flatmate",
      config: "2BHK",
      location: "Krishvi Gavakshi, ORR, Bengaluru",
      price: "30,000",
      status: PropertyStatusEnum.PENDING,
    },
    {
      propertyID: "14",
      title: "2BHK Flat looking for a roommate",
      type: "flatmate",
      config: "2BHK",
      location: "Krishvi Gavakshi, ORR, Bengaluru",
      price: "30,000",
      status: PropertyStatusEnum.PENDING,
    },
    {
      propertyID: "15",
      title: "2BHK Flat looking for a roommate",
      type: "flatmate",
      config: "2BHK",
      location: "Krishvi Gavakshi, ORR, Bengaluru",
      price: "30,000",
      status: PropertyStatusEnum.PENDING,
    },
    {
      propertyID: "16",
      title: "2BHK Flat looking for a roommate",
      type: "flatmate",
      config: "2BHK",
      location: "Krishvi Gavakshi, ORR, Bengaluru",
      price: "30,000",
      status: PropertyStatusEnum.PENDING,
    },
    {
      propertyID: "17",
      title: "2BHK Flat looking for a roommate",
      type: "flatmate",
      config: "2BHK",
      location: "Krishvi Gavakshi, ORR, Bengaluru",
      price: "30,000",
      status: PropertyStatusEnum.PENDING,
    },
    {
      propertyID: "18",
      title: "2BHK Flat looking for a roommate",
      type: "flatmate",
      config: "2BHK",
      location: "Krishvi Gavakshi, ORR, Bengaluru",
      price: "30,000",
      status: PropertyStatusEnum.PENDING,
    },
    {
      propertyID: "19",
      title: "2BHK Flat looking for a roommate",
      type: "flatmate",
      config: "2BHK",
      location: "Krishvi Gavakshi, ORR, Bengaluru",
      price: "30,000",
      status: PropertyStatusEnum.PENDING,
    },
    {
      propertyID: "20",
      title: "2BHK Flat looking for a roommate",
      type: "flatmate",
      config: "2BHK",
      location: "Krishvi Gavakshi, ORR, Bengaluru",
      price: "30,000",
      status: PropertyStatusEnum.PENDING,
    },
    {
      propertyID: "21",
      title: "2BHK Flat looking for a roommate",
      type: "flatmate",
      config: "2BHK",
      location: "Krishvi Gavakshi, ORR, Bengaluru",
      price: "30,000",
      status: PropertyStatusEnum.PENDING,
    },
    {
      propertyID: "22",
      title: "4BHK Flat looking for a roommate",
      type: "sale",
      config: "2BHK",
      location: "Krishvi Gavakshi, ORR, Bengaluru",
      price: "3,00,00,000",
      status: PropertyStatusEnum.PENDING,
    },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <Tabs className="flex flex-col flex-1 overflow-hidden">
        <TabHeader>
          <Tab label="Profile" value="profile" />
          <Tab label="Listed Properties" value="listed-properties" />
          <Tab label="Shortlisted Properties" value="shortlisted-properties" />
          <Tab label="Connect History" value="connect-history" />
          <Tab label="Payment History" value="payment-history" />
          <Tab label="Contacted Properties" value="contacted-properties" />
          <Tab label="Viewed Properties*" value="viewed-properties" />
        </TabHeader>

        <TabContent value="profile">
          <div className="h-[calc(100vh-12rem)] overflow-auto">
            <UserProfile
              name={currentUser.name}
              email={currentUser.email}
              phoneNo={currentUser.phoneNo}
              createdAt={currentUser.createdAt}
              isBlacklisted={currentUser.blacklisted}
            />
          </div>
        </TabContent>

        <TabContent value="listed-properties">
          <ListedProperties ownedProperties={dummyProperties} />
        </TabContent>

        <TabContent value="shortlisted-properties">
          {/* <div className="h-[calc(100vh-12rem)] overflow-auto"> */}
          <ShortlistedProperties shortlistedProperties={dummyProperties} />
          {/* </div> */}
        </TabContent>

        <TabContent value="connect-history">
          <section className="px-4">
            <h2 className="text-2xl font-semibold mb-2">Connect History</h2>
            {currentUser.connectTransactions.length === 0 ? (
              <p>No connect transactions.</p>
            ) : (
              <ul className="divide-y">
                {currentUser.connectTransactions.map((txn) => (
                  <li key={txn.transactionId} className="py-2">
                    <p>
                      <span className="font-medium">Transaction ID:</span>
                      {txn.transactionId}
                    </p>
                    <p>
                      <span className="font-medium">Quantity:</span>
                      {txn.connectQuantity}
                    </p>
                    <p>
                      <span className="font-medium">Time:</span>
                      {new Date(txn.transactionTime).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </TabContent>

        <TabContent value="payment-history">
          <section className="px-4">
            <h2 className="text-2xl font-semibold mb-2">Payment History</h2>
            {currentUser.externalPayments.length === 0 ? (
              <p>No payment records.</p>
            ) : (
              <ul className="divide-y">
                {currentUser.externalPayments.map((pmt) => (
                  <li key={pmt.paymentId} className="py-2">
                    <p>
                      <span className="font-medium">Payment ID:</span>
                      {pmt.paymentId}
                    </p>
                    <p>
                      <span className="font-medium">Amount:</span> ₹{pmt.amount}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>
                      {pmt.status}
                    </p>
                    <p>
                      <span className="font-medium">Created:</span>
                      {new Date(pmt.createdAt).toLocaleString()}
                    </p>
                    <p>
                      <span className="font-medium">Completed:</span>
                      {pmt.completedAt
                        ? new Date(pmt.completedAt).toLocaleString()
                        : "—"}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </TabContent>

        <TabContent value="contacted-properties">
          <ContactedProperties contactedProperties={dummyProperties} />
        </TabContent>

        <TabContent value="viewed-properties">
          <ViewedProperties viewedProperties={dummyProperties} />
        </TabContent>
      </Tabs>
    </div>
  );
}
