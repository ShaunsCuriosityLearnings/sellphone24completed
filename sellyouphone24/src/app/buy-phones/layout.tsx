import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buy Certified Pre-Owned Phones & Laptops in Dubai | 12-Month Warranty",
  description:
    "Shop certified pre-owned and refurbished iPhones, Samsung Galaxy phones, MacBooks, and iPads in Dubai. Every device features a 30-point inspection, 12-month store warranty, and fast UAE doorstep delivery.",
  alternates: {
    canonical: "/buy-phones",
  },
  openGraph: {
    title: "Buy Certified Pre-Owned Phones in Dubai | SellPhoneCash",
    description:
      "100% verified pre-owned phones and laptops with 12-month store warranty and instant UAE delivery.",
    url: "https://www.sellphonecash.com/buy-phones",
  },
};

export default function BuyPhonesRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

