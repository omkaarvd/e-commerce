import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capetalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const formatDate = (dateString: string | Date | null) => {
  if (!dateString) return "Date not available";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatPrice = (price: number, maximumFractionDigits?: number) => {
  return price.toLocaleString("en-IN", {
    maximumFractionDigits: maximumFractionDigits ?? 2,
    style: "currency",
    currency: "INR",
  });
};

export const getTotalPrice = (price: number, quantity: number) => {
  return formatPrice(price * quantity);
};
