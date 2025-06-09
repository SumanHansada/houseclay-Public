"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Tabs, { Tab, TabContent, TabHeader } from "@/components/common/Tabs";
import { useGetUserByPhoneNoQuery } from "@/store/apiSlice";
import { RootState } from "@/store/store";
import { clearUser, setUser } from "@/store/userSlice";

import { ListedProperties } from "../components/ListedProperties";
import { UserProfile } from "../components/UserProfile";
import { ShortlistedProperties } from "../components/ShortlistedProperties";
import { ContactedProperties } from "../components/ContactedProperties";
import { ViewedProperties } from "../components/ViewedProperties";
// import { UserDetailsNavbar } from "../components/UserDetailsNavbar";

// export default function UserDetailsIdLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
export default function UserDetailsIdLayout() {
  const { userPhoneNo } = useParams() as { userPhoneNo: string };
  const router = useRouter();
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
          <div className="h-[calc(100vh-12rem)] overflow-auto">
            <ListedProperties ownedProperties={currentUser.ownedProperties} />
          </div>
        </TabContent>

        <TabContent value="shortlisted-properties">
          <div className="h-[calc(100vh-12rem)] overflow-auto">
            <ShortlistedProperties
              shortlistedProperties={currentUser.shortlistedProperties}
            />
          </div>
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
          <ContactedProperties
            contactedProperties={currentUser.contactedProperties}
          />
        </TabContent>

        <TabContent value="viewed-properties">
          <ViewedProperties viewedProperties={currentUser.viewedProperties} />
        </TabContent>
      </Tabs>
      <footer className="sticky bottom-0 bg-white border-t border-gray-300 py-2 text-center px-8 flex items-start">
        <button
          className="py-2 px-4 rounded-lg bg-gray-100 hover:bg-gray-300 border border-gray-400"
          onClick={() => router.back()}
        >
          Back
        </button>
      </footer>
    </div>
  );
}
