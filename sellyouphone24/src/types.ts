import { z } from "zod";

export type ProductImagesType = {
  frontView: string;
  sideView: string;
  backView: string;
};

export type StorageType = {
  size: string;
  priceBoost: number;
};

export type ProductType = {
  id: number | string;
  _id?: string;
  name: string;
  brand: string;
  category: string; // e.g. 'smartphones', 'tablets', 'watches'
  basePrice: number;
  storages: StorageType[];
  colors: string[]; // e.g. ["Black Titanium", "Natural Titanium", "White Titanium"]
  description: string;
  shortDescription: string;
  images: ProductImagesType;
};

export type ProductsType = ProductType[];

export type CartItemType = {
  id: number | string;
  _id?: string;
  name: string;
  brand: string;
  category: string;
  basePrice: number;
  selectedStorage: string;
  selectedColor: string;
  selectedCondition: string;
  quantity: number;
  calculatedPrice: number;
  images: ProductImagesType;
  shortDescription: string;
};

export type CartItemsType = CartItemType[];

export const shippingFormSchema = z.object({
  name: z.string().min(1, "Full Name is required!"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z
    .string()
    .min(7, "Mobile number is too short!")
    .max(15, "Mobile number is too long!"),
  city: z.string().min(1, "Area / Location is required!"),
  building: z.string().min(1, "Building / Tower is required!"),
  apartment: z.string().optional(),
  additionalNotes: z.string().optional(),
  pickupOption: z.enum(["3_hours", "scheduled"]),
  pickupDate: z.string().min(1, "Pickup date is required!"),
  pickupTime: z.string().min(1, "Pickup time slot is required!"),
  address: z.string().optional(),
});

export type ShippingFormInputs = z.infer<typeof shippingFormSchema>;

export const PaymentFormSchema = z.object({
  paymentMethod: z.literal("cash"),
});

export type PaymentFormInputs = z.infer<typeof PaymentFormSchema>;

export type CartStoreStateType = {
  cart: CartItemsType;
  hasHydrated: boolean;
};

export type CartStoreActionsType = {
  addToCart: (product: CartItemType) => void;
  removeFromCart: (product: CartItemType) => void;
  clearCart: () => void;
};

export type BrandType = {
  id: number | string;
  _id?: string;
  name: string;
  slug: string;
  logo: string;
  categories?: any[];
};

export type CategoryType = {
  id: number | string;
  _id?: string;
  name: string;
  slug: string;
  description: string;
  image: string;
};

export type BlogType = {
  id: number | string;
  _id?: string;
  title: string;
  slug: string;
  desc: string;
  content: string;
  img: string;
  category: string;
  createdAt?: string;
  author: string;
  views?: number;
  likes?: number;
};

export type CommentType = {
  id: number;
  postId: number;
  author: string;
  content: string;
  createdAt: string;
};
