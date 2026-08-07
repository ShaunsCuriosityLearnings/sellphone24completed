import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import PageTransitionLoader from "@/components/PageTransitionLoader";
import { ClerkProvider } from "@clerk/nextjs";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Inter, Roboto, Poppins, Open_Sans, Lato } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-roboto", display: "swap" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-poppins", display: "swap" });
const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-open-sans", display: "swap" });
const lato = Lato({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-lato", display: "swap" });

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sellphonecash.com";
const isBeta = baseUrl.includes("beta");

export const metadata: Metadata = {
  title: {
    default: "SellPhoneCash | Sell Used Mobile Devices for Instant Cash in UAE",
    template: "%s | SellPhoneCash",
  },
  icons: {
    icon: "/favicon.webp",
  },
  robots: {
    index: !isBeta,
    follow: !isBeta,
  },
  description:
    "Sell your used smartphones, tablets, and smartwatches for the best price in Dubai, Abu Dhabi, and the wider UAE. Instant online valuation, free doorstep pickup, and instant payouts.",
  keywords: [
    "Sell phone Dubai",
    "Sell used iPhone UAE",
    "Sell Samsung phone Dubai",
    "Recycle mobile phone UAE",
    "Instant cash for phones",
    "Sell smartwatches online",
    "Used tablet buyers Dubai",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`
            ${inter.variable} ${roboto.variable} ${poppins.variable} ${openSans.variable} ${lato.variable}
            bg-slate-50
            text-slate-900
            antialiased
          `}
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          {/* Dynamic Route Transition Loading Overlay with Blue Shadow Blur */}
          <Suspense fallback={null}>
            <PageTransitionLoader />
          </Suspense>

          <div className="min-h-screen flex flex-col">
            {/* Decorative Modern Tech Gradient Background */}
            <div className="fixed inset-0 pointer-events-none -z-10">
              <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-[120px]" />
              <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-teal-500/5 blur-[120px]" />
            </div>

            {/* Header */}
            <Navbar />

            {/* Main Content */}
            <main className="flex-1">
              <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12 py-6">
                {children}
              </div>
            </main>

            {/* Footer */}
            <Footer />

            {/* Floating Customer Support Chatbot */}
            <ChatWidget />

            {/* Toast Notifications */}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              pauseOnHover
              theme="light"
            />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}

