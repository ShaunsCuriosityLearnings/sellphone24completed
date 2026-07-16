import { z } from "zod";

export type ProductImagesType = {
  frontView: string;
  sideView: string;
  backView: string;
};

export type ProductType = {
  id: number | string;
  _id?: string;
  name: string;
  brand: string;
  category: string; // e.g. 'smartphones', 'tablets', 'watches'
  basePrice: number;
  storages: string[]; // e.g. ["128GB", "256GB", "512GB", "1TB"]
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
  name: z.string().min(1, "Name is required!"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(7, "Phone number is too short!")
    .max(15, "Phone number is too long!")
    .regex(/^\+?\d+$/, "Phone number must contain only numbers and optional leading +!"),
  address: z.string().min(1, "Pickup address is required!"),
  city: z.string().min(1, "Emirate/City is required!"),
  state: z.string().min(1, "Country is required!"),
  pincode: z.string().optional(),
  pickupDate: z.string().min(1, "Pickup date is required!"),
  pickupTime: z.string().min(1, "Pickup time slot is required!"),
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
