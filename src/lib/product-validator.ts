import { z } from "zod";

const AVAILABLE_SIZES = ["S", "M", "L"] as const;
const AVAILABLE_COLORS = [
  "white",
  "beige",
  "blue",
  "green",
  "purple",
  "black",
] as const;
const SORT_OPTIONS = ["none", "price-asc", "price-desc"] as const;

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
    range: [number, number];
  };
};
