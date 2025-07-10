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

export const DEFAULT_CUSTOM_PRICE = [0, 500] as [number, number];
