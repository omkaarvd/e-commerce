"use client";

import { CustomPagination } from "@/components/custom-pagination";
import EmptyState from "@/components/empty-state";
import Product from "@/components/product-component";
import ProductSkeleton from "@/components/product-skeleton";
import SearchBar from "@/components/search-bar";
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
import { AXIOS } from "@/lib/axios";
import {
  COLORS_FILTERS,
  DEFAULT_CUSTOM_PRICE,
  PRICE_FILTERS,
  SIZE_FILTERS,
  SORT_OPTIONS,
} from "@/lib/filters";
import { ProductState } from "@/lib/product-validator";
import { cn, formatPrice } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import { ChevronDown, Filter } from "lucide-react";
import { use, useCallback, useState } from "react";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export default function Home(props: PageProps) {
  const [filter, setFilter] = useState<ProductState>({
    sort: "none",
    color: [],
    price: { is_custom: false, range: DEFAULT_CUSTOM_PRICE },
    size: [],
  });

  const searchParams = use(props.searchParams);
  const query = searchParams.query;
  const page = searchParams.page || "1";

  const { data: products, refetch: refetchProducts } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const [filteredProducts, allProducts] = await Promise.all([
        AXIOS.post<SelectProduct[]>("/api/products", {
          filter: {
            sort: filter.sort,
            color: filter.color,
            price: filter.price.range,
            size: filter.size,
          },
          query,
          page,
        }),

        AXIOS.get<SelectProduct[]>("/api/products"),
      ]);

      return {
        data: filteredProducts.data,
        count: query ? filteredProducts.data.length : allProducts.data.length,
      };
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
        [category]: prev[category].filter((val) => val !== value),
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
    <>
      <div className="flex items-center justify-between gap-4 border-gray-200 py-6">
        <SearchBar refetch={debouncedRefetch} defaultValue={query || ""} />

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
                      <div className="flex items-center">
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
                          {`${formatPrice(filter.price.range[0], 0)} - 
                          ${formatPrice(filter.price.range[1], 0)}`}
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
            ) : products.data.length === 0 ? (
              <EmptyState />
            ) : (
              products.data.map((product) => (
                <Product key={product.id} product={product} />
              ))
            )}

            {/* Pagination */}
            <div className="text-center col-span-3">
              <CustomPagination
                page={parseInt(page)}
                pageSize={9}
                totalCount={products?.count || 0}
              />
            </div>
          </ul>
        </div>
      </section>
    </>
  );
}
