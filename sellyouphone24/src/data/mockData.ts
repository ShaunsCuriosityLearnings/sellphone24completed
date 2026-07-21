import { CategoryType, BrandType, ProductType, BlogType } from "@/types";

export const categories: CategoryType[] = [];

export const brands: BrandType[] = [];

export const products: ProductType[] = [];

export const storagePriceBoosts = {
  "16GB": 0,
  "64GB": 0,
  "128GB": 0,
  "256GB": 150,
  "512GB": 350,
  "1TB": 700,
};

export const conditions = [
  {
    slug: "flawless",
    name: "Flawless",
    description: "Like new, no scratches",
    multiplier: 1,
  },
  {
    slug: "good",
    name: "Good",
    description: "Light scratches, fully working",
    multiplier: 0.8,
  },
  {
    slug: "average",
    name: "Average",
    description: "Visible wear, fully working",
    multiplier: 0.6,
  },
  {
    slug: "broken",
    name: "Broken",
    description: "Cracked screen/back, functional issues",
    multiplier: 0.3,
  },
];

export const blogs: BlogType[] = [];
