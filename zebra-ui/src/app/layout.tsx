import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Nunito } from "next/font/google";

import Header from "@/components/common/Header";
import Sidebar from "@/components/common/Sidebar";
import Providers from "@/providers/Providers";

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
        <Providers>
          <div className="min-h-screen bg-gray-50">
            <Sidebar />
            <Header />
            <main className="pl-72 lg:pl-80 pt-16">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
