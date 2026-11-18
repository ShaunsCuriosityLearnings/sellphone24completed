import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import PageTransitionLoader from "@/components/PageTransitionLoader";
import Script from "next/script";
import { GTM_ID } from "@/lib/gtm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.sellphonecash.com";
const isBeta = baseUrl.includes("beta");

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: "./",
  },
  title: {
    default: "SellPhoneCash | Sell Used Mobile Devices for Instant Cash in UAE",
    template: "%s | SellPhoneCash",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.webp", type: "image/webp" },
    ],
    apple: "/logo.png",
  },
  robots: {
    index: !isBeta,
    follow: !isBeta,
  },
  description:
    "Sell your used smartphones, tablets, and smartwatches for the best price in Dubai, Abu Dhabi, and the wider UAE. Instant online valuation, free doorstep pickup, and instant payouts.",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "google-site-verification-sellphonecash",
  },
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

import AnalyticsProvider from "@/components/AnalyticsProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@graph": [
                  {
                    "@type": "Organization",
                    "@id": "https://www.sellphonecash.com/#organization",
                    "name": "SellPhoneCash",
                    "url": "https://www.sellphonecash.com",
                    "logo": {
                      "@type": "ImageObject",
                      "url": "https://www.sellphonecash.com/logo.png",
                      "width": 570,
                      "height": 133
                    },
                    "description": "Premier electronics re-commerce platform in UAE for selling used phones for instant cash and buying certified pre-owned devices with 12-month warranty.",
                    "areaServed": [
                      { "@type": "City", "name": "Dubai" },
                      { "@type": "City", "name": "Abu Dhabi" },
                      { "@type": "City", "name": "Sharjah" },
                      { "@type": "Country", "name": "United Arab Emirates" }
                    ],
                    "contactPoint": {
                      "@type": "ContactPoint",
                      "telephone": "+971555549817",
                      "contactType": "customer service",
                      "areaServed": "AE",
                      "availableLanguage": ["English", "Arabic"]
                    }
                  },
                  {
                    "@type": "WebSite",
                    "@id": "https://www.sellphonecash.com/#website",
                    "url": "https://www.sellphonecash.com",
                    "name": "SellPhoneCash",
                    "publisher": {
                      "@id": "https://www.sellphonecash.com/#organization"
                    }
                  }
                ]
              }),
            }}
          />
          <Script
            id="gtm-script"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){
                  w[l]=w[l]||[];
                  function initGTM(){
                    if (w.__gtmLoaded) return;
                    w.__gtmLoaded = true;
                    w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
                    var f=d.getElementsByTagName(s)[0], j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
                    j.async=true; j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                    f.parentNode.insertBefore(j,f);
                  }
                  if ('requestIdleCallback' in w) {
                    w.requestIdleCallback(function(){ setTimeout(initGTM, 1500); }, { timeout: 3500 });
                  } else {
                    w.addEventListener('load', function(){ setTimeout(initGTM, 1500); });
                  }
                  ['scroll', 'touchstart', 'click'].forEach(function(e){
                    w.addEventListener(e, initGTM, { once: true, passive: true });
                  });
                })(window,document,'script','dataLayer','${GTM_ID}');
              `,
            }}
          />
        </head>
        <body
          className="bg-slate-50 text-slate-900 antialiased"
          style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}
        >
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
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
            <main className="flex-1 w-full min-h-[calc(100vh-4rem)]">
              <Suspense fallback={null}>
                <AnalyticsProvider>
                  {children}
                </AnalyticsProvider>
              </Suspense>
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
  );
}

