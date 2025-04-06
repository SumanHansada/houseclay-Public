import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Nunito } from "next/font/google";

import Layout from "@/components/Layout";
import { DeviceContextProvider } from "@/providers/DeviceContextProvider";
import { DialogContextProvider } from "@/providers/DialogContextProvider";
import QueryProvider from "@/providers/QueryProvider";
import ReduxProvider from "@/providers/ReduxProvider";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const nutino = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "HouseClay",
  description: "No Middleman, Just Connects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#EA3934" />
        <meta name="apple-mobile-web-app-title" content="Houseclay" />
      </head>
      <body className={`${inter.variable} ${nutino.variable}`}>
        <ReduxProvider>
          <QueryProvider>
            <DeviceContextProvider>
              <DialogContextProvider>
                <Layout>{children}</Layout>
              </DialogContextProvider>
            </DeviceContextProvider>
          </QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
