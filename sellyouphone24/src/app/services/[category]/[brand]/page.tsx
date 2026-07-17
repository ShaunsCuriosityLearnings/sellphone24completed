import { redirect } from "next/navigation";

const BrandPage = async ({
  params,
}: {
  params: Promise<{ category: string; brand: string }>;
}) => {
  const { category: categorySlug, brand: brandSlug } = await params;
  
  // Redirect to the new Product Listing Page with the brand filter
  redirect(`/services/${categorySlug}?brand=${brandSlug}`);
};

export default BrandPage;
