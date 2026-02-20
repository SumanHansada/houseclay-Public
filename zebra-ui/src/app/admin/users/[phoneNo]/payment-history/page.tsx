import { Metadata } from "next";

import { safeUrlDecode } from "@/utils/core";

import { PaymentHistoryView } from "./PaymentHistoryView";

interface PageProps {
  params: Promise<{ phoneNo: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Payment History | User Management",
  };
}

export default async function PaymentHistoryPage({ params }: PageProps) {
  const { phoneNo } = await params;
  const decodedPhone = safeUrlDecode(phoneNo);

  return <PaymentHistoryView userPhoneNo={decodedPhone} />;
}
