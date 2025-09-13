import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Nunito } from "next/font/google";
import Script from "next/script";

import { Layout } from "@/layout-components";
import Providers from "@/providers/Providers";

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
    <html lang="en" className="scroll-smooth">
      <head>
        {/* <!-- Set the viewport. --> */}
        <meta
          name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1, maximum-scale=1, minimal-ui"
        />
        {/* <!-- Theme color of the web app --> */}
        <meta name="theme-color" content="#EA3934" />
        {/* <!-- Make the app title different than the page title - iOS. --> */}
        <meta name="apple-mobile-web-app-title" content="Houseclay" />
        {/* <!-- Description of the web app --> */}
        <meta
          name="description"
          content="Houseclay - No Middleman, Just Connects"
        />
        {/* <!-- Allow web app to be run in full-screen mode - iOS. --> */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        {/* <!-- Allow web app to be run in full-screen mode - Android. --> */}
        <meta name="mobile-web-app-capable" content="yes" />
        {/* <!-- Configure the status bar - iOS. --> */}
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />

        {/* <!-- STARTUP IMAGES - iOS only --> */}

        {/* <!-- iPad retina portrait startup image --> */}
        <link
          href="/web-app-manifest-512x512.png"
          media="(device-width: 768px) and (device-height: 1024px)
             and (-webkit-device-pixel-ratio: 2)
             and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />

        {/* <!-- iPad retina landscape startup image --> */}
        <link
          href="/web-app-manifest-512x512.png"
          media="(device-width: 768px) and (device-height: 1024px)
             and (-webkit-device-pixel-ratio: 2)
             and (orientation: landscape)"
          rel="apple-touch-startup-image"
        />

        {/* <!-- iPad non-retina portrait startup image --> */}
        <link
          href="/web-app-manifest-512x512.png"
          media="(device-width: 768px) and (device-height: 1024px)
             and (-webkit-device-pixel-ratio: 1)
             and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />

        {/* <!-- iPad non-retina landscape startup image --> */}
        <link
          href="/web-app-manifest-512x512.png"
          media="(device-width: 768px) and (device-height: 1024px)
             and (-webkit-device-pixel-ratio: 1)
             and (orientation: landscape)"
          rel="apple-touch-startup-image"
        />

        {/* <!-- iPhone 6 Plus portrait startup image --> */}
        <link
          href="/web-app-manifest-192x192.png"
          media="(device-width: 414px) and (device-height: 736px)
             and (-webkit-device-pixel-ratio: 3)
             and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />

        {/* <!-- iPhone 6 Plus landscape startup image --> */}
        <link
          href="/web-app-manifest-192x192.png"
          media="(device-width: 414px) and (device-height: 736px)
             and (-webkit-device-pixel-ratio: 3)
             and (orientation: landscape)"
          rel="apple-touch-startup-image"
        />
      </head>
      <body className={`${inter.variable} ${nutino.variable}`}>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
        {/* Razorpay checkout script */}
        <Script
          defer
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
