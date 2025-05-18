import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Nunito } from "next/font/google";

import Header from "@/components/common/Header";
import Sidebar from "@/components/common/Sidebar";
import ReduxProvider from "@/providers/ReduxProvider";
import { DeviceContextProvider } from "@/providers/DeviceContextProvider";
import QueryProvider from "@/providers/QueryProvider";
import { DialogContextProvider } from "@/providers/DialogContextProvider";
import { SkeletonProvider } from "@/providers/SkeletonProvider";

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
  title: "Zebra UI",
  description: "Admin Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#EA3934" />
      </head>
      <body className={`${inter.variable} ${nutino.variable}`}>
        <ReduxProvider>
          <QueryProvider>
            <DeviceContextProvider>
              <DialogContextProvider>
                <SkeletonProvider>
                  <div className="min-h-screen bg-gray-50">
                    <Sidebar />
                    <Header />
                    <main className="pl-72 lg:pl-80 pt-16">{children}</main>
                  </div>
                </SkeletonProvider>
              </DialogContextProvider>
            </DeviceContextProvider>
          </QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
