import { api } from "@/lib/api";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await api.getBuyProductById(id);
    if (!product) {
      return {
        title: "Certified Pre-Owned Device | SellPhoneCash",
        description: "Certified pre-owned and refurbished mobile device in Dubai with 12-month store warranty.",
      };
    }

    const title = `Buy Certified ${product.title} - AED ${product.price}`;
    const desc = `Buy 100% genuine certified ${product.title} in Dubai. ${product.condition} condition, tested battery, 12-month store warranty, and instant doorstep delivery across UAE.`;

    const imageUrl = product.images?.frontView?.startsWith("http")
      ? product.images.frontView
      : product.images?.frontView
      ? `https://www.sellphonecash.com${product.images.frontView}`
      : "https://www.sellphonecash.com/logo.png";

    return {
      title,
      description: desc,
      alternates: {
        canonical: `/buy-phones/${id}`,
      },
      openGraph: {
        title: `${title} | SellPhoneCash`,
        description: desc,
        url: `https://www.sellphonecash.com/buy-phones/${id}`,
        images: [{ url: imageUrl, alt: product.title }],
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | SellPhoneCash`,
        description: desc,
        images: [imageUrl],
      },
    };
  } catch (error) {
    return {
      title: "Certified Pre-Owned Device | SellPhoneCash",
      description: "Certified pre-owned device in Dubai with 12-month store warranty.",
    };
  }
}

export default async function BuyProductDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let productJsonLd: any = null;

  try {
    const product = await api.getBuyProductById(id);
    if (product) {
      const imageUrl = product.images?.frontView?.startsWith("http")
        ? product.images.frontView
        : product.images?.frontView
        ? `https://www.sellphonecash.com${product.images.frontView}`
        : "https://www.sellphonecash.com/logo.png";

      productJsonLd = {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Product",
            "@id": `https://www.sellphonecash.com/buy-phones/${id}#product`,
            name: product.title,
            description: `Certified pre-owned ${product.title} in ${product.condition} condition with 12-month store warranty and tested battery.`,
            image: [imageUrl],
            brand: {
              "@type": "Brand",
              name: typeof product.brand === "string" ? product.brand : (product as any).brand?.name || "Apple",
            },
            model: product.model || product.title,
            offers: {
              "@type": "Offer",
              url: `https://www.sellphonecash.com/buy-phones/${id}`,
              priceCurrency: "AED",
              price: product.price,
              priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              itemCondition: "https://schema.org/UsedCondition",
              availability: (product.stock ?? 1) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              seller: {
                "@type": "Organization",
                name: "SellPhoneCash",
                url: "https://www.sellphonecash.com",
              },
              warranty: "12-Month Store Warranty",
            },
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://www.sellphonecash.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Buy Phones",
                item: "https://www.sellphonecash.com/buy-phones",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: product.title,
                item: `https://www.sellphonecash.com/buy-phones/${id}`,
              },
            ],
          },
        ],
      };
    }
  } catch (e) {
    // Graceful fallback if product query fails
  }

  return (
    <>
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}
      {children}
    </>
  );
}
