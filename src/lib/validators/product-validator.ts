import { z } from "zod";

export const AVAILABLE_SIZES = ["S", "M", "L"] as const;
export const AVAILABLE_COLORS = [
  "white",
  "beige",
  "blue",
  "green",
  "purple",
] as const;
export const SORT_OPTIONS = ["none", "price-asc", "price-desc"] as const;

export const ProductFilterValidator = z.object({
  size: z.array(z.enum(AVAILABLE_SIZES)),
  color: z.array(z.enum(AVAILABLE_COLORS)),
  sort: z.enum(SORT_OPTIONS),
  price: z.tuple([z.number(), z.number()]),
});

export type ProductState = Omit<
  z.infer<typeof ProductFilterValidator>,
  "price"
> & {
  price: {
    is_custom: boolean;
    range: [number, number];
  };
};
