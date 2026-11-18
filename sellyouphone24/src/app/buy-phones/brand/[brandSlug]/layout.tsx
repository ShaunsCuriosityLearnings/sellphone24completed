import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ brandSlug: string }>;
}): Promise<Metadata> {
  const { brandSlug } = await params;
  const formattedBrand = decodeURIComponent(brandSlug)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const title = `Buy Certified Pre-Owned ${formattedBrand} Phones in Dubai`;
  const description = `Shop verified pre-owned & refurbished ${formattedBrand} devices in Dubai with 12-month warranty, certified 30-point inspection, and instant UAE delivery.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/buy-phones/brand/${encodeURIComponent(brandSlug.toLowerCase())}`,
    },
    openGraph: {
      title: `${title} | SellPhoneCash`,
      description,
      url: `https://www.sellphonecash.com/buy-phones/brand/${encodeURIComponent(brandSlug.toLowerCase())}`,
    },
  };
}

export default function BuyBrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

