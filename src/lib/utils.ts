import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SORT_OPTIONS = [
  { label: "None", value: "none" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
] as const;

export const COLORS_FILTERS = {
  id: "color",
  label: "Color",
  options: [
    { label: "White", value: "white" },
    { label: "Beige", value: "beige" },
    { label: "Blue", value: "blue" },
    { label: "Green", value: "green" },
    { label: "Purple", value: "purple" },
    { label: "Black", value: "black" },
  ],
} as const;

export const SIZE_FILTERS = {
  id: "size",
  label: "Size",
  options: [
    { label: "S", value: "S" },
    { label: "M", value: "M" },
    { label: "L", value: "L" },
  ],
} as const;

export const PRICE_FILTERS = {
  id: "price",
  label: "price",
  options: [
    { label: "Any Price", value: [0, 500] },
    { label: "Under ₹200", value: [0, 200] },
    { label: "Under ₹400", value: [0, 400] },
    // custom option defined in JSX
  ],
} as const;

export const DEFAULT_CUSTOM_PRICE = [0, 500] as [number, number];
