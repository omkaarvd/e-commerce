"use client";

import EmptyState from "@/components/products/empty-state";
import Product from "@/components/products/product";
import ProductSkeleton from "@/components/products/product-skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { SelectProduct } from "@/db/schema";
import { cn } from "@/lib/utils";
import { ProductState } from "@/lib/validators/product-validator";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import debounce from "lodash.debounce";
import { ChevronDown, Filter } from "lucide-react";
import { useCallback, useState } from "react";

const SORT_OPTIONS = [
  { label: "None", value: "none" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
] as const;

const SUBCATEGORIES = [
  { label: "T-Shirts", selected: true, href: "#" },
  { label: "Hoodies", selected: false, href: "#" },
  { label: "Sweatshirts", selected: false, href: "#" },
  { label: "Accessories", selected: false, href: "#" },
] as const;

const COLORS_FILTERS = {
  id: "color",
  label: "Color",
  options: [
    { label: "White", value: "white" },
    { label: "Beige", value: "beige" },
    { label: "Blue", value: "blue" },
    { label: "Green", value: "green" },
    { label: "Purple", value: "purple" },
  ],
} as const;

const SIZE_FILTERS = {
  id: "size",
  label: "Size",
  options: [
    { label: "S", value: "S" },
    { label: "M", value: "M" },
    { label: "L", value: "L" },
  ],
} as const;

const PRICE_FILTERS = {
  id: "price",
  label: "price",
  options: [
    { label: "Any Price", value: [0, 500] },
    { label: "Under ₹200", value: [0, 200] },
    { label: "Under ₹400", value: [0, 400] },
    // custom option defined in JSX below
  ],
} as const;

const DEFAULT_CUSTOM_PRICE = [0, 500] as [number, number];

export default function Home() {
  const [filter, setFilter] = useState<ProductState>({
    sort: "none",
    color: ["beige", "blue", "green", "purple", "white"],
    price: { is_custom: false, range: DEFAULT_CUSTOM_PRICE },
    size: ["L", "M", "S"],
  });

  const { data: products, refetch: refetchProducts } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await axios.post<SelectProduct[]>("/api/products", {
        filter: {
          sort: filter.sort,
          color: filter.color,
          price: filter.price.range,
          size: filter.size,
        },
      });

      return data;
    },
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedRefetch = useCallback(debounce(refetchProducts, 700), []);

  const applyColorAndSizeFilter = ({
    category,
    value,
  }: {
    category: keyof Omit<typeof filter, "price" | "sort">;
    value: string;
  }) => {
    const isFilterExist = filter[category].includes(value as never);

    if (isFilterExist) {
      setFilter((prev) => ({
        ...prev,
        [category]: prev[category].filter((item) => item !== value),
      }));
    } else {
      setFilter((prev) => ({
        ...prev,
        [category]: [...prev[category], value],
      }));
    }

    debouncedRefetch();
  };

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          High Quality Cotton Selection
        </h1>

        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger className="group inline-flex justify-center font-medium text-gray-700 hover:text-gray-900">
              Sort
              <ChevronDown className="-mr-1 ml-1 size-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {SORT_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => {
                    setFilter((prev) => ({ ...prev, sort: option.value }));

                    debouncedRefetch();
                  }}
                  className={cn("text-base", {
                    "text-gray-900 bg-gray-100": filter.sort === option.value,
                    "text-gray-500": filter.sort !== option.value,
                  })}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <button className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden">
            <Filter className="size-5" />
          </button>
        </div>
      </div>

      <section className="pb-12 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-8 gap-y-10">
          {/* filters */}
          <div className="hidden lg:block">
            <ul className="space-y-4 border-b border-gray-200 pb-6 font-medium text-gray-900">
              {SUBCATEGORIES.map((sub_category) => (
                <li key={sub_category.label}>
                  <button
                    disabled={!sub_category.selected}
                    className="disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {sub_category.label}
                  </button>
                </li>
              ))}
            </ul>

            <Accordion type="multiple">
              {/* Color filter */}
              <AccordionItem value="color">
                <AccordionTrigger className="py-3 text-gray-400 hover:text-gray-500">
                  <span className="font-medium text-gray-900">Color</span>
                </AccordionTrigger>

                <AccordionContent>
                  <ul className="space-y-4">
                    {COLORS_FILTERS.options.map((option, idx) => (
                      <li key={option.value} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`color-${idx}`}
                          className="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          onChange={() => {
                            applyColorAndSizeFilter({
                              category: "color",
                              value: option.value,
                            });
                          }}
                          checked={filter.color.includes(option.value)}
                        />
                        <label
                          htmlFor={`color-${idx}`}
                          className="ml-3 text-gray-600 text-sm"
                        >
                          {option.label}
                        </label>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* Size filter */}
              <AccordionItem value="size">
                <AccordionTrigger className="py-3 text-gray-400 hover:text-gray-500">
                  <span className="font-medium text-gray-900">Size</span>
                </AccordionTrigger>

                <AccordionContent>
                  <ul className="space-y-4">
                    {SIZE_FILTERS.options.map((option, idx) => (
                      <li key={option.value} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`size-${idx}`}
                          className="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          onChange={() => {
                            applyColorAndSizeFilter({
                              category: "size",
                              value: option.value,
                            });
                          }}
                          checked={filter.size.includes(option.value)}
                        />
                        <label
                          htmlFor={`size-${idx}`}
                          className="ml-3 text-gray-600 text-sm"
                        >
                          {option.label}
                        </label>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* Price filter */}
              <AccordionItem value="price">
                <AccordionTrigger className="py-3 text-gray-400 hover:text-gray-500">
                  <span className="font-medium text-gray-900">Price</span>
                </AccordionTrigger>

                <AccordionContent>
                  <ul className="space-y-4">
                    {PRICE_FILTERS.options.map((option, idx) => (
                      <li key={option.label} className="flex items-center">
                        <input
                          type="radio"
                          id={`price-${idx}`}
                          className="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          onChange={() => {
                            setFilter((prev) => ({
                              ...prev,
                              price: {
                                is_custom: false,
                                range: [...option.value],
                              },
                            }));

                            debouncedRefetch();
                          }}
                          checked={
                            !filter.price.is_custom &&
                            option.value[0] === filter.price.range[0] &&
                            option.value[1] === filter.price.range[1]
                          }
                        />
                        <label
                          htmlFor={`price-${idx}`}
                          className="ml-3 text-gray-600 text-sm"
                        >
                          {option.label}
                        </label>
                      </li>
                    ))}
                    <li className="flex justify-center flex-col gap-2">
                      <div>
                        <input
                          type="radio"
                          id="price-custom"
                          className="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          onChange={() => {
                            setFilter((prev) => ({
                              ...prev,
                              price: {
                                is_custom: true,
                                range: DEFAULT_CUSTOM_PRICE,
                              },
                            }));

                            debouncedRefetch();
                          }}
                          checked={filter.price.is_custom}
                        />
                        <label
                          htmlFor="price-custom"
                          className="ml-3 text-gray-600 text-sm"
                        >
                          Custom
                        </label>
                      </div>

                      <div className="flex justify-between">
                        <p className="font-medium">Price</p>

                        <div>
                          ₹{filter.price.range[0].toFixed(0)} - ₹
                          {filter.price.range[1].toFixed(0)}
                        </div>
                      </div>

                      <Slider
                        className={cn({
                          "opacity-50": !filter.price.is_custom,
                        })}
                        disabled={!filter.price.is_custom}
                        onValueChange={(range) => {
                          setFilter((prev) => ({
                            ...prev,
                            price: {
                              is_custom: true,
                              range: [range[0], range[1]],
                            },
                          }));

                          debouncedRefetch();
                        }}
                        value={
                          filter.price.is_custom
                            ? filter.price.range
                            : DEFAULT_CUSTOM_PRICE
                        }
                        min={DEFAULT_CUSTOM_PRICE[0]}
                        defaultValue={DEFAULT_CUSTOM_PRICE}
                        max={DEFAULT_CUSTOM_PRICE[1]}
                        // step={5}
                      />
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* product grid */}
          <ul className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {!products ? (
              new Array(9)
                .fill(null)
                .map((_, idx) => <ProductSkeleton key={idx} />)
            ) : products.length === 0 ? (
              <EmptyState />
            ) : (
              products.map((product) => (
                <Product key={product.id} product={product} />
              ))
            )}
          </ul>
        </div>
      </section>
    </main>
  );
}
