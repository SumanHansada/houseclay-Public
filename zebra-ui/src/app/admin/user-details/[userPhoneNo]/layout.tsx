"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Tabs, { Tab, TabContent, TabHeader } from "@/components/common/Tabs";
import { useGetUserByPhoneNoQuery } from "@/store/apiSlice";
import { RootState } from "@/store/store";
import { clearUser, setUser } from "@/store/userSlice";
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <span className="text-gray-500">Loading user details…</span>
      </div>
    );
  }

  if (isError || !currentUser) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <span className="text-red-500">
          {isError
            ? "Failed to fetch user details."
            : "No user data available."}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex flex-col flex-1">
        {/* <div className="sticky top-0 z-10 bg-black text-white px-28">
          <UserDetailsNavbar id={userPhoneNo} />
        </div>
        <div className="flex-1 bg-gray-100 px-28 py-4 min-h-0">{children}</div> */}

        <div className="flex-1 text-2xl">
          <Tabs>
            <TabHeader>
              <Tab label="Profile" value="profile" />
              <Tab label="Listed Properties" value="listed-properties" />
              <Tab
                label="Shortlisted Properties"
                value="shortlisted-properties"
              />
              <Tab label="Connect History" value="connect-history" />
              <Tab label="Payment History" value="payment-history" />
              <Tab label="Contacted Properties" value="contacted-properties" />
              <Tab label="Viewed Properties*" value="viewed-properties" />
            </TabHeader>

            <TabContent value="profile">
              <section className="px-4">
                <h2 className="text-2xl font-semibold mb-2">Profile Details</h2>
                <p>
                  <span className="font-medium">Name:</span> {currentUser.name}
                </p>
                <p>
                  <span className="font-medium">Email:</span>
                  {currentUser.email}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>
                  {currentUser.phoneNo}
                </p>
                <p>
                  <span className="font-medium">Joined:</span>
                  {new Date(currentUser.createdAt).toLocaleString()}
                </p>
                <p>
                  <span className="font-medium">Blacklisted:</span>
                  {currentUser.blacklisted ? "Yes" : "No"}
                </p>
              </section>
            </TabContent>

            <TabContent value="listed-properties">
              <section className="px-4">
                <h2 className="text-2xl font-semibold mb-2">
                  Listed Properties
                </h2>
                {currentUser.ownedProperties.length === 0 ? (
                  <p>No owned properties.</p>
                ) : (
                  <ul className="divide-y">
                    {currentUser.ownedProperties.map((prop) => (
                      <li key={prop.propertyID} className="py-2">
                        <h3 className="font-medium">
                          {prop.title ?? "<No title provided>"}
                        </h3>
                        <p className="text-sm">{prop.description}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </TabContent>

            <TabContent value="shortlisted-properties">
              <section className="px-4">
                <h2 className="text-2xl font-semibold mb-2">
                  Shortlisted Properties
                </h2>
                {currentUser.shortlistedProperties.length === 0 ? (
                  <p>No shortlisted properties.</p>
                ) : (
                  <ul className="divide-y">
                    {currentUser.shortlistedProperties.map((prop) => (
                      <li key={prop.propertyID} className="py-2">
                        <h3 className="font-medium">
                          {prop.title ?? "[No title provided]"}
                        </h3>
                        <p className="text-sm">{prop.description}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
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
                          <span className="font-medium">Amount:</span> ₹
                          {pmt.amount}
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
              <section className="px-4">
                <h2 className="text-2xl font-semibold mb-2">
                  Contacted Properties
                </h2>
                {currentUser.contactedProperties.length === 0 ? (
                  <p>No contacted properties.</p>
                ) : (
                  <ul className="divide-y">
                    {currentUser.contactedProperties.map((prop) => (
                      <li key={prop.propertyID} className="py-2">
                        <h3 className="font-medium">
                          {prop.title ?? "<No title provided>"}
                        </h3>
                        <p className="text-sm">{prop.description}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </TabContent>

            <TabContent value="viewed-properties">
              <section className="px-4">
                <h2 className="text-2xl font-semibold mb-2">
                  Viewed Properties
                </h2>
                {currentUser.viewedProperties.length === 0 ? (
                  <p>No viewed properties.</p>
                ) : (
                  <ul className="divide-y">
                    {currentUser.viewedProperties.map((prop) => (
                      <li key={prop.propertyID} className="py-2">
                        <h3 className="font-medium">
                          {prop.title ?? "<No title provided>"}
                        </h3>
                        <p className="text-sm">{prop.description}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </TabContent>
          </Tabs>
        </div>
        <footer className="sticky bottom-0 bg-white border-t border-gray-300 py-2 text-center px-8 flex items-start">
          <button
            className="py-2 px-4 rounded-lg bg-gray-100 hover:bg-gray-300 border border-gray-400"
            onClick={() => router.back()}
          >
            Back
          </button>
        </footer>
      </div>
    </div>
  );
}
