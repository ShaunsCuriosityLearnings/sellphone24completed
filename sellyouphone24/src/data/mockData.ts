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
    id: "flawless",
    label: "Flawless",
    desc: "Like new, no scratches",
    priceMultiplier: 1,
  },
  {
    id: "good",
    label: "Good",
    desc: "Light scratches, fully working",
    priceMultiplier: 0.8,
  },
  {
    id: "average",
    label: "Average",
    desc: "Visible wear, fully working",
    priceMultiplier: 0.6,
  },
  {
    id: "broken",
    label: "Broken",
    desc: "Cracked screen/back, functional issues",
    priceMultiplier: 0.3,
  },
];

export const blogs: BlogType[] = [];
