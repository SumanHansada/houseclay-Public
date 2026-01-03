import type { Metadata } from "next";

import { WEBSITE_BASE_URL } from "@/common/constants";

import ListPropertyClient from "./ListPropertyClient";
import ListPropertyMarketing from "./ListPropertyMarketing";

export const metadata: Metadata = {
  title: "List your Property for Free",
  description: "Zero Brokerage. Verified Tenants",
  alternates: {
    canonical: `${WEBSITE_BASE_URL}/list-property`,
  },
  openGraph: {
    title: "List your Property for Free",
    description: "Zero Brokerage. Verified Tenants",
    url: `${WEBSITE_BASE_URL}/list-property`,
    type: "website",
    images: [
      {
        url: "https://cdn.houseclay.com/public/images/list-property-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "List your Property for Free - Zero Brokerage. Verified Tenants",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "List your Property for Free",
    description: "Zero Brokerage. Verified Tenants",
    images: [
      "https://cdn.houseclay.com/public/images/list-property-og-image.jpg",
    ],
  },
};

const ListPropertyPage = () => {
  return (
    <>
      <ListPropertyClient />
      <ListPropertyMarketing />
    </>
  );
};

export default ListPropertyPage;
